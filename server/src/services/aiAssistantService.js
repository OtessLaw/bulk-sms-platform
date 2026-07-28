const KnowledgeDocument = require('../models/KnowledgeDocument');
const Wallet = require('../models/Wallet');
const SenderId = require('../models/SenderId');
const Message = require('../models/Message');

// Comprehensive Production Knowledge Base RAG Database
const EXPANDED_KNOWLEDGE = [
  {
    title: 'Sending Bulk & Single SMS Messages',
    category: 'Send SMS',
    targetPage: '/send-sms',
    keywords: ['send', 'sms', 'message', 'text', 'bulk', 'single', 'broadcast', 'dispatch', 'schedule', 'units', '155', 'char', 'characters'],
    content: `📱 **How to Send SMS on FasReach**:
1. Click **Send SMS** in the left sidebar menu.
2. Select your Sender ID header (or use default **FASREACH**).
3. Choose your Recipient Mode:
   - **Bulk / Directory Broadcast**: Paste multiple phone numbers, pick a saved Contact Group (e.g. *VIP Clients*), OR upload an Excel/CSV file directly!
   - **Single Recipient**: Type one recipient number (e.g. \`0241112233\`).
4. Type your message body or click **Generate** in the AI Template Generator.
5. **Unit Rate**: Every **155 characters = 1 SMS unit** (0.04 GHS per unit).
6. Click **Dispatch SMS** (or check "Schedule for Later" to pick a future date and time).`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Send SMS', description: 'Click Send SMS on the left navigation menu.' },
      { stepNumber: 2, title: 'Add Recipients', description: 'Paste numbers, select a Contact Group, or upload an Excel file.' },
      { stepNumber: 3, title: 'Dispatch', description: 'Type your message and click Dispatch SMS.' },
    ],
  },
  {
    title: 'Wallet Top-Up & Paystack Payment Options',
    category: 'Wallet & Payments',
    targetPage: '/wallet',
    keywords: ['wallet', 'top up', 'topup', 'deposit', 'paystack', 'momo', 'mobile money', 'mtn', 'telecel', 'airteltigo', 'card', 'payment', 'money', 'balance', 'price', 'cost', 'rate', '0.04'],
    content: `💳 **FasReach Wallet Top-Up & Pricing**:
- **Rate per SMS**: 0.04 GHS per 155-character unit.
- **Minimum Deposit**: GHS 1.00.

**How to Top Up**:
1. Go to **Wallet** in the main menu.
2. Type your top-up amount in GHS (e.g. \`10.00\`).
3. Click **Top Up via Paystack**.
4. Choose **Mobile Money** (MTN Mobile Money, Telecel Cash, AirtelTigo Money) or **Visa/Mastercard**.
5. Approve the payment prompt on your phone.
6. Your wallet updates instantly and funds stay in your Cash Balance for Pay-As-You-Go SMS dispatches!`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Wallet', description: 'Click Wallet & Top Up in the sidebar.' },
      { stepNumber: 2, title: 'Enter GHS Amount', description: 'Type minimum GHS 1.00 or desired top-up amount.' },
      { stepNumber: 3, title: 'Pay via Paystack', description: 'Click Top Up via Paystack and approve Mobile Money prompt.' },
    ],
  },
  {
    title: 'Custom Sender ID Registration & Approvals',
    category: 'Sender ID',
    targetPage: '/sender-ids',
    keywords: ['sender', 'sender id', 'header', 'brand', 'name', 'custom', 'register', 'approve', 'pending', 'active', 'reputable', 'institution'],
    content: `🏷️ **Custom Sender ID Rules & Registration**:
- **Length**: 1 to 11 characters (uppercase, e.g. \`MYBRAND\`).
- **Status**: Newly created Sender IDs immediately enter **Pending Approval** status on your account and gateway.

**How to Register**:
1. Click **Custom Sender IDs** on the sidebar menu.
2. Click **Register New Sender ID**.
3. Type your 11-character brand header and business purpose.
4. Click **Submit for Approval**.
5. Custom business names are approved smoothly! (Note: Protected exact institutional headers like \`ECG\`, \`MTN\`, \`GCB\`, \`GRA\` are reserved to prevent fraud).`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Sender IDs', description: 'Click Custom Sender IDs on the sidebar.' },
      { stepNumber: 2, title: 'Register Header', description: 'Click Register New Sender ID button.' },
      { stepNumber: 3, title: 'Submit', description: 'Type your 11-character header name and click Submit.' },
    ],
  },
  {
    title: 'Excel / CSV Contact Import & Group Management',
    category: 'Contacts & Groups',
    targetPage: '/contacts',
    keywords: ['contact', 'contacts', 'excel', 'csv', 'import', 'group', 'directory', 'upload', 'template', 'list', 'grouping'],
    content: `📁 **Contact Directory & Excel/CSV Importer**:
- **Supported File Formats**: \`.xlsx\`, \`.csv\`, \`.xls\`, \`.txt\`

**How to Import Contacts**:
1. Go to **Contacts Directory** in the sidebar.
2. Download our sample CSV template (\`FasReach_Contacts_Sample.csv\`).
3. Ensure columns include \`phone\`, \`name\`, and \`groupName\`.
4. Click **Import Excel/CSV File** and select your file.
5. Review the import preview table and click **Save Imported Contacts**.
6. You can create custom Contact Groups (e.g. *VIP Clients*, *Church Members*) to broadcast to whole lists at once!`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Contacts', description: 'Go to Contacts Directory on the sidebar.' },
      { stepNumber: 2, title: 'Import File', description: 'Click Import Excel/CSV File and choose your file.' },
      { stepNumber: 3, title: 'Save', description: 'Review preview table and click Save Imported Contacts.' },
    ],
  },
  {
    title: 'Delivery Reports & Live Network Syncing',
    category: 'Reports & Delivery',
    targetPage: '/reports',
    keywords: ['report', 'reports', 'delivery', 'receipt', 'pending', 'submitted', 'delivered', 'failed', 'sync', 'status', 'logs'],
    content: `📊 **Reports & Delivery Status Badges**:
- 🟢 **Delivered**: Successfully received on the recipient's phone.
- 🟡 **Pending / Submitted**: Processing through the mobile network operator.
- 🔴 **Failed**: Number unreachable, invalid phone number, or network rejection.

**Live Sync**:
Click **Sync Live Statuses** on the Reports page anytime to fetch instant telco delivery receipts directly!`,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Reports', description: 'Click Delivery Reports on the sidebar.' },
      { stepNumber: 2, title: 'Sync Statuses', description: 'Click Sync Live Statuses for real-time receipts.' },
    ],
  },
  {
    title: 'Developer REST API Integration',
    category: 'Developer API',
    targetPage: '/developer-api',
    keywords: ['api', 'developer', 'endpoint', 'token', 'key', 'json', 'post', 'curl', 'code', 'rest', 'integration'],
    content: `⚡ **Developer REST API Quick Start**:
- **Base URL**: \`https://bulk-sms-platform.onrender.com/api\`
- **Send SMS Endpoint**: \`POST /api/sms/send\`

**HTTP Request Headers**:
\`Authorization: Bearer YOUR_API_KEY\`
\`Content-Type: application/json\`

**JSON Body Payload**:
\`\`\`json
{
  "senderId": "MYBRAND",
  "recipientPhone": "0241112233",
  "content": "Hello world from FasReach API!"
}
\`\`\``,
    tutorialSteps: [
      { stepNumber: 1, title: 'Open Developer API', description: 'Go to Developer REST API on the menu.' },
      { stepNumber: 2, title: 'Generate Key', description: 'Click Generate New API Key and copy your token.' },
    ],
  },
  {
    title: 'Pricing & SMS Unit Calculation',
    category: 'Pricing',
    targetPage: '/wallet',
    keywords: ['price', 'pricing', 'cost', 'unit', 'units', 'rate', 'charge', 'length', 'char', 'characters', '155'],
    content: `🏷️ **FasReach SMS Pricing**:
- **Rate**: 0.04 GHS per 155-character SMS unit.
- **1 - 155 Chars**: 1 Unit (0.04 GHS)
- **156 - 310 Chars**: 2 Units (0.08 GHS)
- **311 - 465 Chars**: 3 Units (0.12 GHS)
- **No Hidden Subscription Fees**: Money stays in your Cash Balance for Pay-As-You-Go SMS sending!`,
  },
];

// Conversational Natural Language Query Processor
exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId }) => {
  const cleanPrompt = (prompt || '').trim().toLowerCase();
  let responseText = '';
  let actionButtons = [];
  let tutorialSteps = null;
  let confidenceScore = 0.95;

  // Tokenize Prompt Words
  const promptWords = cleanPrompt
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  // 1. Account Specific Live Checks ("Check my balance", "My status", "Why did my SMS fail")
  if (cleanPrompt.includes('balance') || cleanPrompt.includes('credit') || cleanPrompt.includes('wallet') || cleanPrompt.includes('money')) {
    let cash = '0.00';
    let credits = 0;
    try {
      const wallet = await Wallet.findOne({ userId: user._id });
      if (wallet) {
        cash = wallet.balance.toFixed(2);
        credits = wallet.smsCredit;
      }
    } catch (e) {}

    responseText = `💰 **Your Account Balance Details**:\n- **Available Cash Balance**: GHS ${cash}\n- **SMS Credits**: ${credits} Units\n\nYour rate is **0.04 GHS / SMS** (155 characters per unit). Need to top up?`;
    actionButtons = [{ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore };
  }

  if (cleanPrompt.includes('failed') || cleanPrompt.includes('why didnt') || cleanPrompt.includes('didnt send') || cleanPrompt.includes('not sending') || cleanPrompt.includes('problem')) {
    let cash = '0.00';
    let pendingCount = 0;
    try {
      const wallet = await Wallet.findOne({ userId: user._id });
      if (wallet) cash = wallet.balance.toFixed(2);
      const senderIds = await SenderId.find({ userId: user._id });
      pendingCount = senderIds.filter((s) => s.status === 'Pending').length;
    } catch (e) {}

    responseText = `🔍 **Troubleshooting Diagnostics for ${user.name || 'User'}**:\n\n1. **Wallet Balance Check**: Your balance is GHS ${cash}. Ensure you have at least GHS 1.00 or SMS credits.\n2. **Sender ID Status**: ${pendingCount > 0 ? `You have ${pendingCount} Sender ID(s) currently Pending Approval.` : 'Ensure your selected Sender ID header is Active.'}\n3. **Phone Number Format**: Use 10-digit Ghanaian mobile numbers (e.g. \`0241112233\` or \`+233241112233\`).`;
    actionButtons = [
      { label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' },
      { label: 'Check Sender IDs', route: '/sender-ids', actionType: 'navigate' },
    ];
    return { responseText, actionButtons, confidenceScore };
  }

  // 2. Page Awareness ("How do I use this page?", "Explain this page")
  if (cleanPrompt.includes('this page') || cleanPrompt.includes('how to use') || cleanPrompt.includes('explain this')) {
    const matchedDoc = EXPANDED_KNOWLEDGE.find((k) => k.targetPage === currentPage) || EXPANDED_KNOWLEDGE[0];
    responseText = matchedDoc.content;
    tutorialSteps = matchedDoc.tutorialSteps;
    actionButtons = [{ label: `Open ${matchedDoc.category}`, route: matchedDoc.targetPage, actionType: 'navigate' }];
    return { responseText, actionButtons, tutorialSteps, confidenceScore };
  }

  // 3. Search RAG Knowledge Engine with Token & Keyword Scoring
  let dbDocs = [];
  try {
    dbDocs = await KnowledgeDocument.find();
  } catch (e) {}

  const allKnowledge = [
    ...EXPANDED_KNOWLEDGE,
    ...dbDocs.map((d) => ({
      title: d.title,
      category: d.category,
      targetPage: d.targetPage || '/dashboard',
      keywords: d.keywords || [],
      content: d.content,
      tutorialSteps: null,
    })),
  ];

  let bestMatch = null;
  let maxScore = 0;

  for (const doc of allKnowledge) {
    let score = 0;
    const keywords = doc.keywords || [];

    // Word token match
    for (const word of promptWords) {
      if (keywords.some((kw) => kw.toLowerCase().includes(word) || word.includes(kw.toLowerCase()))) {
        score += 3;
      }
      if (doc.title.toLowerCase().includes(word)) score += 4;
      if (doc.category.toLowerCase().includes(word)) score += 2;
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = doc;
    }
  }

  if (bestMatch && maxScore >= 2) {
    responseText = bestMatch.content;
    if (bestMatch.targetPage) {
      actionButtons.push({
        label: `Go to ${bestMatch.category || 'Page'}`,
        route: bestMatch.targetPage,
        actionType: 'navigate',
      });
    }
    tutorialSteps = bestMatch.tutorialSteps || null;
  } else {
    // Direct Conversational Answer for General Questions
    responseText = `💬 **FasReach AI Support Answer**:\n\nTo help you with your question regarding "${prompt.trim()}", here is what you can do:\n\n- **To Send SMS or Excel Broadcasts**: Go to **Send SMS**, paste phone numbers or upload your Excel/CSV file.\n- **To Register a Custom Brand Header**: Go to **Custom Sender IDs** and submit your 11-character header.\n- **To Top Up Your Wallet**: Go to **Wallet** and pay via Paystack (MTN Mobile Money, Telecel Cash, or Visa/Mastercard).\n- **Rate**: 0.04 GHS per 155-character SMS unit.`;
    actionButtons = [
      { label: 'Send SMS', route: '/send-sms', actionType: 'navigate' },
      { label: 'Wallet Top Up', route: '/wallet', actionType: 'navigate' },
      { label: 'Custom Sender IDs', route: '/sender-ids', actionType: 'navigate' },
    ];
  }

  return { responseText, actionButtons, tutorialSteps, confidenceScore };
};
