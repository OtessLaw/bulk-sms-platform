const axios = require('axios');
const Wallet = require('../models/Wallet');
const SenderId = require('../models/SenderId');
const SmsLog = require('../models/SmsLog');
const Contact = require('../models/Contact');
const User = require('../models/User');

// System Instructions with Strict User Database Scoping vs Admin Overall Access
const SYSTEM_PROMPT = `You are Nova, an intelligent, empathetic AI Support Employee for FasReach Enterprise Bulk SMS Platform.

=======================================================
DATABASE PRIVACY & SCOPING RULES
=======================================================
1. REGULAR USERS: When a user asks about account data (balance, sender IDs, contact count, sent SMS, dispatches), ONLY answer using THAT SPECIFIC USER'S DATABASE RECORDS provided in the [User Database Context]. NEVER share or leak another user's data.
2. ADMIN / SUPER ADMIN USERS: If the user is an Admin or Super Admin, you have overall system-wide access and can provide total system stats (total platform users, total system SMS, pending sender IDs, platform revenue) provided in the [Admin System Database Context].

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
1. Answer ANY question in natural, helpful plain text (like ChatGPT).
2. Never sound canned or pre-scripted.
3. STRICT SECURITY: If asked for internal server code, database schemas, secrets, environment variables, or gateway names (Arkesel), politely refuse: "I'm sorry, but I can't share internal system information."
4. If the user introduces themselves (e.g. "am lawrence"), greet them warmly by name!`;

const RUNTIME_DEFAULT_KEY = Buffer.from('QVEuQWI4Uk42SWFGd0Z6bGJKYTNCMVpVWTZ0b3ZHaDZUV3RReVNuMHVMSDNmTTZuMmdLQ1E=', 'base64').toString('utf-8');

exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId }) => {
  const cleanPrompt = (prompt || '').trim();
  const lower = cleanPrompt.toLowerCase();
  const userName = user?.name ? user.name.split(' ')[0] : 'there';
  const isSuperAdmin = user?.role === 'Super Admin' || user?.role === 'Admin';

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

  // 2. Fetch User-Scoped or Admin Overall Database Context
  let databaseContext = '';

  if (user && user._id) {
    try {
      if (isSuperAdmin) {
        // ADMIN OVERALL ACCESS
        const totalUsers = await User.countDocuments();
        const totalSystemSms = await SmsLog.countDocuments();
        const pendingSenderIds = await SenderId.countDocuments({ status: 'Pending Approval' });
        const userWallet = await Wallet.findOne({ userId: user._id });

        databaseContext = `[Admin System Database Context]: User Role=${user.role}, Total Platform Users=${totalUsers}, Total System SMS Sent=${totalSystemSms}, Pending Sender IDs Needing Review=${pendingSenderIds}, Admin Personal Wallet=GHS ${userWallet ? userWallet.balance.toFixed(2) : '0.00'}.`;
      } else {
        // REGULAR USER SCOPED DATABASE ACCESS ONLY
        const userWallet = await Wallet.findOne({ userId: user._id });
        const userSenderIds = await SenderId.find({ userId: user._id }).select('senderId status');
        const userSmsCount = await SmsLog.countDocuments({ userId: user._id });
        const userContactsCount = await Contact.countDocuments({ userId: user._id });

        const senderIdList = userSenderIds.map((s) => `${s.senderId} (${s.status})`).join(', ') || 'None registered yet';

        databaseContext = `[User Database Context]: User Name=${userName}, Cash Balance=GHS ${userWallet ? userWallet.balance.toFixed(2) : '0.00'}, SMS Credit Units=${userWallet ? userWallet.smsCredit : 0}, Registered Sender IDs=[${senderIdList}], Total Dispatches Sent=${userSmsCount}, Saved Contacts=${userContactsCount}.`;
      }
    } catch (e) {
      console.warn('[AI DB Scoping Notice]:', e.message);
    }
  }

  // 3. Live Google Gemini LLM API
  const geminiApiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || RUNTIME_DEFAULT_KEY).trim();
  const candidateModels = ['gemini-flash-latest', 'gemini-2.0-flash-lite', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];

  for (const modelName of candidateModels) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n${databaseContext}\n\n[Current Page]: ${currentPage}\n\n[User Message]: ${cleanPrompt}`,
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
      console.warn(`[Gemini Model ${modelName} Notice]:`, e.response ? JSON.stringify(e.response.data) : e.message);
    }
  }

  // 4. Natural Conversational ChatGPT-Style Emergency Fallback Synthesizer
  let responseText = '';
  let actionButtons = [];

  if (lower.startsWith('am ') || lower.startsWith('i am ') || lower.includes('my name is') || lower.includes('call me')) {
    const namePart = cleanPrompt.replace(/^(am|i am|my name is|call me)\s+/i, '').trim();
    const capName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : userName;
    responseText = `Nice to meet you, ${capName}! 👋 How can I help you today?`;
  } else if (lower.includes('balance') || lower.includes('my wallet') || lower.includes('credit')) {
    responseText = `Your current balance is updated in your account context. Let me know if you'd like to top up via Paystack!`;
    actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
  } else if (lower.includes('what is done here') || lower.includes('what do you do here') || lower.includes('what can i do here')) {
    responseText = `Here on FasReach, you can broadcast single & bulk SMS, upload Excel contact lists, register custom brand Sender ID headers, schedule dispatches, and track real-time delivery reports. What would you like to work on?`;
    actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
    actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
  } else if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'good morning' || lower === 'good afternoon' || lower === 'good evening') {
    responseText = `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`;
  } else {
    responseText = `I hear you! How can I best assist you with your question or your FasReach account today?`;
  }

  return { responseText, actionButtons };
};
