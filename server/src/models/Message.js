const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    content: { type: String, required: true },
    smsUnits: { type: Number, default: 1 },
    costGHS: { type: Number, default: 0.04 },
    gatewayProvider: { type: String, default: 'Arkesel' },
    gatewayResponseId: { type: String, default: '' },
    status: { type: String, enum: ['Sent', 'Delivered', 'Failed', 'Pending'], default: 'Sent' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
