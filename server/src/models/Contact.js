const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    groupName: { type: String, default: 'General' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);
