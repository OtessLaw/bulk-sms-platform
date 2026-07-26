const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderId: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    content: { type: String, required: true },
    smsUnits: { type: Number, default: 1 },
    costGHS: { type: Number, default: 0.04 },
    gatewayProvider: { type: String, default: 'Arkesel' },
    gatewayResponseId: { type: String, default: '', index: true },
    scheduledFor: { type: Date, default: null, index: true },
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Delivered', 'Failed', 'Scheduled'],
      default: 'Pending',
      index: true,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
