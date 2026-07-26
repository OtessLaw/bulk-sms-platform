const Message = require('../models/Message');
const { checkArkeselDeliveryStatus } = require('../services/multiSmsService');

// @desc    Get Real-Time Delivery Reports with Live Arkesel Synchronization
// @route   GET /api/reports
exports.getReports = async (req, res, next) => {
  try {
    // 1. Live Sync Pending / Submitted Messages with Arkesel
    const pendingMessages = await Message.find({
      userId: req.user._id,
      status: { $in: ['Pending', 'Submitted'] },
    }).limit(20);

    if (pendingMessages.length > 0) {
      for (const msg of pendingMessages) {
        if (msg.gatewayResponseId) {
          const liveStatus = await checkArkeselDeliveryStatus(msg.gatewayResponseId);
          if (liveStatus && liveStatus !== msg.status) {
            msg.status = liveStatus;
            await msg.save();
          }
        }
      }
    }

    // 2. Fetch Latest Messages & Delivery Stats
    const messages = await Message.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100);
    const totalSent = await Message.countDocuments({ userId: req.user._id });
    const deliveredCount = await Message.countDocuments({ userId: req.user._id, status: 'Delivered' });
    const pendingCount = await Message.countDocuments({ userId: req.user._id, status: { $in: ['Pending', 'Submitted'] } });
    const failedCount = await Message.countDocuments({ userId: req.user._id, status: 'Failed' });

    res.status(200).json({
      success: true,
      data: {
        messages,
        stats: {
          totalSent,
          deliveredCount,
          pendingCount,
          failedCount,
          deliveryRate: totalSent > 0 ? ((deliveredCount / totalSent) * 100).toFixed(1) : '100.0',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Arkesel Real-Time Delivery Webhook Listener
// @route   POST /api/sms/webhook/arkesel
exports.arkeselWebhook = async (req, res, next) => {
  try {
    const { sms_id, message_id, status, recipient } = req.body;
    const targetId = sms_id || message_id;

    if (targetId) {
      const msg = await Message.findOne({ gatewayResponseId: targetId });
      if (msg) {
        const rawStatus = String(status || '').toLowerCase();
        if (rawStatus.includes('delivered')) msg.status = 'Delivered';
        else if (rawStatus.includes('failed') || rawStatus.includes('rejected')) msg.status = 'Failed';
        else if (rawStatus.includes('pending')) msg.status = 'Pending';
        await msg.save();
        console.log(`[Arkesel Webhook] Updated msg ${msg._id} to status '${msg.status}'`);
      }
    }

    res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (error) {
    res.status(200).json({ success: true });
  }
};
