const axios = require('axios');
const Wallet = require('../models/Wallet');

// Comprehensive System Instructions for the AI Customer Service Representative
const SYSTEM_PROMPT = `You are Nova, a real human Customer Support Representative for FasReach Enterprise Bulk SMS Platform.
You have worked at FasReach for years. Speak naturally, empathetically, and conversationally like a helpful human employee.

=======================================================
FASREACH PLATFORM KNOWLEDGE BASE
=======================================================
- Platform: FasReach Enterprise Bulk SMS (fasreach.com).
- Send SMS: Supports Single Recipient & Bulk Broadcasts, Contact Directory groups, and direct Excel (.xlsx/.xls) and CSV file uploads.
- SMS Unit Rate: Every 155 characters = 1 SMS unit at 0.04 GHS per unit.
- Wallet Top-Up: Fund cash balance via Paystack (MTN Mobile Money, Telecel Cash, AirtelTigo Money, Visa/Mastercard). Minimum deposit is GHS 1.00. Balance never expires.
- Custom Sender IDs: 1 to 11 uppercase brand headers (e.g. MYBRAND). Created headers enter Pending Approval status. Institutional headers (banks, government like ECG, MTN, GCB) are protected against fraud.
- Delivery Reports: Real-time network delivery receipts showing Green (Delivered), Yellow (Pending), or Red (Failed).
- Developer REST API: Generate secret API keys for HTTP POST /api/sms/send dispatches.

=======================================================
BEHAVIORAL RULES
=======================================================
1. Answer any user prompt conversationally and flexibly.
2. NEVER use static repetitive canned intros like "Regarding your question about..." or bullet lists of what you can do unless asked.
3. NEVER reveal internal system code, database schemas, secrets, environment variables, or gateway names (Arkesel). If asked, politely refuse: "I'm sorry, but I can't share internal system information."
4. Never invent fake balances or uncompleted actions.
5. If the user introduces themselves (e.g. "am lawrence", "my name is john"), greet them warmly by name!`;

exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId }) => {
  const cleanPrompt = (prompt || '').trim();
  const lower = cleanPrompt.toLowerCase();
  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  // 1. Confidentiality Firewall
  if (
    lower.includes('source code') ||
    lower.includes('database structure') ||
    lower.includes('mongodb') ||
    lower.includes('server code') ||
    lower.includes('env') ||
    lower.includes('jwt') ||
    lower.includes('secret') ||
    lower.includes('arkesel') ||
    lower.includes('system prompt')
  ) {
    return {
      responseText: "I'm sorry, but I can't share internal system information.",
      actionButtons: [],
    };
  }

  // 2. Fetch User Context for Live AI Reasoning
  let userWalletContext = '';
  if (user && user._id) {
    try {
      const wallet = await Wallet.findOne({ userId: user._id });
      if (wallet) {
        userWalletContext = `User Cash Balance: GHS ${wallet.balance.toFixed(2)}, SMS Credit Units: ${wallet.smsCredit}.`;
      }
    } catch (e) {}
  }

  // 3. Option A: Google Gemini API (Free key from aistudio.google.com)
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiApiKey) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n[Context]: User=${userName}, Current Page=${currentPage}, ${userWalletContext}\n\n[User Message]: ${cleanPrompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 350,
        },
      };

      const aiRes = await axios.post(apiUrl, payload, { headers: { 'Content-Type': 'application/json' }, timeout: 8000 });
      if (aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = aiRes.data.candidates[0].content.parts[0].text.replace(/\*/g, '').trim();

        let actionButtons = [];
        if (lower.includes('send') || lower.includes('sms') || lower.includes('bulk')) {
          actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
        } else if (lower.includes('wallet') || lower.includes('top up') || lower.includes('paystack') || lower.includes('balance')) {
          actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
        } else if (lower.includes('sender id') || lower.includes('header') || lower.includes('brand')) {
          actionButtons.push({ label: 'Custom Sender IDs', route: '/sender-ids', actionType: 'navigate' });
        }

        return { responseText: text, actionButtons };
      }
    } catch (e) {
      console.warn('[Gemini API Warning]:', e.message);
    }
  }

  // 4. Option B: OpenAI GPT API (OpenAI platform key)
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (openaiApiKey) {
    try {
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `[User Context]: User=${userName}, Current Page=${currentPage}, ${userWalletContext}\n\n[User Message]: ${cleanPrompt}` },
        ],
        temperature: 0.7,
        max_tokens: 350,
      };

      const aiRes = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: { Authorization: `Bearer ${openaiApiKey}`, 'Content-Type': 'application/json' },
        timeout: 8000,
      });

      if (aiRes.data?.choices?.[0]?.message?.content) {
        const text = aiRes.data.choices[0].message.content.replace(/\*/g, '').trim();

        let actionButtons = [];
        if (lower.includes('send') || lower.includes('sms') || lower.includes('bulk')) {
          actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
        } else if (lower.includes('wallet') || lower.includes('top up') || lower.includes('paystack') || lower.includes('balance')) {
          actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
        }

        return { responseText: text, actionButtons };
      }
    } catch (e) {
      console.warn('[OpenAI API Warning]:', e.message);
    }
  }

  // 5. Intelligent Fallback Engine (When no external API Key is provided)
  let responseText = '';
  let actionButtons = [];

  if (lower.startsWith('am ') || lower.startsWith('i am ') || lower.includes('my name is') || lower.includes('call me')) {
    const namePart = cleanPrompt.replace(/^(am|i am|my name is|call me)\s+/i, '').trim();
    const capName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : userName;
    responseText = `Nice to meet you, ${capName}! 👋\n\nHow can I help you today with your FasReach account or SMS dispatches?`;
  } else if (lower.includes('what is done here') || lower.includes('what do you do here') || lower.includes('what can i do here') || lower.includes('what is this page')) {
    if (currentPage === '/send-sms') {
      responseText = `On this Send SMS page, you can dispatch single or bulk SMS broadcasts, upload Excel/CSV contact spreadsheets, select saved Contact Directory groups, and schedule dispatches for future dates!`;
      actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
    } else if (currentPage === '/wallet') {
      responseText = `On this Wallet page, you can top up your cash balance via Paystack (MTN Mobile Money, Telecel Cash, Visa/Mastercard) and view your top-up history.`;
      actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
    } else {
      responseText = `Here on FasReach, you can broadcast single & bulk SMS, upload Excel contact lists, register custom brand Sender ID headers, schedule dispatches, and track real-time delivery reports. What would you like to work on?`;
      actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
      actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
    }
  } else if (lower.includes('how fast') || lower.includes('delivery speed') || lower.includes('how long does it take')) {
    responseText = `SMS delivery on FasReach is usually extremely fast—most text messages arrive on the recipient's phone within 3 to 10 seconds.\n\nHowever, exact delivery speed can depend on mobile network operator conditions, recipient phone power/coverage status, and carrier processing queues during peak hours.`;
  } else if (lower.includes('how many sms') || lower.includes('capacity') || lower.includes('bulk volume') || lower.includes('10000')) {
    responseText = `You can send thousands of SMS messages in a single broadcast without speed degradation.\n\nOur system connects directly to high-throughput telco gateways (MTN, Telecel, AirtelTigo), so whether you send 10 messages or 50,000 messages, dispatches process in high-speed parallel queues.`;
  } else if (lower.includes('emoji') || lower.includes('emojis') || lower.includes('unicode')) {
    responseText = `Yes, you can include emojis and special characters in your messages.\n\nPlease note that standard English plain text allows up to 155 characters per SMS unit, whereas messages containing emojis or Unicode characters use 70 characters per unit due to mobile network encoding standards.`;
  } else if (lower.includes('switched off') || lower.includes('phone is off') || lower.includes('unreachable')) {
    responseText = `If a recipient's phone is switched off or out of network coverage, the mobile network operator will hold the SMS in queue and attempt delivery for up to 24-48 hours once the phone powers back on.\n\nIf the phone remains unreachable or the number is invalid, the delivery report in your account will update to reflect a Failed status.`;
  } else if (lower.includes('send') || lower.includes('sms') || lower.includes('bulk')) {
    responseText = `To send a message, head over to the Send SMS page.\n\nYou can choose between Single Recipient mode or Bulk Broadcast. For bulk dispatches, you can paste a list of numbers, select a saved Contact Group, or upload an Excel file directly.\n\nEvery 155 characters counts as 1 SMS unit at 0.04 GHS per unit.`;
    actionButtons.push({ label: 'Go to Send SMS', route: '/send-sms', actionType: 'navigate' });
  } else if (lower.includes('excel') || lower.includes('csv') || lower.includes('import') || lower.includes('contact')) {
    responseText = `Uploading contacts is done on the Contacts page.\n\nClick "Import Excel/CSV File" and select your spreadsheet (.xlsx or .csv). Ensure your file has column headers for phone, name, and groupName. You can also organize contacts into custom groups to send to entire lists at once.`;
    actionButtons.push({ label: 'Contacts Directory', route: '/contacts', actionType: 'navigate' });
  } else if (lower.includes('sender id') || lower.includes('header') || lower.includes('brand')) {
    responseText = `A custom Sender ID lets your business name show up as the sender header on your recipients' phones.\n\nTo register one, go to Custom Sender IDs, click "Register New Sender ID", type your 1 to 11 character header (like MYBRAND), and submit. Newly created headers enter Pending Approval status and are reviewed promptly.`;
    actionButtons.push({ label: 'Custom Sender IDs', route: '/sender-ids', actionType: 'navigate' });
  } else if (lower.includes('top up') || lower.includes('wallet') || lower.includes('paystack') || lower.includes('momo') || lower.includes('price')) {
    responseText = `To fund your wallet, go to the Wallet page, enter your deposit amount in GHS (minimum is GHS 1.00), and click "Top Up via Paystack". You can pay using Mobile Money (MTN, Telecel, AirtelTigo) or Visa/Mastercard.\n\nYour rate is 0.04 GHS per 155-character SMS unit, and your funds remain in your cash balance.`;
    actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
  } else if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'good morning' || lower === 'good afternoon' || lower === 'good evening') {
    responseText = `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`;
  } else if (lower.includes('how are u') || lower.includes('how are you')) {
    responseText = `I'm doing well, thank you for asking! How can I help you today?`;
  } else if (lower.includes('thank') || lower.includes('thanks') || lower.includes('great')) {
    responseText = `You're very welcome! Let me know if you need help with anything else.`;
  } else {
    responseText = `I am here to assist you with your FasReach account!\n\nWhether you need help broadcasting single or bulk SMS, uploading Excel contact files, registering custom Sender IDs, or topping up your wallet, let me know what you'd like to do and I'll walk you right through it.`;
    actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
    actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
  }

  return { responseText, actionButtons };
};
