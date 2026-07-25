const mongoose = require('mongoose');

const ProviderConfigSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['Arkesel', 'Hubtel', 'Twilio'], required: true },
    isPrimary: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Standby', 'Disabled'], default: 'Active' },
    apiKey: { type: String, default: '' },
    balance: { type: String, default: '5,000 Units' },
    latency: { type: String, default: '35ms' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProviderConfig', ProviderConfigSchema);
