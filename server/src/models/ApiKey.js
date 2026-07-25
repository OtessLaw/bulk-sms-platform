const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: 'Live API Key' },
    key: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Active', 'Revoked'], default: 'Active' },
    lastUsedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApiKey', ApiKeySchema);
