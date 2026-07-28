const KnowledgeDocument = require('../models/KnowledgeDocument');
const Wallet = require('../models/Wallet');
const SenderId = require('../models/SenderId');
const Message = require('../models/Message');

// Core Platform Knowledge Base Seed (Built-in Knowledge RAG Database)
const PLATFORM_KNOWLEDGE = [
  {
    title: 'How to Send Single & Bulk SMS',
    category: 'Send SMS',
    targetPage: '/send-sms',
    keywords: ['send', 'sms', 'bulk', 'single', 'broadcast', 'excel', 'csv', 'group', 'units', 'schedule'],
    content: `To send SMS on FasReach:
1. Navigate to the "Send SMS" page.
2. Select your preferred Sender ID header (or use default FASREACH).
3. Choose your recipient mode:
   - Bulk / Directory Broadcast: Paste phone numbers, select a saved Contact Group, OR upload an Excel/CSV file directly!
   - Single Recipient: Enter a single phone number.
4. Compose your message or use the AI Template Generator.
5. Unit Rule: Every 155 characters equals 1 SMS unit (0.04 GHS / SMS).
6. Click "Dispatch SMS" or enable "Schedule for Later" to select a future date and time.`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Go to Send SMS', description: 'Click Send SMS on the left sidebar navigation menu.' },
      { stepNumber: 2, title: 'Choose Recipients', description: 'Select a Contact Group, upload an Excel file, or paste phone numbers.' },
      { stepNumber: 3, title: 'Compose & Dispatch', description: 'Type your message and click Dispatch SMS.' },
    ],
  },
  {
    title: 'Wallet Top-Up & Paystack Payment Guide',
    category: 'Wallet & Payments',
    targetPage: '/wallet',
    keywords: ['wallet', 'top up', 'topup', 'deposit', 'paystack', 'momo', 'mobile money', 'card', 'balance', 'credit'],
    content: `To top up your FasReach Wallet:
1. Click "Wallet" on the main sidebar menu.
2. Enter your desired deposit amount in GHS (Minimum deposit is GHS 1.00).
3. Click "Top Up via Paystack".
4. Select Mobile Money (MTN, Telecel, AirtelTigo) or Visa/Mastercard.
5. Complete payment prompt on your phone or card.
6. Your wallet balance updates instantly! Money remains 100% in your Cash Balance for Pay-As-You-Go dispatches at 0.04 GHS / SMS.`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Wallet Page', description: 'Click Wallet on the left navigation sidebar.' },
      { stepNumber: 2, title: 'Enter Amount', description: 'Type your deposit amount (GHS 1.00 minimum).' },
      { stepNumber: 3, title: 'Pay via Paystack', description: 'Click Top Up via Paystack and approve Mobile Money prompt.' },
    ],
  },
  {
    title: 'Custom Sender IDs Registration & Anti-Fraud Rules',
    category: 'Sender ID',
    targetPage: '/sender-ids',
    keywords: ['sender id', 'header', 'brand', 'name', 'register', 'approve', 'pending', 'rules', 'institution'],
    content: `To register a Custom Sender ID header on FasReach:
1. Go to "Custom Sender IDs" in the sidebar menu.
2. Click "Register New Sender ID".
3. Enter a 1 to 11 character uppercase header (e.g., MYBRAND).
4. Provide a brief business purpose.
5. Click "Submit for Approval".
6. Your Sender ID submits immediately to the primary gateway in "Pending Approval" status.
7. Note: Institutional headers (banks, telecoms, government agencies like ECG, MTN, GCB) are protected against impersonation to prevent fraud. Custom business names are approved smoothly!`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Sender IDs Page', description: 'Click Custom Sender IDs on the sidebar.' },
      { stepNumber: 2, title: 'Click Register New Sender ID', description: 'Open the registration popup form.' },
      { stepNumber: 3, title: 'Submit Header', description: 'Type your 11-character brand header and click Submit.' },
    ],
  },
  {
    title: 'Contact Directory & Excel/CSV Bulk Upload',
    category: 'Contacts & Groups',
    targetPage: '/contacts',
    keywords: ['contacts', 'excel', 'csv', 'import', 'group', 'directory', 'upload', 'template'],
    content: `To manage contacts and upload Excel/CSV files:
1. Click "Contacts" on the sidebar.
2. Download our sample CSV template ("FasReach_Contacts_Sample.csv").
3. Ensure your file contains headers: phone, name, groupName.
4. Click "Import Excel/CSV File" and select your file (.xlsx, .csv, .xls).
5. Preview contacts and click "Save Imported Contacts".
6. You can also create custom Contact Groups (e.g. VIP Clients, Staff, Church Members) to organize your contacts!`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Go to Contacts', description: 'Navigate to the Contacts page from the menu.' },
      { stepNumber: 2, title: 'Click Import File', description: 'Select your Excel or CSV file.' },
      { stepNumber: 3, title: 'Save & Organize', description: 'Confirm preview and organize into groups.' },
    ],
  },
  {
    title: 'Reports & Live Delivery Receipts Syncing',
    category: 'Reports & Delivery',
    targetPage: '/reports',
    keywords: ['report', 'delivery', 'receipt', 'pending', 'submitted', 'delivered', 'failed', 'sync', 'status'],
    content: `To view your SMS Delivery Reports:
1. Go to "Reports" in the sidebar menu.
2. View total sent, delivered, pending, and failed message counts.
3. Message statuses update automatically in real-time.
4. Click "Sync Live Statuses" anytime to fetch live delivery receipts directly from telco networks!`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Reports', description: 'Click Reports & Live Delivery Logs on the sidebar.' },
      { stepNumber: 2, title: 'Check Status Badges', description: 'View Green (Delivered), Yellow (Pending), or Red (Failed) badges.' },
    ],
  },
  {
    title: 'Developer API Integration',
    category: 'Developer API',
    targetPage: '/developer-api',
    keywords: ['api', 'developer', 'endpoint', 'token', 'key', 'json', 'post', 'curl', 'documentation'],
    content: `To integrate FasReach API into your application:
1. Go to "Developer API" in the sidebar.
2. Click "Generate New API Key".
3. Use endpoint: POST https://bulk-sms-platform.onrender.com/api/sms/send
4. Headers: Authorization: Bearer YOUR_API_KEY, Content-Type: application/json
5. Body: { "senderId": "MYBRAND", "recipientPhone": "0241112233", "content": "Hello World" }`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Developer API', description: 'Click Developer API on the left menu.' },
      { stepNumber: 2, title: 'Generate API Key', description: 'Copy your live secret API token.' },
    ],
  },
];

// Contextual RAG Search Engine
exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId }) => {
  const cleanPrompt = (prompt || '').trim().toLowerCase();
  let responseText = '';
  let actionButtons = [];
  let tutorialSteps = null;
  let confidenceScore = 0.95;

  // 1. Live Account Diagnostics check (e.g. "Why didn't my SMS send?", "Check my balance", "My status")
  if (cleanPrompt.includes('balance') || cleanPrompt.includes('credit') || cleanPrompt.includes('wallet')) {
    const wallet = await Wallet.findOne({ userId: user._id });
    const cash = wallet ? wallet.balance.toFixed(2) : '0.00';
    const credits = wallet ? wallet.smsCredit : 0;

    responseText = `💰 **Your Account Balance Details**:\n- **Available Cash Balance**: GHS ${cash}\n- **SMS Credits**: ${credits} Units\n\nYour rate is **0.04 GHS / SMS** (155 characters per unit). Need to add funds?`;
    actionButtons = [{ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore };
  }

  if (cleanPrompt.includes('failed') || cleanPrompt.includes('why didnt') || cleanPrompt.includes('didnt send') || cleanPrompt.includes('not sending')) {
    const wallet = await Wallet.findOne({ userId: user._id });
    const senderIds = await SenderId.find({ userId: user._id });
    const recentMessages = await Message.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3);

    let diagnosticReasons = [];

    if (!wallet || (wallet.balance < 0.04 && wallet.smsCredit < 1)) {
      diagnosticReasons.push('⚠️ **Insufficient Wallet Balance**: Your cash balance is low (GHS ' + (wallet ? wallet.balance.toFixed(2) : '0.00') + '). Top up GHS 1.00 or more in your Wallet.');
    }

    const pendingHeaders = senderIds.filter((s) => s.status === 'Pending');
    if (pendingHeaders.length > 0) {
      diagnosticReasons.push('⏳ **Pending Sender ID**: Header `' + pendingHeaders[0].senderId + '` is currently Pending Approval.');
    }

    if (recentMessages.some((m) => m.status === 'Failed')) {
      diagnosticReasons.push('🔴 **Telco Network Notice**: Recent message failed. Ensure recipient phone numbers are valid 10-digit Ghanaian mobile numbers (e.g., 0241112233).');
    }

    if (diagnosticReasons.length === 0) {
      responseText = `🔍 **SMS Diagnostics Check**:\nYour account setup looks healthy! Ensure recipient numbers are formatted correctly and your Sender ID status is Active.`;
    } else {
      responseText = `🔍 **Troubleshooting Diagnostics for ${user.name}**:\n\n` + diagnosticReasons.join('\n\n');
    }

    actionButtons = [
      { label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' },
      { label: 'Check Sender IDs', route: '/sender-ids', actionType: 'navigate' },
    ];

    return { responseText, actionButtons, confidenceScore };
  }

  // 2. Page Awareness ("How do I use this page?", "Explain this page")
  if (cleanPrompt.includes('this page') || cleanPrompt.includes('how to use') || cleanPrompt.includes('explain')) {
    const matchedDoc = PLATFORM_KNOWLEDGE.find((k) => k.targetPage === currentPage) || PLATFORM_KNOWLEDGE[0];
    responseText = `📍 **Page Guide for ${currentPage}**:\n\n` + matchedDoc.content;
    tutorialSteps = matchedDoc.tutorialSteps;
    actionButtons = [{ label: `Explore ${matchedDoc.category}`, route: matchedDoc.targetPage, actionType: 'navigate' }];
    return { responseText, actionButtons, tutorialSteps, confidenceScore };
  }

  // 3. RAG Search Engine over Knowledge Base & Custom DB Documents
  const dbDocs = await KnowledgeDocument.find({ isPublished: true });
  const allKnowledge = [
    ...PLATFORM_KNOWLEDGE,
    ...dbDocs.map((d) => ({
      title: d.title,
      category: d.category,
      targetPage: d.targetPage || '/dashboard',
      keywords: d.keywords || [],
      content: d.content,
      tutorialSteps: null,
    })),
  ];

  // Vector / Keyword Similarity Scoring
  let bestMatch = null;
  let maxScore = 0;

  for (const doc of allKnowledge) {
    let score = 0;
    const keywords = doc.keywords || [];
    for (const kw of keywords) {
      if (cleanPrompt.includes(kw)) score += 3;
    }
    if (doc.title.toLowerCase().includes(cleanPrompt)) score += 5;
    if (doc.category.toLowerCase().includes(cleanPrompt)) score += 2;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = doc;
    }
  }

  if (bestMatch && maxScore >= 2) {
    responseText = `💡 **${bestMatch.title}**:\n\n` + bestMatch.content;
    if (bestMatch.targetPage) {
      actionButtons.push({
        label: `Go to ${bestMatch.category || 'Page'}`,
        route: bestMatch.targetPage,
        actionType: 'navigate',
      });
    }
    tutorialSteps = bestMatch.tutorialSteps || null;
  } else {
    // Fail-safe helpful response
    confidenceScore = 0.6;
    responseText = `👋 Hello ${user.name}! I am **FasReach Smart Support AI**.\n\nI can help you with:\n- **Sending Bulk SMS & Excel uploads**\n- **Registering Custom Sender IDs**\n- **Paystack Wallet Top-Ups**\n- **Delivery Reports & API Integration**\n\nWhat would you like assistance with today?`;
    actionButtons = [
      { label: 'Send SMS', route: '/send-sms', actionType: 'navigate' },
      { label: 'Top Up Wallet', route: '/wallet', actionType: 'navigate' },
      { label: 'Talk to Human Support', route: '/help', actionType: 'escalate' },
    ];
  }

  return { responseText, actionButtons, tutorialSteps, confidenceScore };
};
