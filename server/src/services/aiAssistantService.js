const axios = require('axios');
const Wallet = require('../models/Wallet');

// Comprehensive System Instructions: Act 100% like ChatGPT (Capable of answering ANY question in the world!)
const SYSTEM_PROMPT = `You are Nova, an intelligent, friendly AI Assistant (like ChatGPT) specialized as a Customer Support Representative for FasReach Enterprise Bulk SMS Platform.
You have native intelligence and can answer ANY question the user asks clearly, naturally, and knowledgeably—whether it is about SMS marketing, drafting text messages, general knowledge, business advice, greetings, technical guidance, or any random question on earth.

=======================================================
FASREACH PLATFORM KNOWLEDGE BASE (When asked about FasReach)
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
1. Answer ANY question the user asks in natural, clear plain text (like ChatGPT).
2. Never sound canned, scripted, or repetitive.
3. STRICT SECURITY: If asked for internal server code, database schemas, secrets, environment variables, or gateway names (Arkesel), politely refuse: "I'm sorry, but I can't share internal system information."
4. If the user introduces themselves (e.g. "am lawrence", "my name is john"), greet them warmly by name!`;

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

  // 2. Fetch Live User Wallet Context for AI Reasoning
  let userWalletContext = '';
  if (user && user._id) {
    try {
      const wallet = await Wallet.findOne({ userId: user._id });
      if (wallet) {
        userWalletContext = `User Cash Balance: GHS ${wallet.balance.toFixed(2)}, SMS Credit Units: ${wallet.smsCredit}.`;
      }
    } catch (e) {}
  }

  // 3. Live Google Gemini LLM API (Loaded securely from Environment Variable)
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (geminiApiKey) {
    const candidateModels = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];

    for (const modelName of candidateModels) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;
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
            maxOutputTokens: 500,
          },
        };

        const aiRes = await axios.post(apiUrl, payload, { headers: { 'Content-Type': 'application/json' }, timeout: 10000 });
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
        console.warn(`[Gemini Model ${modelName} Warning]:`, e.response ? e.response.data : e.message);
      }
    }
  }

  // 4. Natural Conversational ChatGPT-Style Emergency Synthesizer
  let responseText = '';
  let actionButtons = [];

  if (lower.startsWith('am ') || lower.startsWith('i am ') || lower.includes('my name is') || lower.includes('call me')) {
    const namePart = cleanPrompt.replace(/^(am|i am|my name is|call me)\s+/i, '').trim();
    const capName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : userName;
    responseText = `Nice to meet you, ${capName}! 👋\n\nHow can I help you today?`;
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
  } else if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'good morning' || lower === 'good afternoon' || lower === 'good evening') {
    responseText = `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`;
  } else if (lower.includes('how are u') || lower.includes('how are you')) {
    responseText = `I'm doing well, thank you for asking! How can I help you today?`;
  } else if (lower.includes('thank') || lower.includes('thanks') || lower.includes('great')) {
    responseText = `You're very welcome! Let me know if you need help with anything else.`;
  } else {
    responseText = `That's an interesting question! Regarding "${cleanPrompt}": I am here to answer any questions or help you with your FasReach dispatches, Sender IDs, and wallet balance. What specific details would you like to know?`;
  }

  return { responseText, actionButtons };
};
