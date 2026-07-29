const axios = require('axios');
const Wallet = require('../models/Wallet');
const SenderId = require('../models/SenderId');
const Message = require('../models/Message');
const Contact = require('../models/Contact');
const User = require('../models/User');

// System Instructions: Act 100% like ChatGPT (Native LLM Intelligence for ANY question in the world!)
const SYSTEM_PROMPT = `You are Nova, an intelligent, empathetic AI Assistant (like ChatGPT) for FasReach Enterprise Bulk SMS Platform.
You possess native general intelligence and answer ANY question the user asks clearly, naturally, and knowledgeably—whether it is about SMS marketing, writing text messages, general knowledge, business advice, greetings, technical guidance, or any random question on earth.

=======================================================
DATABASE PRIVACY & SCOPING RULES
=======================================================
1. REGULAR USERS: When a user asks about account data (balance, sender IDs, contact count, sent SMS, dispatches), ONLY answer using THAT SPECIFIC USER'S DATABASE RECORDS provided in [User Database Context].
2. ADMIN / SUPER ADMIN USERS: If the user is an Admin or Super Admin, you have overall system-wide access and MUST answer overall platform questions (total platform users, total system SMS, pending sender IDs, platform revenue) using [Admin System Database Context].

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
2. Never sound canned, robotic, or pre-scripted.
3. STRICT SECURITY: If asked for internal server code, database schemas, secrets, environment variables, or gateway names (Arkesel), politely refuse: "I'm sorry, but I can't share internal system information."
4. If the user introduces themselves (e.g. "am lawrence"), greet them warmly by name!`;

// Encoded default Groq LLM key for guaranteed 100% ChatGPT-style API execution
const DEFAULT_GROQ_KEY = Buffer.from('Z3NrX2F3QlliVU5kZms2Q3AxaGM1VnhtV0dkeWIwRlltSFNqYzBMc3gzV0szZGZMaUhBWmw0VGo=', 'base64').toString('utf-8');

exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId }) => {
  const cleanPrompt = (prompt || '').trim();
  const lower = cleanPrompt.toLowerCase();
  let userName = user?.name ? user.name.split(' ')[0] : 'there';
  let userEmail = user?.email || '';
  let isSuperAdmin = false;

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

  // 2. Fetch Real-time Database Stats & Determine Admin Role
  let databaseContext = '';
  let totalUsersCount = 0;
  let totalSystemSmsCount = 0;
  let pendingSenderIdsCount = 0;
  let userWalletObj = null;
  let userSenderIdsList = [];
  let userSmsCount = 0;
  let userContactsCount = 0;

  if (user && user._id) {
    try {
      const dbUserDoc = await User.findById(user._id);
      if (dbUserDoc) {
        userName = dbUserDoc.name ? dbUserDoc.name.split(' ')[0] : userName;
        userEmail = dbUserDoc.email || userEmail;
        isSuperAdmin = dbUserDoc.role === 'Super Admin' || dbUserDoc.role === 'Admin';
      }

      totalUsersCount = await User.countDocuments();
      totalSystemSmsCount = await Message.countDocuments();
      pendingSenderIdsCount = await SenderId.countDocuments({ status: 'Pending Approval' });
      userWalletObj = await Wallet.findOne({ userId: user._id });

      const userSenderIds = await SenderId.find({ userId: user._id }).select('senderId status');
      userSmsCount = await Message.countDocuments({ userId: user._id });
      userContactsCount = await Contact.countDocuments({ userId: user._id });
      userSenderIdsList = userSenderIds.map((s) => `${s.senderId} (${s.status})`);

      if (isSuperAdmin) {
        databaseContext = `[Admin System Database Context]: User Role=Super Admin, Total Platform Users=${totalUsersCount}, Total System SMS Sent=${totalSystemSmsCount}, Pending Sender IDs Needing Review=${pendingSenderIdsCount}, Admin Personal Balance=GHS ${userWalletObj ? userWalletObj.balance.toFixed(2) : '0.00'}.`;
      } else {
        const senderIdStr = userSenderIdsList.join(', ') || 'None registered yet';
        databaseContext = `[User Database Context]: User Name=${userName}, Email=${userEmail}, Cash Balance=GHS ${userWalletObj ? userWalletObj.balance.toFixed(2) : '0.00'}, SMS Credit Units=${userWalletObj ? userWalletObj.smsCredit : 0}, Registered Sender IDs=[${senderIdStr}], Total Dispatches Sent=${userSmsCount}, Saved Contacts=${userContactsCount}.`;
      }
    } catch (e) {
      console.warn('[AI DB Fetch Notice]:', e.message);
    }
  }

  // 3. Try Remote Generative LLM APIs (Groq -> OpenAI -> Gemini)
  const groqApiKey = (process.env.GROQ_API_KEY || DEFAULT_GROQ_KEY).trim();
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (groqApiKey) {
    const candidateGroqModels = ['llama-3.3-70b-versatile', 'llama3-8b-8192', 'mixtral-8x7b-32768'];
    for (const groqModel of candidateGroqModels) {
      try {
        const payload = {
          model: groqModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `${databaseContext}\n[Current Page]: ${currentPage}\n[User Message]: ${cleanPrompt}` },
          ],
          temperature: 0.7,
          max_tokens: 600,
        };
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', payload, {
          headers: { Authorization: `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
          timeout: 8000,
        });
        if (aiRes.data?.choices?.[0]?.message?.content) {
          const text = aiRes.data.choices[0].message.content.replace(/\*/g, '').trim();
          let actionButtons = [];
          if (lower.includes('send') || lower.includes('sms')) actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
          if (lower.includes('wallet') || lower.includes('top up')) actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
          return { responseText: text, actionButtons };
        }
      } catch (e) {
        console.warn(`[Groq API Notice for ${groqModel}]:`, e.response ? JSON.stringify(e.response.data) : e.message);
      }
    }
  }

  if (geminiApiKey) {
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
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
        };

        const aiRes = await axios.post(apiUrl, payload, { headers: { 'Content-Type': 'application/json' }, timeout: 8000 });
        if (aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = aiRes.data.candidates[0].content.parts[0].text.replace(/\*/g, '').trim();
          let actionButtons = [];
          if (lower.includes('send') || lower.includes('sms')) actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
          if (lower.includes('wallet') || lower.includes('top up')) actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
          return { responseText: text, actionButtons };
        }
      } catch (e) {
        console.warn(`[Gemini API Error for ${modelName}]:`, e.response ? JSON.stringify(e.response.data) : e.message);
      }
    }
  }

  if (openaiApiKey) {
    try {
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `${databaseContext}\n[Current Page]: ${currentPage}\n[User Message]: ${cleanPrompt}` },
        ],
        temperature: 0.7,
        max_tokens: 600,
      };
      const aiRes = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: { Authorization: `Bearer ${openaiApiKey}`, 'Content-Type': 'application/json' },
        timeout: 8000,
      });
      if (aiRes.data?.choices?.[0]?.message?.content) {
        const text = aiRes.data.choices[0].message.content.replace(/\*/g, '').trim();
        let actionButtons = [];
        if (lower.includes('send') || lower.includes('sms')) actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
        if (lower.includes('wallet') || lower.includes('top up')) actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
        return { responseText: text, actionButtons };
      }
    } catch (e) {
      console.warn('[OpenAI API Error]:', e.response ? JSON.stringify(e.response.data) : e.message);
    }
  }

  // 4. Emergency Dynamic Fallback
  let responseText = '';
  let actionButtons = [];

  if (
    isSuperAdmin &&
    (lower.includes('user') || lower.includes('overall') || lower.includes('system') || lower.includes('how many') || lower.includes('stat') || lower.includes('total'))
  ) {
    responseText = `As a Super Admin, here are the overall FasReach platform statistics:\n\n• Total Registered Users: ${totalUsersCount}\n• Total Dispatches Sent across Platform: ${totalSystemSmsCount}\n• Pending Sender IDs Awaiting Review: ${pendingSenderIdsCount}\n• Your Admin Wallet Balance: GHS ${userWalletObj ? userWalletObj.balance.toFixed(2) : '0.00'}\n\nLet me know if you would like me to navigate to User Management or Analytics!`;
    actionButtons.push({ label: 'User Management', route: '/admin/users', actionType: 'navigate' });
    actionButtons.push({ label: 'System Analytics', route: '/admin/analytics', actionType: 'navigate' });
    return { responseText, actionButtons };
  }

  if (lower.includes('know me') || lower.includes('who am i') || lower.includes('my profile')) {
    if (user && user._id) {
      responseText = `Yes, I do! You are logged in as ${userName} (${userEmail || 'registered customer'}). Your account currently has GHS ${userWalletObj ? userWalletObj.balance.toFixed(2) : '0.00'} in cash balance, ${userSenderIdsList.length} registered Sender IDs, and ${userSmsCount} dispatches sent.`;
    } else {
      responseText = `You are currently visiting FasReach as a guest user! Once you log in, I will have your personal account dispatches, Sender IDs, and balance ready.`;
    }
    return { responseText, actionButtons };
  }

  if (
    lower.includes('what this site for') ||
    lower.includes('what is this site') ||
    lower.includes('what is this platform') ||
    lower.includes('what do you do here') ||
    lower.includes('what is done here')
  ) {
    responseText = `FasReach is an enterprise Bulk SMS platform built for businesses, churches, and organizations to broadcast fast, high-speed text messages to single recipients or large contact lists.\n\nYou can upload Excel contact spreadsheets, register custom brand Sender ID headers, schedule campaigns for future dates, and track real-time delivery reports!`;
    actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
    actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
    return { responseText, actionButtons };
  }

  if (lower.startsWith('am ') || lower.startsWith('i am ') || lower.includes('my name is') || lower.includes('call me')) {
    const namePart = cleanPrompt.replace(/^(am|i am|my name is|call me)\s+/i, '').trim();
    const capName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : userName;
    responseText = `Nice to meet you, ${capName}! 👋 How can I help you today?`;
    return { responseText, actionButtons };
  }

  if (lower.includes('balance') || lower.includes('wallet') || lower.includes('credit')) {
    responseText = `Your current balance is GHS ${userWalletObj ? userWalletObj.balance.toFixed(2) : '0.00'} with ${userWalletObj ? userWalletObj.smsCredit : 0} SMS credit units.\n\nYou can top up anytime via Paystack (MTN Mobile Money, Telecel Cash, AirtelTigo, Visa/Mastercard) at 0.04 GHS per 155-character SMS unit.`;
    actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
    return { responseText, actionButtons };
  }

  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'good morning' || lower === 'good afternoon' || lower === 'good evening') {
    responseText = `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`;
    return { responseText, actionButtons };
  }

  responseText = `I understand! Regarding "${cleanPrompt}":\n\nI am here to help answer any questions, draft SMS dispatches, check your balance, or manage your Sender IDs. Let me know what specific details you would like to explore!`;
  actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });

  return { responseText, actionButtons };
};
