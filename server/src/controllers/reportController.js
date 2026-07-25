const Message = require('../models/Message');

exports.getReports = async (req, res, next) => {
  try {
    const messages = await Message.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100);
    const totalSent = await Message.countDocuments({ userId: req.user._id });
    const deliveredCount = await Message.countDocuments({ userId: req.user._id, status: 'Delivered' });

    res.status(200).json({
      success: true,
      data: {
        messages,
        stats: {
          totalSent,
          deliveredCount,
          deliveryRate: totalSent > 0 ? ((deliveredCount / totalSent) * 100).toFixed(1) : '100.0',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
