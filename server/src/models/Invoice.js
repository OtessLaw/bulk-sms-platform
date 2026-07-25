const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', InvoiceSchema);
