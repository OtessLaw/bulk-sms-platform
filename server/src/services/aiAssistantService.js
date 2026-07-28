const Wallet = require('../models/Wallet');
const SenderId = require('../models/SenderId');

// Human-like Conversational AI Engine for FasReach
exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId }) => {
  const cleanPrompt = (prompt || '').trim().toLowerCase();
  const userName = user?.name ? user.name.split(' ')[0] : 'there';
  let responseText = '';
  let actionButtons = [];
  let tutorialSteps = null;
  let confidenceScore = 0.98;

  // 🛡️ Security Firewall: Block attempts to probe internal code, providers, schemas, or source files
  if (
    cleanPrompt.includes('source code') ||
    cleanPrompt.includes('arkesel') ||
    cleanPrompt.includes('database schema') ||
    cleanPrompt.includes('mongodb') ||
    cleanPrompt.includes('env') ||
    cleanPrompt.includes('secret') ||
    cleanPrompt.includes('backend code')
  ) {
    return {
      responseText: `I am your dedicated FasReach Customer Support Assistant. I am here to help you send SMS, manage your Sender IDs, top up your wallet, and grow your business! How can I assist you today, ${userName}?`,
      actionButtons: [{ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' }],
      confidenceScore: 1.0,
    };
  }

  // 1. Casual Greetings & Conversational Chit-Chat
  if (cleanPrompt === 'hi' || cleanPrompt === 'hello' || cleanPrompt === 'hey' || cleanPrompt === 'good morning' || cleanPrompt === 'good afternoon' || cleanPrompt === 'good evening') {
    responseText = `Hello ${userName}! 👋 How are you doing today? How can I help you with your SMS dispatches or account?`;
    return { responseText, actionButtons: [{ label: 'Send SMS', route: '/send-sms', actionType: 'navigate' }], confidenceScore: 1.0 };
  }

  if (cleanPrompt.includes('how are you') || cleanPrompt.includes('how u doing') || cleanPrompt.includes('how are u')) {
    responseText = `I'm doing great, ${userName}! Thank you for asking. 😊 Ready to help you reach your customers with fast SMS dispatches. What are you working on today?`;
    return { responseText, actionButtons: [{ label: 'Send Bulk SMS', route: '/send-sms', actionType: 'navigate' }], confidenceScore: 1.0 };
  }

  if (cleanPrompt.includes('who are you') || cleanPrompt.includes('your name') || cleanPrompt.includes('what are you')) {
    responseText = `I am your personal FasReach AI Support Assistant! Think of me as your 24/7 dedicated customer service team member. I can guide you through sending SMS, uploading Excel contact lists, registering brand Sender IDs, or answering any questions you have!`;
    return { responseText, confidenceScore: 1.0 };
  }

  if (cleanPrompt.includes('thank') || cleanPrompt.includes('thanks') || cleanPrompt.includes('cool') || cleanPrompt.includes('great')) {
    responseText = `You're very welcome, ${userName}! Glad I could help. Let me know whenever you need anything else! 👍`;
    return { responseText, confidenceScore: 1.0 };
  }

  // 2. Account Specific Live Diagnostics ("Check my balance", "My status", "Why did my SMS fail")
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

    responseText = `Sure thing, ${userName}! Here is your current wallet balance:\n\n• **Cash Balance**: GHS ${cash}\n• **SMS Credits**: ${credits} Units\n\nYour rate is **0.04 GHS per SMS** (155 characters per unit). Would you like to top up your wallet?`;
    actionButtons = [{ label: 'Top Up Wallet', route: '/wallet', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore: 1.0 };
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

    responseText = `I can help you check why your message didn't go through! Here are the 3 quick things to check:\n\n1. **Wallet Balance**: Your balance is currently GHS ${cash}. If it's below GHS 0.04, simply top up GHS 1.00 or more in your Wallet.\n2. **Sender ID Status**: ${pendingCount > 0 ? `You have ${pendingCount} Sender ID(s) currently Pending Approval.` : 'Make sure your selected Sender ID header is approved.'}\n3. **Phone Number**: Double check that the recipient number is a valid 10-digit Ghanaian mobile number (e.g., 0241112233).`;
    actionButtons = [
      { label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' },
      { label: 'Check Sender IDs', route: '/sender-ids', actionType: 'navigate' },
    ];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 3. Sender ID Header Questions
  if (cleanPrompt.includes('sender id') || cleanPrompt.includes('header') || cleanPrompt.includes('brand name')) {
    responseText = `Registering a Custom Sender ID lets your business name show up as the header when recipients get your SMS!\n\n**Quick Steps**:\n1. Click **Custom Sender IDs** on the sidebar.\n2. Click **Register New Sender ID**.\n3. Enter your 1-11 character header (e.g. \`MYBRAND\`).\n4. Click Submit!\n\nYour header will immediately enter Pending Approval status and process smoothly!`;
    actionButtons = [{ label: 'Register Sender ID', route: '/sender-ids', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 4. Sending Bulk SMS & Excel Upload Questions
  if (cleanPrompt.includes('excel') || cleanPrompt.includes('csv') || cleanPrompt.includes('import') || cleanPrompt.includes('send') || cleanPrompt.includes('bulk')) {
    responseText = `You can easily send bulk SMS or import contacts from Excel/CSV files!\n\n**Here is how to do it**:\n1. Go to **Send SMS** in the menu.\n2. Under **Bulk Broadcast**, you can paste your phone numbers, pick a saved Contact Group, OR upload an Excel/CSV file directly.\n3. Type your message (every 155 characters = 1 SMS unit at 0.04 GHS).\n4. Click **Dispatch SMS** or schedule it for later!`;
    actionButtons = [{ label: 'Go to Send SMS', route: '/send-sms', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 5. Paystack Top-Up & Pricing Questions
  if (cleanPrompt.includes('paystack') || cleanPrompt.includes('top up') || cleanPrompt.includes('topup') || cleanPrompt.includes('momo') || cleanPrompt.includes('mobile money') || cleanPrompt.includes('price')) {
    responseText = `To top up your wallet:\n\n1. Go to **Wallet** in the menu.\n2. Type your amount in GHS (minimum deposit is GHS 1.00).\n3. Click **Top Up via Paystack**.\n4. You can pay using **MTN Mobile Money, Telecel Cash, AirtelTigo Money**, or **Visa/Mastercard**.\n\nYour rate is **0.04 GHS per SMS** (155 characters per unit). All funds stay in your Cash Balance for Pay-As-You-Go dispatches!`;
    actionButtons = [{ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 6. Intelligent Conversational Human Fallback for ANY Random Question
  responseText = `That's a great question, ${userName}! 😊\n\nTo give you the best guidance: if you're looking to send SMS dispatches, set up custom Sender ID brand headers, import Excel lists, or manage your wallet balance, I am here to walk you through it step-by-step.\n\nWould you like me to open the Send SMS page or help you with your wallet?`;
  actionButtons = [
    { label: 'Send SMS', route: '/send-sms', actionType: 'navigate' },
    { label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' },
  ];

  return { responseText, actionButtons, confidenceScore: 0.95 };
};
