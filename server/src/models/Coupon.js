const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, uppercase: true, unique: true },
    bonusUnits: { type: Number, required: true },
    maxUses: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', CouponSchema);
