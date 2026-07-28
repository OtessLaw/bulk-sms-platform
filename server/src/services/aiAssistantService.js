const Wallet = require('../models/Wallet');
const SenderId = require('../models/SenderId');
const KnowledgeDocument = require('../models/KnowledgeDocument');

// Human Support Employee Knowledge Base for FasReach
const KNOWLEDGE_BASE = [
  {
    title: 'Sending SMS & Bulk Dispatches',
    targetPage: '/send-sms',
    keywords: ['send', 'sms', 'bulk', 'single', 'message', 'text', 'broadcast', 'excel', 'csv', 'import', 'contact', 'schedule'],
    content: `You can send SMS messages from the Send SMS page.

For bulk dispatches, select "Bulk Broadcast", where you can paste phone numbers, choose a saved Contact Group, or upload an Excel/CSV file directly.

Every 155 characters counts as 1 SMS unit at 0.04 GHS per unit.

If you'd like, I can also show you how to schedule messages for future dispatch instead of sending them immediately.`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Go to Send SMS', description: 'Click Send SMS on the left menu.' },
      { stepNumber: 2, title: 'Add Recipients', description: 'Paste numbers, select a Contact Group, or upload an Excel file.' },
      { stepNumber: 3, title: 'Dispatch', description: 'Type your message and click Dispatch SMS.' },
    ],
  },
  {
    title: 'Wallet Top-Up & Paystack Payments',
    targetPage: '/wallet',
    keywords: ['wallet', 'top up', 'topup', 'deposit', 'paystack', 'momo', 'mobile money', 'card', 'payment', 'balance', 'price', 'cost', 'rate'],
    content: `To top up your wallet, go to the Wallet page.

Enter your amount in GHS (minimum deposit is GHS 1.00) and click "Top Up via Paystack". You can pay using Mobile Money (MTN, Telecel, AirtelTigo) or Visa/Mastercard.

Your rate is 0.04 GHS per 155-character SMS unit, and your funds remain in your cash balance for Pay-As-You-Go dispatches.`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Wallet', description: 'Click Wallet & Top Up in the sidebar.' },
      { stepNumber: 2, title: 'Enter GHS Amount', description: 'Type your top-up amount (GHS 1.00 minimum).' },
      { stepNumber: 3, title: 'Pay via Paystack', description: 'Click Top Up via Paystack and complete payment.' },
    ],
  },
  {
    title: 'Custom Sender ID Registration',
    targetPage: '/sender-ids',
    keywords: ['sender id', 'header', 'brand', 'name', 'register', 'approve', 'pending', 'rules'],
    content: `You can register custom 1 to 11 character brand headers from the Custom Sender IDs page.

Click "Register New Sender ID", enter your brand header, and submit. Newly submitted Sender IDs enter Pending Approval status and are reviewed promptly.

Note that protected institutional headers (such as bank or government names) are restricted to prevent impersonation.`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Sender IDs', description: 'Click Custom Sender IDs on the sidebar.' },
      { stepNumber: 2, title: 'Register Header', description: 'Click Register New Sender ID button.' },
      { stepNumber: 3, title: 'Submit', description: 'Type your 11-character header name and click Submit.' },
    ],
  },
  {
    title: 'Contact Directory & File Imports',
    targetPage: '/contacts',
    keywords: ['contacts', 'excel', 'csv', 'import', 'group', 'directory', 'upload', 'file'],
    content: `You can manage your contacts and create groups on the Contacts page.

Click "Import Excel/CSV File" to upload your file (.xlsx, .csv, or .xls). Ensure your file contains headers for phone, name, and groupName.

If you'd like, I can also explain the correct Excel column formatting before you upload.`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Contacts', description: 'Go to Contacts Directory on the sidebar.' },
      { stepNumber: 2, title: 'Import File', description: 'Click Import Excel/CSV File and choose your file.' },
      { stepNumber: 3, title: 'Save Contacts', description: 'Review the preview and save.' },
    ],
  },
  {
    title: 'Delivery Reports & Tracking',
    targetPage: '/reports',
    keywords: ['report', 'delivery', 'receipt', 'pending', 'submitted', 'delivered', 'failed', 'status', 'logs'],
    content: `You can view your delivery logs on the Reports page.

Message statuses update automatically to show Delivered, Pending, or Failed dispatches. Click "Sync Live Statuses" anytime to fetch live delivery receipts.`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Reports', description: 'Click Delivery Reports on the sidebar.' },
      { stepNumber: 2, title: 'Sync Receipts', description: 'Click Sync Live Statuses for real-time receipts.' },
    ],
  },
  {
    title: 'Developer REST API',
    targetPage: '/developer-api',
    keywords: ['api', 'developer', 'endpoint', 'token', 'key', 'json', 'post', 'curl'],
    content: `You can generate API keys and view integration documentation on the Developer API page.

Dispatches use POST requests with your Bearer API key in the Authorization header.`,
  },
];

// Production Human Support AI Representative Service
exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId }) => {
  const cleanPrompt = (prompt || '').trim().toLowerCase();
  const userName = user?.name ? user.name.split(' ')[0] : 'there';
  let responseText = '';
  let actionButtons = [];
  let tutorialSteps = null;
  let confidenceScore = 0.98;

  // 1. Strict Confidentiality & Security Boundary
  if (
    cleanPrompt.includes('source code') ||
    cleanPrompt.includes('database structure') ||
    cleanPrompt.includes('mongodb') ||
    cleanPrompt.includes('server code') ||
    cleanPrompt.includes('env') ||
    cleanPrompt.includes('jwt') ||
    cleanPrompt.includes('secret') ||
    cleanPrompt.includes('arkesel') ||
    cleanPrompt.includes('system prompt')
  ) {
    return {
      responseText: "I'm sorry, but I can't share internal system information.",
      confidenceScore: 1.0,
    };
  }

  // 2. Natural Human Greetings & Farewells (Simple, polite, no self-advertising lists!)
  if (cleanPrompt === 'hi' || cleanPrompt === 'hello' || cleanPrompt === 'hey' || cleanPrompt === 'good morning' || cleanPrompt === 'good afternoon' || cleanPrompt === 'good evening') {
    responseText = `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`;
    return { responseText, confidenceScore: 1.0 };
  }

  if (cleanPrompt.includes('how are you') || cleanPrompt.includes('how u doing') || cleanPrompt.includes('how are u')) {
    responseText = `I'm doing well, thank you for asking! How can I help you today?`;
    return { responseText, confidenceScore: 1.0 };
  }

  if (cleanPrompt.includes('thank') || cleanPrompt.includes('thanks') || cleanPrompt.includes('great') || cleanPrompt.includes('cool')) {
    responseText = `You're very welcome! Let me know if you need help with anything else.`;
    return { responseText, confidenceScore: 1.0 };
  }

  // 3. Human Troubleshooting & Diagnostic Dialogues
  if (cleanPrompt.includes('failed') || cleanPrompt.includes('why didnt') || cleanPrompt.includes('didnt send') || cleanPrompt.includes('not sending') || cleanPrompt.includes('error')) {
    responseText = `Let's figure that out together.\n\nCould you tell me:\n• Was your wallet funded at the time of dispatch?\n• Was your selected Sender ID approved?\n• Were the recipient phone numbers valid 10-digit numbers?\n\nIf you'd like, I can also check your live wallet balance or Sender ID status right now.`;
    actionButtons = [
      { label: 'Check Wallet', route: '/wallet', actionType: 'navigate' },
      { label: 'Check Sender IDs', route: '/sender-ids', actionType: 'navigate' },
    ];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 4. Account Specific Queries ("Check my balance", "My wallet")
  if (cleanPrompt.includes('balance') || cleanPrompt.includes('my wallet') || cleanPrompt.includes('my credit')) {
    let cash = '0.00';
    let credits = 0;
    try {
      const wallet = await Wallet.findOne({ userId: user._id });
      if (wallet) {
        cash = wallet.balance.toFixed(2);
        credits = wallet.smsCredit;
      }
    } catch (e) {}

    responseText = `Your current balance is GHS ${cash} cash balance and ${credits} SMS credit units.\n\nWould you like me to open the Wallet page so you can top up?`;
    actionButtons = [{ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 5. Page Awareness ("What does this page do?", "Explain this page")
  if (cleanPrompt.includes('this page') || cleanPrompt.includes('what does this page do') || cleanPrompt.includes('explain this page')) {
    const matchedDoc = KNOWLEDGE_BASE.find((k) => k.targetPage === currentPage) || KNOWLEDGE_BASE[0];
    responseText = matchedDoc.content;
    tutorialSteps = matchedDoc.tutorialSteps || null;
    actionButtons = [{ label: 'Go to Page', route: matchedDoc.targetPage, actionType: 'navigate' }];
    return { responseText, actionButtons, tutorialSteps, confidenceScore: 1.0 };
  }

  // 6. Knowledge Base Match Search
  let dbDocs = [];
  try {
    dbDocs = await KnowledgeDocument.find();
  } catch (e) {}

  const allDocs = [
    ...KNOWLEDGE_BASE,
    ...dbDocs.map((d) => ({
      title: d.title,
      targetPage: d.targetPage || '/dashboard',
      keywords: d.keywords || [],
      content: d.content,
      tutorialSteps: null,
    })),
  ];

  const promptWords = cleanPrompt.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
  let bestMatch = null;
  let maxScore = 0;

  for (const doc of allDocs) {
    let score = 0;
    const keywords = doc.keywords || [];
    for (const word of promptWords) {
      if (keywords.some((kw) => kw.toLowerCase().includes(word) || word.includes(kw.toLowerCase()))) score += 3;
      if (doc.title.toLowerCase().includes(word)) score += 4;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = doc;
    }
  }

  if (bestMatch && maxScore >= 2) {
    responseText = bestMatch.content;
    if (bestMatch.targetPage) {
      actionButtons.push({ label: `Go to ${bestMatch.title}`, route: bestMatch.targetPage, actionType: 'navigate' });
    }
    tutorialSteps = bestMatch.tutorialSteps || null;
  } else {
    // Exact requested rule: If information doesn't exist, say: "I couldn't find that information."
    responseText = "I couldn't find that information. If you'd like, I can help you navigate to the Send SMS, Wallet, or Sender ID pages.";
    actionButtons = [
      { label: 'Send SMS', route: '/send-sms', actionType: 'navigate' },
      { label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' },
    ];
  }

  return { responseText, actionButtons, tutorialSteps, confidenceScore };
};
