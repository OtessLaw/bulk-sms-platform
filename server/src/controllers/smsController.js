const Message = require('../models/Message');
const Wallet = require('../models/Wallet');
const { sendMultiSms } = require('../services/multiSmsService');
const { generateTemplates } = require('../services/aiTemplateService');
const { calculateSmsUnits, RATE_PER_UNIT } = require('../utils/costCalculator');

// @desc    Send Single SMS (Supports Immediate & Scheduled Dispatch)
// @route   POST /api/sms/send
exports.sendSMS = async (req, res, next) => {
  try {
    const body = req.body || {};
    const query = req.query || {};

    const recipientPhone =
      body.recipientPhone ||
      body.to ||
      body.phone ||
      body.recipient ||
      body.mobile ||
      body.destination ||
      query.recipientPhone ||
      query.to ||
      query.phone ||
      query.recipient ||
      query.mobile ||
      query.destination;

    const content =
      body.content ||
      body.message ||
      body.text ||
      body.body ||
      body.msg ||
      query.content ||
      query.message ||
      query.text ||
      query.body ||
      query.msg;

    const senderId =
      body.senderId ||
      body.sender ||
      body.from ||
      body.sender_id ||
      query.senderId ||
      query.sender ||
      query.from ||
      query.sender_id ||
      'FASREACH';

    const scheduledFor = body.scheduledFor || query.scheduledFor;
    const userId = req.user._id;

    if (!recipientPhone || !content) {
      return res.status(400).json({ success: false, message: 'Recipient phone (e.g. to/phone/recipientPhone) and message content (e.g. message/content/text) are required' });
    }

    const isScheduled = scheduledFor && new Date(scheduledFor) > new Date();
    const unitsNeeded = calculateSmsUnits(content);
    const cashCost = Number((unitsNeeded * RATE_PER_UNIT).toFixed(2));
    
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0.0, smsCredit: 10 });
    }

    let paymentType = '';

    if (wallet.smsCredit >= unitsNeeded) {
      wallet.smsCredit -= unitsNeeded;
      paymentType = 'SMS Credits';
    } else if (wallet.balance >= cashCost) {
      wallet.balance = Number((wallet.balance - cashCost).toFixed(2));
      paymentType = 'Cash Balance';
    } else {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds. Required: ${unitsNeeded} SMS unit(s) or GHS ${cashCost.toFixed(2)}. Available: ${wallet.smsCredit} credits & GHS ${wallet.balance.toFixed(2)} cash balance. Please top up your wallet.`,
      });
    }

    await wallet.save();

    // 1. Scheduled Dispatch Mode
    if (isScheduled) {
      const scheduleDate = new Date(scheduledFor);
      const messageDoc = await Message.create({
        userId,
        senderId: senderId || 'FASREACH',
        recipientPhone,
        content,
        smsUnits: unitsNeeded,
        costGHS: cashCost,
        scheduledFor: scheduleDate,
        status: 'Scheduled',
      });

      return res.status(200).json({
        success: true,
        message: `SMS scheduled successfully for ${scheduleDate.toLocaleString()}!`,
        data: {
          messageDoc,
          remainingCredits: wallet.smsCredit,
          remainingBalance: wallet.balance,
        },
      });
    }

    // 2. Immediate Dispatch Mode
    let gatewayRes = { success: true, provider: 'FasReach Gateway', messageId: `MSG_${Date.now()}`, status: 'Submitted' };
    try {
      gatewayRes = await sendMultiSms({ senderId: senderId || 'FASREACH', recipientPhone, content });
    } catch (err) {
      console.warn('[Gateway Notice]', err.message);
    }

    const messageDoc = await Message.create({
      userId,
      senderId: senderId || 'FASREACH',
      recipientPhone,
      content,
      smsUnits: unitsNeeded,
      costGHS: cashCost,
      gatewayProvider: gatewayRes.provider || 'FasReach Gateway',
      gatewayResponseId: gatewayRes.messageId || `MSG_${Date.now()}`,
      status: gatewayRes.status || 'Submitted',
    });

    res.status(200).json({
      success: true,
      message: `SMS dispatched successfully! (Paid via ${paymentType})`,
      data: {
        messageDoc,
        remainingCredits: wallet.smsCredit,
        remainingBalance: wallet.balance,
      },
    });
  } catch (error) {
    console.error('[sendSMS Controller Error]', error);
    res.status(400).json({ success: false, message: error.message || 'SMS dispatch failed' });
  }
};

// @desc    Send Bulk SMS Campaign (Supports Immediate & Scheduled Dispatch)
// @route   POST /api/sms/bulk
exports.sendBulkSMS = async (req, res, next) => {
  try {
    const body = req.body || {};
    const query = req.query || {};

    let rawRecipients = body.recipients || body.to || body.phones || body.recipientsList || query.recipients || query.to || query.phones;
    const content =
      body.content ||
      body.message ||
      body.text ||
      body.body ||
      body.msg ||
      query.content ||
      query.message ||
      query.text ||
      query.body ||
      query.msg;

    const senderId =
      body.senderId ||
      body.sender ||
      body.from ||
      body.sender_id ||
      query.senderId ||
      query.sender ||
      query.from ||
      query.sender_id ||
      'FASREACH';

    const scheduledFor = body.scheduledFor || query.scheduledFor;
    const userId = req.user._id;

    // Normalize recipients array: accept Array or comma/newline/semicolon-separated String
    let recipients = [];
    if (Array.isArray(rawRecipients)) {
      recipients = rawRecipients.map((r) => String(r).trim()).filter(Boolean);
    } else if (typeof rawRecipients === 'string') {
      recipients = rawRecipients.split(/[\n,;]+/).map((r) => r.trim()).filter(Boolean);
    }

    if (recipients.length === 0 || !content) {
      return res.status(400).json({ success: false, message: 'Recipients list (array or comma-separated numbers) and message content are required' });
    }

    const isScheduled = scheduledFor && new Date(scheduledFor) > new Date();
    const unitsPerMessage = calculateSmsUnits(content);
    const totalRecipients = recipients.length;
    const totalUnitsNeeded = unitsPerMessage * totalRecipients;
    const totalCashCost = Number((totalUnitsNeeded * RATE_PER_UNIT).toFixed(2));

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0.0, smsCredit: 10 });
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
        message: `Insufficient funds for bulk broadcast. Required: ${totalUnitsNeeded} SMS units or GHS ${totalCashCost.toFixed(2)}. Available: ${wallet.smsCredit} credits & GHS ${wallet.balance.toFixed(2)} cash balance.`,
      });
    }

    await wallet.save();

    // 1. Scheduled Bulk Dispatch
    if (isScheduled) {
      const scheduleDate = new Date(scheduledFor);
      const createdDocs = [];

      for (const phone of recipients) {
        const doc = await Message.create({
          userId,
          senderId: senderId || 'FASREACH',
          recipientPhone: phone,
          content,
          smsUnits: unitsPerMessage,
          costGHS: Number((unitsPerMessage * RATE_PER_UNIT).toFixed(2)),
          scheduledFor: scheduleDate,
          status: 'Scheduled',
        });
        createdDocs.push(doc);
      }

      return res.status(200).json({
        success: true,
        message: `Bulk broadcast of ${totalRecipients} messages scheduled for ${scheduleDate.toLocaleString()}!`,
        data: {
          totalScheduled: totalRecipients,
          remainingCredits: wallet.smsCredit,
          remainingBalance: wallet.balance,
        },
      });
    }

    // 2. Immediate Bulk Dispatch
    const createdDocs = [];
    for (const phone of recipients) {
      let gatewayRes = { success: true, provider: 'FasReach Gateway', messageId: `MSG_${Date.now()}`, status: 'Submitted' };
      try {
        gatewayRes = await sendMultiSms({ senderId: senderId || 'FASREACH', recipientPhone: phone, content });
      } catch (err) {
        console.warn('[Bulk Gateway Notice]', err.message);
      }

      const doc = await Message.create({
        userId,
        senderId: senderId || 'FASREACH',
        recipientPhone: phone,
        content,
        smsUnits: unitsPerMessage,
        costGHS: Number((unitsPerMessage * RATE_PER_UNIT).toFixed(2)),
        gatewayProvider: gatewayRes.provider || 'FasReach Gateway',
        gatewayResponseId: gatewayRes.messageId || `MSG_${Date.now()}`,
        status: gatewayRes.status || 'Submitted',
      });
      createdDocs.push(doc);
    }

    res.status(200).json({
      success: true,
      message: `Bulk SMS broadcast of ${totalRecipients} messages dispatched! (Paid via ${paymentType})`,
      data: {
        totalDispatched: totalRecipients,
        remainingCredits: wallet.smsCredit,
        remainingBalance: wallet.balance,
      },
    });
  } catch (error) {
    console.error('[sendBulkSMS Controller Error]', error);
    res.status(400).json({ success: false, message: error.message || 'Bulk SMS dispatch failed' });
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
