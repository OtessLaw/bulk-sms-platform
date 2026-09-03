const Message = require('../models/Message');
const { checkArkeselDeliveryStatus } = require('../services/multiSmsService');

// @desc    Get Real-Time Delivery Reports with Live Arkesel Synchronization
// @route   GET /api/reports
exports.getReports = async (req, res, next) => {
  try {
    const isAdmin = ['Super Admin', 'Admin'].includes(req.user.role);
    const filter = isAdmin ? {} : { userId: req.user._id };

    // 1. Live Sync Pending / Submitted Messages with Arkesel
    const pendingMessages = await Message.find({
      ...filter,
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
    const limit = parseInt(req.query.limit) || 100;
    const messages = await Message.find(filter).sort({ createdAt: -1 }).limit(limit);
    const totalSent = await Message.countDocuments(filter);
    const deliveredCount = await Message.countDocuments({ ...filter, status: 'Delivered' });
    const pendingCount = await Message.countDocuments({ ...filter, status: { $in: ['Pending', 'Submitted'] } });
    const failedCount = await Message.countDocuments({ ...filter, status: 'Failed' });

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
    const payload = Object.keys(req.body).length > 0 ? req.body : req.query;
    const { sms_id, message_id, id, campaign_id, status, recipient } = payload;
    const targetId = sms_id || message_id || id || campaign_id;

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
