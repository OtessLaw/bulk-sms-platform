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
      wallet = await Wallet.create({ userId: req.user._id, balance: 0.0, smsCredit: 10 });
    }

    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(25);

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

// @desc    Initialize Paystack Cash Deposit
// @route   POST /api/wallet/fund
exports.initializeFunding = async (req, res, next) => {
  try {
    const { amount, redirectUrl } = req.body;
    const user = req.user;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount < 1) {
      return res.status(400).json({ success: false, message: 'Minimum deposit amount is 1 GHS' });
    }

    const reference = `WLT_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    await Transaction.create({
      userId: user._id,
      reference,
      amount: depositAmount,
      type: 'Deposit',
      channel: 'Paystack',
      status: 'Pending',
      unitsAdded: 0, // Cash deposit - money stays in Cash Balance!
      description: `Cash Wallet Funding via Paystack (GHS ${depositAmount.toFixed(2)})`,
    });

    const paymentRes = await PaystackService.initializePayment({
      email: user.email,
      amount: depositAmount,
      reference,
      callbackUrl: redirectUrl || 'http://localhost:5173/wallet',
      metadata: { userId: user._id, depositAmount },
    });

    res.status(200).json({
      success: true,
      data: paymentRes.data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Paystack Payment & Credit Cash Balance
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
      // Add 100% of the money into user's cash balance
      wallet.balance = Number((wallet.balance + transaction.amount).toFixed(2));
      await wallet.save();

      return res.status(200).json({
        success: true,
        message: `Wallet credited GHS ${transaction.amount.toFixed(2)} cash balance!`,
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

// @desc    Buy SMS Credits using Cash Balance
// @route   POST /api/wallet/buy-credits
exports.buyCreditsFromBalance = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const cashAmount = Number(amount);
    const userId = req.user._id;

    if (!cashAmount || cashAmount < 1) {
      return res.status(400).json({ success: false, message: 'Minimum purchase is 1 GHS' });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < cashAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient cash balance. Available: GHS ${wallet?.balance?.toFixed(2) || '0.00'}.`,
      });
    }

    const smsUnitsToAdd = Math.floor(cashAmount / RATE_PER_UNIT);

    // Deduct cash and credit SMS units
    wallet.balance = Number((wallet.balance - cashAmount).toFixed(2));
    wallet.smsCredit += smsUnitsToAdd;
    await wallet.save();

    await Transaction.create({
      userId,
      reference: `PUR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: cashAmount,
      type: 'SMS Purchase',
      status: 'Successful',
      unitsAdded: smsUnitsToAdd,
      description: `Converted GHS ${cashAmount.toFixed(2)} cash balance into ${smsUnitsToAdd} SMS units`,
    });

    res.status(200).json({
      success: true,
      message: `Purchased ${smsUnitsToAdd} SMS units for GHS ${cashAmount.toFixed(2)}!`,
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};
