const SenderId = require('../models/SenderId');

exports.getSenderIds = async (req, res, next) => {
  try {
    const senderIds = await SenderId.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: senderIds });
  } catch (error) {
    next(error);
  }
};

exports.requestSenderId = async (req, res, next) => {
  try {
    const { senderId, purpose, sampleMessage } = req.body;
    const existing = await SenderId.findOne({ senderId: senderId.toUpperCase() });
    if (existing && existing.status === 'Approved') {
      return res.status(400).json({ success: false, message: 'Sender ID is already registered' });
    }

    const doc = await SenderId.create({
      userId: req.user._id,
      senderId: senderId.toUpperCase(),
      purpose,
      sampleMessage,
      status: 'Pending',
    });

    res.status(201).json({ success: true, message: 'Sender ID application submitted for approval', data: doc });
  } catch (error) {
    next(error);
  }
};
