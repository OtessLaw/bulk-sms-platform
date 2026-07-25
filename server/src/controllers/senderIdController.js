const SenderId = require('../models/SenderId');

// @desc    Get User or All Sender IDs (Admin gets all)
// @route   GET /api/sender-ids
exports.getSenderIds = async (req, res, next) => {
  try {
    const isAdminRole = ['Super Admin', 'Admin'].includes(req.user.role);
    const filter = isAdminRole ? {} : { userId: req.user._id };

    const senderIds = await SenderId.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json({ success: true, data: senderIds });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Sender ID Application
// @route   POST /api/sender-ids/request
exports.requestSenderId = async (req, res, next) => {
  try {
    const { senderId, purpose, sampleMessage } = req.body;
    const cleanHeader = senderId ? senderId.trim().toUpperCase() : '';

    if (!cleanHeader || cleanHeader.length > 11) {
      return res.status(400).json({ success: false, message: 'Sender ID header must be 1 to 11 characters long' });
    }

    const existing = await SenderId.findOne({ senderId: cleanHeader, status: 'Approved' });
    if (existing) {
      return res.status(400).json({ success: false, message: `Sender ID '${cleanHeader}' is already registered` });
    }

    const doc = await SenderId.create({
      userId: req.user._id,
      senderId: cleanHeader,
      purpose,
      sampleMessage,
      status: 'Pending',
    });

    res.status(201).json({ success: true, message: 'Sender ID application submitted for approval', data: doc });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Approve Sender ID
// @route   PUT /api/sender-ids/:id/approve
exports.approveSenderId = async (req, res, next) => {
  try {
    const doc = await SenderId.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Sender ID application not found' });
    }

    doc.status = 'Approved';
    await doc.save();

    res.status(200).json({ success: true, message: `Sender ID '${doc.senderId}' approved! User can now use it in SMS composer.`, data: doc });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Reject Sender ID
// @route   PUT /api/sender-ids/:id/reject
exports.rejectSenderId = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const doc = await SenderId.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Sender ID application not found' });
    }

    doc.status = 'Rejected';
    doc.rejectionReason = reason || 'Application rejected by Admin';
    await doc.save();

    res.status(200).json({ success: true, message: `Sender ID '${doc.senderId}' rejected`, data: doc });
  } catch (error) {
    next(error);
  }
};
