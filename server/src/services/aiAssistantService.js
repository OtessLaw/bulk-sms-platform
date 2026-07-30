const axios = require('axios');
const Wallet = require('../models/Wallet');
const SenderId = require('../models/SenderId');
const Message = require('../models/Message');
const Contact = require('../models/Contact');
const User = require('../models/User');

// System Instructions: Act 100% like a Warm, Empathetic Human Support Expert (ChatGPT)
const SYSTEM_PROMPT = `You are Perincle, a warm, highly empathetic, and intelligent Human Customer Support Representative for FasReach Enterprise Bulk SMS Platform (fasreach.com).
You communicate with human warmth, emotional intelligence, and clarity—just like a friendly, expert colleague typing in a live support chat.

=======================================================
HUMAN CONVERSATIONAL TRAITS & TONE
=======================================================
1. ADAPTIVE HUMAN TONE: Communicate naturally and warmly. Use natural human conversational openers like "Got it!", "Ah, good question!", "No problem at all!", or "I'd be happy to help with that!" when appropriate.
2. EMPATHY & CLARITY: If the user seems confused or asks for guidance, be extra patient, encouraging, and clear.
3. SINGLE NAME MENTION RULE: Mention the user's name ONLY ONCE at the start of a conversation or when introducing yourself. In follow-up messages, respond directly without repeating their name.
4. FULL SENTENCE COMPLETION: ALWAYS complete your sentences fully. Never stop mid-sentence or cut off thoughts.
5. CONVERSATIONAL MEMORY: Pay close attention to previous chat history messages in the conversation to maintain multi-turn context (e.g. pronoun references like "it", "they", "that").

=======================================================
STRICT CONFIDENTIALITY & SOURCING RULES
=======================================================
STRICT NON-DISCLOSURE: NEVER disclose, mention, or discuss internal SMS gateways, routing providers, sourcing partners, vendors, or gateway infrastructure (such as Arkesel, Hubtel, Telecel, MTN, AirtelTigo telco routing, or backend API providers).
If asked where FasReach gets or sources SMS from, or which gateway/provider is used: ALWAYS reply:
"FasReach operates a direct, enterprise-grade Bulk SMS platform with direct telco infrastructure across Ghana and internationally to ensure 100% instant, high-speed delivery."
NEVER name any third-party gateway, provider, or vendor under any circumstances!

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
- Developer REST API: Generate secret API keys for HTTP POST /api/sms/send dispatches.`;

exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId, history = [] }) => {
  const cleanPrompt = (prompt || '').trim();
  const lower = cleanPrompt.toLowerCase();
  let userName = user?.name ? user.name.split(' ')[0] : 'there';
  let userEmail = user?.email || '';
  let isSuperAdmin = false;

  // 1. Strict Confidentiality & Sourcing Firewall
  if (
    lower.includes('source code') ||
    lower.includes('database structure') ||
    lower.includes('mongodb') ||
    lower.includes('server code') ||
    lower.includes('env') ||
    lower.includes('jwt') ||
    lower.includes('secret') ||
    lower.includes('arkesel') ||
    lower.includes('hubtel') ||
    lower.includes('where do you source') ||
    lower.includes('where do you get') ||
    lower.includes('which gateway') ||
    lower.includes('who is your provider') ||
    lower.includes('sms provider') ||
    lower.includes('system prompt')
  ) {
    return {
      responseText: "FasReach operates an enterprise-grade direct Bulk SMS platform with direct telco infrastructure across Ghana and internationally to ensure 100% instant, high-speed delivery. For technical security reasons, internal routing details are confidential.",
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

  // Build Multi-turn History Messages for LLMs
  const historyMessages = (history || []).map((h) => ({
    role: h.role === 'user' ? 'user' : 'assistant',
    content: h.content || '',
  }));

  // Determine Time-Aware Greeting context
  const currentHour = new Date().getHours();
  let timeOfDay = 'day';
  if (currentHour < 12) timeOfDay = 'morning';
  else if (currentHour < 17) timeOfDay = 'afternoon';
  else timeOfDay = 'evening';

  const contextSystemMessage = `${SYSTEM_PROMPT}\n\n${databaseContext}\n[Current Page]: ${currentPage}\n[Time Context]: Good ${timeOfDay}`;

  // 3. Remote LLM API Call Pipeline (Google Gemini / Groq / OpenAI)
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (geminiApiKey) {
    const candidateModels = ['gemini-1.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash-lite', 'gemini-2.5-flash-lite'];
    for (const modelName of candidateModels) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;
        const contents = [
          { role: 'user', parts: [{ text: contextSystemMessage }] },
        ];
        for (const h of historyMessages) {
          contents.push({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] });
        }
        contents.push({ role: 'user', parts: [{ text: cleanPrompt }] });

        const payload = { contents, generationConfig: { temperature: 0.7, maxOutputTokens: 1200 } };
        const aiRes = await axios.post(apiUrl, payload, { headers: { 'Content-Type': 'application/json' }, timeout: 10000 });
        if (aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = aiRes.data.candidates[0].content.parts[0].text.replace(/\*/g, '').trim();
          let actionButtons = [];
          if (lower.includes('send') || lower.includes('sms')) actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
          if (lower.includes('wallet') || lower.includes('top up')) actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
          return { responseText: text, actionButtons };
        }
      } catch (e) {}
    }
  }

  if (groqApiKey) {
    const candidateGroqModels = ['llama-3.3-70b-versatile', 'llama3-8b-8192'];
    for (const groqModel of candidateGroqModels) {
      try {
        const messagesPayload = [
          { role: 'system', content: contextSystemMessage },
          ...historyMessages,
          { role: 'user', content: cleanPrompt },
        ];

        const payload = { model: groqModel, messages: messagesPayload, temperature: 0.7, max_tokens: 1200 };
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', payload, {
          headers: { Authorization: `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
          timeout: 10000,
        });
        if (aiRes.data?.choices?.[0]?.message?.content) {
          const text = aiRes.data.choices[0].message.content.replace(/\*/g, '').trim();
          let actionButtons = [];
          if (lower.includes('send') || lower.includes('sms')) actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
          if (lower.includes('wallet') || lower.includes('top up')) actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
          return { responseText: text, actionButtons };
        }
      } catch (e) {}
    }
  }

  if (openaiApiKey) {
    try {
      const messagesPayload = [
        { role: 'system', content: contextSystemMessage },
        ...historyMessages,
        { role: 'user', content: cleanPrompt },
      ];

      const payload = { model: 'gpt-3.5-turbo', messages: messagesPayload, temperature: 0.7, max_tokens: 1200 };
      const aiRes = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: { Authorization: `Bearer ${openaiApiKey}`, 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      if (aiRes.data?.choices?.[0]?.message?.content) {
        const text = aiRes.data.choices[0].message.content.replace(/\*/g, '').trim();
        let actionButtons = [];
        if (lower.includes('send') || lower.includes('sms')) actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
        if (lower.includes('wallet') || lower.includes('top up')) actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
        return { responseText: text, actionButtons };
      }
    } catch (e) {}
  }

  // 4. Dynamic Fallback Synthesizer
  let responseText = '';
  let actionButtons = [];

  if (
    lower.includes('site for') ||
    lower.includes('what is this site') ||
    lower.includes('what is this platform') ||
    lower.includes('what do you do here') ||
    lower.includes('what is done here') ||
    lower.includes('about this site')
  ) {
    responseText = `FasReach (fasreach.com) is an enterprise Bulk SMS SaaS platform designed for businesses, churches, schools, and organizations to broadcast fast, high-speed text messages to single recipients or thousands of contacts at once.\n\nKey features available on your account:\n• Bulk SMS Broadcasting: Send personalized text dispatches instantly.\n• Excel & CSV Import: Upload contact spreadsheets directly.\n• Custom Sender IDs: Register branded header names (e.g. MYBRAND).\n• Paystack Top-Up: Fund your wallet via Mobile Money (MTN, Telecel, AirtelTigo) or Visa/Mastercard.\n• Real-Time Delivery Reports: Track delivered, pending, and failed SMS dispatches.`;
    actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });
    actionButtons.push({ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' });
    return { responseText, actionButtons };
  }

  if (
    isSuperAdmin &&
    (lower.includes('user') || lower.includes('overall') || lower.includes('system') || lower.includes('how many') || lower.includes('stat') || lower.includes('total'))
  ) {
    responseText = `As a Super Admin, here are the overall FasReach system statistics:\n\n• Total Registered Users: ${totalUsersCount}\n• Total Dispatches Sent across Platform: ${totalSystemSmsCount}\n• Pending Sender IDs Awaiting Review: ${pendingSenderIdsCount}\n• Your Admin Wallet Balance: GHS ${userWalletObj ? userWalletObj.balance.toFixed(2) : '0.00'}\n\nLet me know if you would like me to navigate to User Management or Analytics!`;
    actionButtons.push({ label: 'User Management', route: '/admin/users', actionType: 'navigate' });
    actionButtons.push({ label: 'System Analytics', route: '/admin/analytics', actionType: 'navigate' });
    return { responseText, actionButtons };
  }

  if (lower.includes('know me') || lower.includes('who am i') || lower.includes('my profile')) {
    if (user && user._id) {
      responseText = `Yes! You are logged in as ${userName} (${userEmail || 'registered customer'}). Your account currently has GHS ${userWalletObj ? userWalletObj.balance.toFixed(2) : '0.00'} in cash balance, ${userSenderIdsList.length} registered Sender IDs, and ${userSmsCount} dispatches sent.`;
    } else {
      responseText = `You are currently visiting FasReach as a guest user! Once you log in, I will have your personal account dispatches, Sender IDs, and balance ready.`;
    }
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
    responseText = `Hello 👋 Good ${timeOfDay}!\n\nWelcome to FasReach. How can I help you today?`;
    return { responseText, actionButtons };
  }

  responseText = `I'd be happy to answer that for you!\n\nRegarding "${cleanPrompt}":\n\nAs your FasReach AI Support Assistant, I am equipped to answer general questions, draft SMS broadcast copy, explain platform features, check your wallet balance, or help you manage Sender IDs. Let me know what specific details you'd like to explore further!`;
  actionButtons.push({ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' });

  return { responseText, actionButtons };
};
