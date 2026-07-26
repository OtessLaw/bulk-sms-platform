const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Coupon = require('../models/Coupon');
const Invoice = require('../models/Invoice');
const Wallet = require('../models/Wallet');

// @desc    Get Subscription Plans & Active User Subscription (Excludes Free Plan)
// @route   GET /api/subscriptions
exports.getSubscriptions = async (req, res, next) => {
  try {
    let plans = await Plan.find({ priceMonthly: { $gt: 0 } }).sort({ priceMonthly: 1 });

    if (plans.length === 0) {
      plans = await Plan.create([
        {
          name: 'Starter Business',
          slug: 'starter-business',
          priceMonthly: 150,
          priceYearly: 1500,
          smsCreditsIncluded: 4000,
          maxContacts: 10000,
          maxSenderIds: 3,
          features: ['4,000 Monthly SMS Units', '3 Custom Sender IDs', 'AI SMS Generator', 'CSV Contacts Import'],
        },
        {
          name: 'Enterprise Agency',
          slug: 'enterprise-agency',
          priceMonthly: 450,
          priceYearly: 4500,
          smsCreditsIncluded: 15000,
          maxContacts: 100000,
          maxSenderIds: 15,
          isPopular: true,
          features: ['15,000 Monthly SMS Units', '15 Custom Sender IDs', 'Multi-Gateway Failover', 'White-Label Reseller Portal', 'Developer REST API Access'],
        },
      ]);
    }

    const activeSubscription = await Subscription.findOne({ userId: req.user._id, status: 'Active' }).populate('planId');
    const invoices = await Invoice.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        plans,
        activeSubscription,
        invoices,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Subscribe / Upgrade Plan
// @route   POST /api/subscriptions/subscribe
exports.subscribePlan = async (req, res, next) => {
  try {
    const { planId, billingCycle } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription Plan not found' });
    }

    const isYearly = billingCycle === 'yearly';
    const cost = isYearly ? plan.priceYearly : plan.priceMonthly;

    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (wallet.balance < cost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance. Plan cost: GHS ${cost.toFixed(2)}. Available: GHS ${wallet.balance.toFixed(2)}. Please fund your wallet.`,
      });
    }

    wallet.balance -= cost;
    wallet.smsCredit += plan.smsCreditsIncluded;
    await wallet.save();

    // Calculate expiry date
    const expiresAt = new Date();
    if (isYearly) {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Cancel old active subscriptions
    await Subscription.updateMany({ userId: req.user._id, status: 'Active' }, { status: 'Expired' });

    const subscription = await Subscription.create({
      userId: req.user._id,
      planId: plan._id,
      billingCycle: isYearly ? 'yearly' : 'monthly',
      amount: cost,
      status: 'Active',
      expiresAt,
    });

    // Create Invoice
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const invoice = await Invoice.create({
      userId: req.user._id,
      invoiceNumber,
      amount: cost,
      description: `SaaS Subscription Plan: ${plan.name} (${billingCycle.toUpperCase()})`,
      status: 'Paid',
    });

    res.status(200).json({
      success: true,
      message: `Subscribed successfully to ${plan.name}! +${plan.smsCreditsIncluded} SMS units credited.`,
      data: { subscription, invoice, wallet },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Redeem Promo Coupon
// @route   POST /api/subscriptions/redeem-coupon
exports.redeemCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), status: 'Active' });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired promo code' });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      coupon.status = 'Expired';
      await coupon.save();
      return res.status(400).json({ success: false, message: 'Promo coupon maximum redemptions reached' });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    wallet.smsCredit += coupon.bonusUnits;
    await wallet.save();

    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' redeemed successfully! +${coupon.bonusUnits} SMS units added to your wallet.`,
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};
