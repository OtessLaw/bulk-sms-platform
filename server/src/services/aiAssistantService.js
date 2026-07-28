const Wallet = require('../models/Wallet');
const SenderId = require('../models/SenderId');

// Clean Human Representative Intelligence Service (No asterisks)
exports.processAiQuery = async ({ user, prompt, currentPage = '/dashboard', conversationId }) => {
  const cleanPrompt = (prompt || '').trim().toLowerCase();
  const userName = user?.name ? user.name.split(' ')[0] : 'there';
  let responseText = '';
  let actionButtons = [];
  let tutorialSteps = null;
  let confidenceScore = 0.98;

  // 1. Security Boundary
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

  // 2. Greetings
  if (cleanPrompt.includes('how are u') || cleanPrompt.includes('how are you') || cleanPrompt.includes('how u doing')) {
    responseText = `I'm doing great, thank you for asking! How can I help you today?`;
    return { responseText, confidenceScore: 1.0 };
  }

  if (cleanPrompt === 'hi' || cleanPrompt === 'hello' || cleanPrompt === 'hey' || cleanPrompt === 'good morning' || cleanPrompt === 'good afternoon' || cleanPrompt === 'good evening') {
    responseText = `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`;
    return { responseText, confidenceScore: 1.0 };
  }

  if (cleanPrompt.includes('thank') || cleanPrompt.includes('thanks') || cleanPrompt.includes('great')) {
    responseText = `You're very welcome! Let me know if you need help with anything else.`;
    return { responseText, confidenceScore: 1.0 };
  }

  // 3. Platform Explanation
  if (
    cleanPrompt.includes('plate') ||
    cleanPrompt.includes('platform') ||
    cleanPrompt.includes('website') ||
    cleanPrompt.includes('site') ||
    cleanPrompt.includes('what is this') ||
    cleanPrompt.includes('what do you do')
  ) {
    responseText = `FasReach is an enterprise Bulk SMS platform.\n\nIt allows businesses, organizations, churches, and individuals to send fast, high-speed SMS messages to single recipients or large bulk contact lists.\n\nYou can upload Excel contact lists, register custom brand Sender ID headers, schedule dispatches for later, and track real-time delivery receipts!`;
    actionButtons = [
      { label: 'Send SMS', route: '/send-sms', actionType: 'navigate' },
      { label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' },
    ];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 4. Live Balance Check
  if (cleanPrompt.includes('balance') || cleanPrompt.includes('wallet') || cleanPrompt.includes('credit')) {
    let cash = '0.00';
    let credits = 0;
    try {
      if (user && user._id) {
        const wallet = await Wallet.findOne({ userId: user._id });
        if (wallet) {
          cash = wallet.balance.toFixed(2);
          credits = wallet.smsCredit;
        }
      }
    } catch (e) {}

    responseText = `Your current balance is GHS ${cash} cash balance and ${credits} SMS credit units.\n\nWould you like me to open the Wallet page so you can top up?`;
    actionButtons = [{ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 5. Troubleshooting Questions
  if (cleanPrompt.includes('failed') || cleanPrompt.includes('why didnt') || cleanPrompt.includes('didnt send') || cleanPrompt.includes('not sending') || cleanPrompt.includes('error')) {
    responseText = `Let's figure that out together.\n\nCould you tell me:\n• Was your wallet funded at the time of dispatch?\n• Was your selected Sender ID approved?\n• Were the recipient phone numbers valid 10-digit numbers?\n\nIf you'd like, I can also check your live wallet balance or Sender ID status right now.`;
    actionButtons = [
      { label: 'Check Wallet', route: '/wallet', actionType: 'navigate' },
      { label: 'Check Sender IDs', route: '/sender-ids', actionType: 'navigate' },
    ];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 6. Excel/CSV & Contacts
  if (cleanPrompt.includes('excel') || cleanPrompt.includes('csv') || cleanPrompt.includes('contacts') || cleanPrompt.includes('import')) {
    responseText = `You can upload contact lists directly from the Contacts page or inside the Send SMS page.\n\nClick Import Excel/CSV File, select your file (.xlsx, .csv, or .xls), and save your contacts.\n\nIf you'd like, I can also explain the correct Excel column format.`;
    actionButtons = [{ label: 'Go to Contacts', route: '/contacts', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 7. Sender IDs
  if (cleanPrompt.includes('sender id') || cleanPrompt.includes('header') || cleanPrompt.includes('brand')) {
    responseText = `You can register custom brand headers from the Custom Sender IDs page.\n\nClick Register New Sender ID, enter your 1-11 character header (e.g. MYBRAND), and submit. Newly submitted Sender IDs enter Pending Approval status and process promptly.`;
    actionButtons = [{ label: 'Custom Sender IDs', route: '/sender-ids', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // 8. Top Up
  if (cleanPrompt.includes('top up') || cleanPrompt.includes('paystack') || cleanPrompt.includes('price') || cleanPrompt.includes('cost') || cleanPrompt.includes('momo')) {
    responseText = `To top up your wallet, go to the Wallet page.\n\nEnter your amount in GHS (minimum deposit is GHS 1.00) and click Top Up via Paystack. You can pay using Mobile Money (MTN, Telecel, AirtelTigo) or Visa/Mastercard.\n\nYour rate is 0.04 GHS per 155-character SMS unit.`;
    actionButtons = [{ label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' }];
    return { responseText, actionButtons, confidenceScore: 1.0 };
  }

  // Final catch-all response (Clean text, no asterisks)
  responseText = `FasReach is an enterprise Bulk SMS platform designed to help you send fast SMS messages to single or bulk recipients, import Excel contact lists, register custom brand Sender IDs, and track delivery reports. How can I help you today?`;
  return {
    responseText: responseText.replace(/\*/g, ''),
    actionButtons: [
      { label: 'Send SMS', route: '/send-sms', actionType: 'navigate' },
      { label: 'Go to Wallet', route: '/wallet', actionType: 'navigate' },
    ],
    confidenceScore: 0.9,
  };
};
