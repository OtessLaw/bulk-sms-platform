const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const PaystackService = require('../services/paystackService');
const { RATE_PER_UNIT } = require('../utils/costCalculator');

// @desc    Get Wallet Balance & Ledger
// @route   GET /api/wallet
exports.getWallet = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user._id, balance: 100, smsCredit: 250 });
    }

    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        wallet,
        transactions,
        ratePerUnit: RATE_PER_UNIT,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initialize Paystack Funding
// @route   POST /api/wallet/fund
exports.initializeFunding = async (req, res, next) => {
  try {
    const { amount, redirectUrl } = req.body;
    const user = req.user;

    if (!amount || amount < 20) {
      return res.status(400).json({ success: false, message: 'Minimum deposit amount is 20 GHS' });
    }

    const reference = `WLT_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const unitsToAdd = Math.floor(amount / RATE_PER_UNIT);

    await Transaction.create({
      userId: user._id,
      reference,
      amount,
      type: 'Deposit',
      channel: 'Paystack',
      status: 'Pending',
      unitsAdded: unitsToAdd,
      description: `Wallet Funding via Paystack (${unitsToAdd} SMS Units)`,
    });

    const paymentRes = await PaystackService.initializePayment({
      email: user.email,
      amount,
      reference,
      callbackUrl: redirectUrl || 'http://localhost:5173/wallet?funding=success',
      metadata: { userId: user._id, unitsToAdd },
    });

    res.status(200).json({
      success: true,
      data: paymentRes.data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Paystack Payment
// @route   POST /api/wallet/verify
exports.verifyFunding = async (req, res, next) => {
  try {
    const { reference } = req.body;
    const userId = req.user._id;

    const transaction = await Transaction.findOne({ reference });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction reference not found' });
    }

    if (transaction.status === 'Successful') {
      const wallet = await Wallet.findOne({ userId });
      return res.status(200).json({ success: true, message: 'Transaction already verified', data: { wallet } });
    }

    const paystackRes = await PaystackService.verifyPayment(reference);

    if (paystackRes.status && (paystackRes.data?.status === 'success' || paystackRes.status === true)) {
      transaction.status = 'Successful';
      await transaction.save();

      const wallet = await Wallet.findOne({ userId });
      const addedUnits = transaction.unitsAdded || Math.floor(transaction.amount / RATE_PER_UNIT);
      wallet.balance += transaction.amount;
      wallet.smsCredit += addedUnits;
      await wallet.save();

      return res.status(200).json({
        success: true,
        message: 'Wallet credited successfully',
        data: { wallet, transaction },
      });
    } else {
      transaction.status = 'Failed';
      await transaction.save();
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    next(error);
  }
};
