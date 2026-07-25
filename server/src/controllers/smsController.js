const Message = require('../models/Message');
const Wallet = require('../models/Wallet');
const { sendMultiSms } = require('../services/multiSmsService');
const { generateTemplates } = require('../services/aiTemplateService');
const { calculateSmsUnits, RATE_PER_UNIT } = require('../utils/costCalculator');

// @desc    Send Single SMS
// @route   POST /api/sms/send
exports.sendSMS = async (req, res, next) => {
  try {
    const { senderId, recipientPhone, content } = req.body;
    const userId = req.user._id;

    if (!recipientPhone || !content) {
      return res.status(400).json({ success: false, message: 'Recipient phone and message content are required' });
    }

    const unitsNeeded = calculateSmsUnits(content);
    const wallet = await Wallet.findOne({ userId });

    if (!wallet || wallet.smsCredit < unitsNeeded) {
      return res.status(400).json({
        success: false,
        message: `Insufficient SMS credits. Required: ${unitsNeeded} units. Available: ${wallet?.smsCredit || 0} units. Please top up your wallet.`,
      });
    }

    // Send SMS via Gateway
    const gatewayRes = await sendMultiSms({ senderId: senderId || 'BULKSMS', recipientPhone, content });

    // Deduct credits
    wallet.smsCredit -= unitsNeeded;
    await wallet.save();

    // Log Message
    const messageDoc = await Message.create({
      userId,
      senderId: senderId || 'BULKSMS',
      recipientPhone,
      content,
      smsUnits: unitsNeeded,
      costGHS: (unitsNeeded * RATE_PER_UNIT).toFixed(2),
      gatewayProvider: gatewayRes.provider,
      gatewayResponseId: gatewayRes.messageId,
      status: gatewayRes.status === 'Delivered' ? 'Delivered' : 'Sent',
    });

    res.status(200).json({
      success: true,
      message: 'SMS dispatched successfully via Gateway',
      data: {
        messageDoc,
        remainingCredits: wallet.smsCredit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Bulk SMS Campaign
// @route   POST /api/sms/bulk
exports.sendBulkSMS = async (req, res, next) => {
  try {
    const { senderId, recipients, content, campaignTitle } = req.body;
    const userId = req.user._id;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide array of recipient phone numbers' });
    }

    const unitsPerMessage = calculateSmsUnits(content);
    const totalRecipients = recipients.length;
    const totalUnitsNeeded = unitsPerMessage * totalRecipients;

    const wallet = await Wallet.findOne({ userId });

    if (!wallet || wallet.smsCredit < totalUnitsNeeded) {
      return res.status(400).json({
        success: false,
        message: `Insufficient credits for bulk broadcast. Required: ${totalUnitsNeeded} units. Available: ${wallet?.smsCredit || 0} units.`,
      });
    }

    // Dispatch messages
    const createdDocs = [];
    for (const phone of recipients) {
      const gatewayRes = await sendMultiSms({ senderId: senderId || 'BULKSMS', recipientPhone: phone, content });
      const doc = await Message.create({
        userId,
        senderId: senderId || 'BULKSMS',
        recipientPhone: phone,
        content,
        smsUnits: unitsPerMessage,
        costGHS: (unitsPerMessage * RATE_PER_UNIT).toFixed(2),
        gatewayProvider: gatewayRes.provider,
        gatewayResponseId: gatewayRes.messageId,
        status: 'Sent',
      });
      createdDocs.push(doc);
    }

    // Deduct total credits
    wallet.smsCredit -= totalUnitsNeeded;
    await wallet.save();

    res.status(200).json({
      success: true,
      message: `Bulk SMS broadcast of ${totalRecipients} messages dispatched!`,
      data: {
        totalDispatched: totalRecipients,
        unitsDeducted: totalUnitsNeeded,
        remainingCredits: wallet.smsCredit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI SMS Templates
// @route   POST /api/sms/ai-templates
exports.getAiTemplates = async (req, res, next) => {
  try {
    const { category, keywords } = req.body;
    const templates = await generateTemplates({ category, keywords });
    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};
