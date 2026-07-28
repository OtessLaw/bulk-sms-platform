const SenderId = require('../models/SenderId');
const { registerArkeselSenderId } = require('../services/multiSmsService');

// Explicit Exact-Match Institutional & Telecom Headers (Anti-Phishing Security Filter)
const PROTECTED_INSTITUTIONS_EXACT = new Set([
  // Telecoms
  'MTN', 'MTNGHANA', 'TELECEL', 'VODAFONE', 'AIRTELTIGO', 'AIRTEL', 'TIGO', 'ATGHANA', 'GLO',
  // Banks & Payment Gateways
  'GCB', 'ECOBANK', 'STANBIC', 'ABSA', 'CALBANK', 'FIDELITY', 'ZENITH', 'ACCESS', 'ACCESSBANK',
  'UBA', 'GTBANK', 'BOA', 'BANKOFGHANA', 'SGGHANA', 'ADB', 'NIB', 'FIRSTBANK', 'BESTPOINT',
  'MOMO', 'MOBILEMONEY', 'GHIPSS', 'GIPSS', 'PAYSTACK', 'HUBTEL', 'ARKESEL', 'SUREPAY',
  // Major Public Agencies & Utilities
  'GRA', 'SSNIT', 'ECG', 'GWCL', 'NCA', 'NIA', 'GHANASTAT', 'POLICE', 'GHPOLICE', 'FIRESERVICE',
  'MILITARY', 'GOVGHANA', 'PARLIAMENT', 'MINISTRY', 'PASSPORT', 'JUDICIARY', 'DVLA', 'COCOBOD',
]);

// @desc    Get User or All Sender IDs
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

// @desc    Submit & Register Sender ID (Created as Pending)
// @route   POST /api/sender-ids/request
exports.requestSenderId = async (req, res, next) => {
  try {
    const { senderId, purpose, sampleMessage } = req.body;
    const cleanHeader = senderId ? senderId.trim().toUpperCase() : '';

    if (!cleanHeader || cleanHeader.length > 11) {
      return res.status(400).json({ success: false, message: 'Sender ID header must be 1 to 11 characters long' });
    }

    // Exact Match Fraud Check
    if (PROTECTED_INSTITUTIONS_EXACT.has(cleanHeader)) {
      return res.status(400).json({
        success: false,
        message: `Sender ID header '${cleanHeader}' is unavailable. Please choose a custom business header.`,
      });
    }

    // Check if user already registered this Sender ID
    let existing = await SenderId.findOne({ userId: req.user._id, senderId: cleanHeader });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: `Sender ID '${cleanHeader}' is already on your account (${existing.status})`,
        data: existing,
      });
    }

    // Register Sender ID directly with Gateway API
    const arkeselRes = await registerArkeselSenderId({ senderId: cleanHeader, purpose });

    // Create Sender ID with initial Pending status
    const doc = await SenderId.create({
      userId: req.user._id,
      senderId: cleanHeader,
      purpose,
      sampleMessage,
      status: 'Pending', // Accurately set to Pending for review/approval
    });

    res.status(201).json({
      success: true,
      message: `Sender ID '${cleanHeader}' submitted successfully! Status is set to Pending Approval.`,
      data: doc,
    });
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

    res.status(200).json({ success: true, message: `Sender ID '${doc.senderId}' approved!`, data: doc });
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
