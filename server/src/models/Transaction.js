const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Deposit', 'SMS Purchase', 'Admin Credit', 'Admin Debit', 'Refund'], required: true },
    channel: { type: String, default: 'Paystack' },
    status: { type: String, enum: ['Pending', 'Successful', 'Failed'], default: 'Pending' },
    unitsAdded: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
