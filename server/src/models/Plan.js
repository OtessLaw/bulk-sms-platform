const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    priceMonthly: { type: Number, required: true },
    priceYearly: { type: Number, required: true },
    smsCreditsIncluded: { type: Number, required: true },
    maxContacts: { type: Number, required: true },
    maxSenderIds: { type: Number, required: true },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', PlanSchema);
