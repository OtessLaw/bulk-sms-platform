const VoiceCall = require('../models/VoiceCall');
const Wallet = require('../models/Wallet');
const { sendVoiceSmsCall } = require('../services/voiceService');

const VOICE_CALL_RATE_PER_30S = 0.08; // GHS 0.08 per 30-second voice call block

// @desc    Dispatch Voice Call (TTS or Audio File/Recording)
// @route   POST /api/voice/send
exports.sendVoiceCall = async (req, res, next) => {
  try {
    const { recipientPhone, recipients, type, textPrompt, audioUrl, audioBase64, voiceGender, voiceLanguage, durationSeconds } = req.body;
    const userId = req.user._id;

    // Normalize recipient list
    let targetPhones = [];
    if (Array.isArray(recipients) && recipients.length > 0) {
      targetPhones = recipients.map((p) => String(p).trim()).filter(Boolean);
    } else if (recipientPhone) {
      targetPhones = String(recipientPhone).split(/[\n,;]+/).map((p) => p.trim()).filter(Boolean);
    }

    if (targetPhones.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one recipient phone number is required.' });
    }

    if (type === 'TTS' && (!textPrompt || !textPrompt.trim())) {
      return res.status(400).json({ success: false, message: 'Text prompt is required for Text-to-Speech voice calls.' });
    }

    const estimatedSeconds = Number(durationSeconds) || 30;
    const callBlocksPerPhone = Math.ceil(estimatedSeconds / 30) || 1;
    const totalCostGHS = Number((targetPhones.length * callBlocksPerPhone * VOICE_CALL_RATE_PER_30S).toFixed(2));

    // Check & Deduct Wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0.0, smsCredit: 10 });
    }

    // Convert cost to equivalent SMS units (1 unit = 0.04 GHS, so 1 voice call block = 2 units)
    const requiredSmsUnits = callBlocksPerPhone * 2 * targetPhones.length;

    let paymentType = '';
    if (wallet.smsCredit >= requiredSmsUnits) {
      wallet.smsCredit -= requiredSmsUnits;
      paymentType = 'SMS Credits';
    } else if (wallet.balance >= totalCostGHS) {
      wallet.balance = Number((wallet.balance - totalCostGHS).toFixed(2));
      paymentType = 'Cash Balance';
    } else {
      return res.status(402).json({
        success: false,
        code: 402,
        message: `Insufficient wallet balance for Voice Call. Required: GHS ${totalCostGHS.toFixed(2)} (${requiredSmsUnits} units). Available: ${wallet.smsCredit} units, GHS ${wallet.balance.toFixed(2)}. Please top up your wallet.`,
      });
    }

    await wallet.save();

    // Dispatch Voice Calls
    const createdCalls = [];
    let gatewayFailedMsg = '';

    for (const phone of targetPhones) {
      let voiceRes = { success: true, provider: 'FasReach Voice Engine', messageId: `VOICE_${Date.now()}`, status: 'Submitted' };
      try {
        voiceRes = await sendVoiceSmsCall({
          recipientPhone: phone,
          textPrompt,
          audioUrl,
          audioBase64,
          type: type || 'TTS',
          voiceLanguage: voiceLanguage || 'en-GH',
          voiceGender: voiceGender || 'Female',
        });
      } catch (err) {
        console.warn('[Voice Dispatch Notice]', err.message);
        voiceRes = { success: false, provider: 'Arkesel Voice Gateway', error: err.message, status: 'Failed' };
      }

      if (!voiceRes.success && voiceRes.error) {
        gatewayFailedMsg = voiceRes.error;
      }

      const voiceDoc = await VoiceCall.create({
        userId,
        recipientPhone: phone,
        type: type || 'TTS',
        textPrompt: textPrompt || '',
        audioUrl: audioUrl || '',
        voiceGender: voiceGender || 'Female',
        voiceLanguage: voiceLanguage || 'en-GH',
        durationSeconds: estimatedSeconds,
        costGHS: Number((callBlocksPerPhone * VOICE_CALL_RATE_PER_30S).toFixed(2)),
        gatewayProvider: voiceRes.provider || 'FasReach Voice Engine',
        gatewayResponseId: voiceRes.messageId || `VOICE_${Date.now()}`,
        status: voiceRes.success ? 'Submitted' : 'Failed',
      });

      createdCalls.push(voiceDoc);
    }

    // If Arkesel rejected all calls, refund wallet and return HTTP 400 error
    if (gatewayFailedMsg && createdCalls.every((c) => c.status === 'Failed')) {
      if (paymentType === 'SMS Credits') {
        wallet.smsCredit += requiredSmsUnits;
      } else {
        wallet.balance = Number((wallet.balance + totalCostGHS).toFixed(2));
      }
      await wallet.save();

      return res.status(400).json({
        success: false,
        message: `Arkesel Gateway Error: ${gatewayFailedMsg}. (Your wallet balance has been refunded).`,
        error: gatewayFailedMsg,
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully dispatched ${targetPhones.length} Voice Call(s)! (Paid via ${paymentType})`,
      data: {
        totalDispatched: targetPhones.length,
        totalCostGHS,
        calls: createdCalls,
        remainingCredits: wallet.smsCredit,
        remainingBalance: wallet.balance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Voice Call History & Stats
// @route   GET /api/voice/history
exports.getVoiceCallHistory = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };

    const total = await VoiceCall.countDocuments(query);
    const calls = await VoiceCall.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    // Summary stats
    const totalAnswered = await VoiceCall.countDocuments({ userId: req.user._id, status: 'Answered' });
    const totalSubmitted = await VoiceCall.countDocuments({ userId: req.user._id, status: 'Submitted' });

    res.status(200).json({
      success: true,
      data: {
        calls,
        pagination: { total, page, pages: Math.ceil(total / limit) },
        stats: { totalCalls: total, totalAnswered, totalSubmitted },
      },
    });
  } catch (error) {
    next(error);
  }
};
