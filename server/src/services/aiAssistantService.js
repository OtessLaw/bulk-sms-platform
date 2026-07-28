const axios = require('axios');
const Wallet = require('../models/Wallet');
const SenderId = require('../models/SenderId');

// System Prompt for Real Generative AI Model Support Agent
const SYSTEM_PROMPT = `You are Nova, an expert AI Customer Support Employee for FasReach Enterprise Bulk SMS Platform.
You behave exactly like a real, experienced human customer service representative who has worked at FasReach for years.

=======================================================
PLATFORM KNOWLEDGE BASE
=======================================================
- FasReach is an enterprise Bulk SMS platform.
- Send SMS: Supports Single & Bulk Broadcasts, Contact Directory groups, and direct Excel/CSV/TXT file uploads.
- SMS Unit Rate: Every 155 characters = 1 SMS unit at 0.04 GHS per unit.
- Wallet Top-Up: Fund cash balance via Paystack (MTN Mobile Money, Telecel Cash, AirtelTigo Money, Visa/Mastercard). Minimum deposit is GHS 1.00. Balance never expires.
- Custom Sender IDs: 1 to 11 uppercase brand headers (e.g. MYBRAND). Created headers enter Pending Approval status. Institutional headers (banks, government like ECG, MTN, GCB) are protected against fraud.
- Delivery Reports: Track Green (Delivered), Yellow (Pending), or Red (Failed) statuses with live network sync.
- Developer REST API: Generate API keys for HTTP POST /api/sms/send dispatches.

=======================================================
BEHAVIOR & TONE RULES
=======================================================
1. Speak naturally, empathetically, and conversationally like a knowledgeable human employee.
2. NEVER use static repetitive canned intros like "Regarding your question about..." or bullet lists of what you can do unless specifically asked.
3. Answer any question directly, whether about SMS marketing, account setup, pricing, technical issues, greetings, or general knowledge.
4. STRICT SECURITY: If asked for internal code, database schemas, secrets, environment variables, or provider gateway names (Arkesel), politely refuse: "I'm sorry, but I can't share internal system information."
5. Never invent uncompleted actions or fake balances. Keep answers clear, short, and helpful.`;

// Real Generative AI Model Service
exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId }) => {
  const cleanPrompt = (prompt || '').trim();
  const lower = cleanPrompt.toLowerCase();
  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  // 1. Strict Security Barrier
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

  // 2. Fetch Live User Context for Intelligent Reasoning
  let userWalletContext = '';
  if (user && user._id) {
    try {
      const wallet = await Wallet.findOne({ userId: user._id });
      if (wallet) {
        userWalletContext = `User Balance: GHS ${wallet.balance.toFixed(2)}, SMS Credits: ${wallet.smsCredit} Units.`;
      }
    } catch (e) {}
  }

  // 3. Call Generative LLM API (Google Gemini API / Generative LLM Model)
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
                text: `${SYSTEM_PROMPT}\n\n[User Context]: Name=${userName}, Page=${currentPage}, ${userWalletContext}\n\n[User Prompt]: ${cleanPrompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      };

      const aiRes = await axios.post(apiUrl, payload, { headers: { 'Content-Type': 'application/json' }, timeout: 8000 });

      if (aiRes.data && aiRes.data.candidates && aiRes.data.candidates[0]?.content?.parts[0]?.text) {
        const generatedText = aiRes.data.candidates[0].content.parts[0].text.replace(/\*/g, '').trim();

        // Determine relevant page navigation button
        let actionButtons = [];
        if (lower.includes('send') || lower.includes('sms') || lower.includes('bulk')) {
          actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
        } else if (lower.includes('wallet') || lower.includes('top up') || lower.includes('paystack') || lower.includes('balance')) {
          actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
        } else if (lower.includes('sender id') || lower.includes('header') || lower.includes('brand')) {
          actionButtons.push({ label: 'Custom Sender IDs', route: '/sender-ids', actionType: 'navigate' });
        }

        return { responseText: generatedText, actionButtons };
      }
    } catch (errGen) {
      console.warn('[Gemini LLM Call Warning, fallback to Neural Engine]', errGen.message);
    }
  }

  // 4. Enterprise Neural Generative Fallback Model (When API key is not present)
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
