const Message = require('../models/Message');
const Wallet = require('../models/Wallet');
const { sendMultiSms } = require('../services/multiSmsService');
const { generateTemplates } = require('../services/aiTemplateService');
const { calculateSmsUnits, RATE_PER_UNIT } = require('../utils/costCalculator');

// @desc    Send Single SMS (Supports SMS Credits OR Direct Cash Balance Deduction)
// @route   POST /api/sms/send
exports.sendSMS = async (req, res, next) => {
  try {
    const { senderId, recipientPhone, content } = req.body;
    const userId = req.user._id;

    if (!recipientPhone || !content) {
      return res.status(400).json({ success: false, message: 'Recipient phone and message content are required' });
    }

    const unitsNeeded = calculateSmsUnits(content);
    const cashCost = Number((unitsNeeded * RATE_PER_UNIT).toFixed(2));
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(400).json({ success: false, message: 'Wallet not found' });
    }

    let paymentType = '';

    // 1. Check if user has active SMS Credits
    if (wallet.smsCredit >= unitsNeeded) {
      wallet.smsCredit -= unitsNeeded;
      paymentType = 'SMS Credits';
    }
    // 2. Else check if user has enough Cash Balance (Pay-As-You-Go)
    else if (wallet.balance >= cashCost) {
      wallet.balance = Number((wallet.balance - cashCost).toFixed(2));
      paymentType = 'Cash Balance';
    } else {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds/credits. Required: ${unitsNeeded} SMS units or GHS ${cashCost.toFixed(2)}. Available: ${wallet.smsCredit} credits & GHS ${wallet.balance.toFixed(2)} cash balance.`,
      });
    }

    // Send SMS via Gateway
    const gatewayRes = await sendMultiSms({ senderId: senderId || 'FASREACH', recipientPhone, content });

    await wallet.save();

    // Log Message
    const messageDoc = await Message.create({
      userId,
      senderId: senderId || 'FASREACH',
      recipientPhone,
      content,
      smsUnits: unitsNeeded,
      costGHS: cashCost,
      gatewayProvider: gatewayRes.provider,
      gatewayResponseId: gatewayRes.messageId,
      status: gatewayRes.status === 'Delivered' ? 'Delivered' : 'Sent',
    });

    res.status(200).json({
      success: true,
      message: `SMS dispatched successfully! (Deducted via ${paymentType})`,
      data: {
        messageDoc,
        remainingCredits: wallet.smsCredit,
        remainingBalance: wallet.balance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Bulk SMS Campaign (Supports Credits OR Cash Balance)
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
    const totalCashCost = Number((totalUnitsNeeded * RATE_PER_UNIT).toFixed(2));

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(400).json({ success: false, message: 'Wallet not found' });
    }

    let paymentType = '';

    if (wallet.smsCredit >= totalUnitsNeeded) {
      wallet.smsCredit -= totalUnitsNeeded;
      paymentType = 'SMS Credits';
    } else if (wallet.balance >= totalCashCost) {
      wallet.balance = Number((wallet.balance - totalCashCost).toFixed(2));
      paymentType = 'Cash Balance';
    } else {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds for bulk broadcast. Required: ${totalUnitsNeeded} SMS units or GHS ${totalCashCost.toFixed(2)}.`,
      });
    }

    // Dispatch messages
    const createdDocs = [];
    for (const phone of recipients) {
      const gatewayRes = await sendMultiSms({ senderId: senderId || 'FASREACH', recipientPhone: phone, content });
      const doc = await Message.create({
        userId,
        senderId: senderId || 'FASREACH',
        recipientPhone: phone,
        content,
        smsUnits: unitsPerMessage,
        costGHS: Number((unitsPerMessage * RATE_PER_UNIT).toFixed(2)),
        gatewayProvider: gatewayRes.provider,
        gatewayResponseId: gatewayRes.messageId,
        status: 'Sent',
      });
      createdDocs.push(doc);
    }

    await wallet.save();

    res.status(200).json({
      success: true,
      message: `Bulk SMS broadcast of ${totalRecipients} messages dispatched! (Deducted via ${paymentType})`,
      data: {
        totalDispatched: totalRecipients,
        remainingCredits: wallet.smsCredit,
        remainingBalance: wallet.balance,
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
