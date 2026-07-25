const mongoose = require('mongoose');

const SenderIdSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: String, required: true, uppercase: true, maxlength: 11, trim: true },
    purpose: { type: String, required: true },
    sampleMessage: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SenderId', SenderIdSchema);
