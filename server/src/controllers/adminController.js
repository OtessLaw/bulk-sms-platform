const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Message = require('../models/Message');
const AuditLog = require('../models/AuditLog');
const SystemSetting = require('../models/SystemSetting');
const { generateAccessToken } = require('../utils/jwt');

// @desc    Get Super Admin Platform Stats & Overview
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const totalSMS = await Message.countDocuments();

    const wallets = await Wallet.find();
    const totalWalletBalance = wallets.reduce((acc, w) => acc + (w.balance || 0), 0);

    const successfulTrx = await Transaction.find({ status: 'Successful' });
    const totalRevenue = successfulTrx.reduce((acc, t) => acc + (t.amount || 0), 0);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalSMS,
        totalWalletBalance,
        totalRevenue,
        recentUsers,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Platform Users
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    const userWallets = await Wallet.find();
    const walletMap = {};
    userWallets.forEach((w) => {
      walletMap[w.userId.toString()] = w;
    });

    const data = users.map((u) => ({
      ...u.toObject(),
      wallet: walletMap[u._id.toString()] || { balance: 0, smsCredit: 0 },
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Impersonate User ("Login as User")
// @route   POST /api/admin/impersonate/:id
exports.impersonateUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const impersonationToken = generateAccessToken({
      id: targetUser._id,
      role: targetUser.role,
      isImpersonating: true,
      impersonatorAdminId: req.user._id,
    });

    await AuditLog.create({
      userId: req.user._id,
      action: 'ADMIN_IMPERSONATION',
      details: `Super Admin impersonated user '${targetUser.email}'`,
    });

    res.status(200).json({
      success: true,
      message: `Impersonation token generated for ${targetUser.name}`,
      data: { token: impersonationToken, targetUser },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Adjust User Wallet
// @route   POST /api/admin/wallet/adjust
exports.adjustUserWallet = async (req, res, next) => {
  try {
    const { userId, amount, smsUnits, action } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'User wallet not found' });
    }

    const numAmount = Number(amount) || 0;
    const numUnits = Number(smsUnits) || 0;

    if (action === 'credit') {
      wallet.balance += numAmount;
      wallet.smsCredit += numUnits;
    } else {
      wallet.balance = Math.max(0, wallet.balance - numAmount);
      wallet.smsCredit = Math.max(0, wallet.smsCredit - numUnits);
    }

    await wallet.save();

    await Transaction.create({
      userId,
      reference: `ADM_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: numAmount,
      type: action === 'credit' ? 'Admin Credit' : 'Admin Debit',
      status: 'Successful',
      unitsAdded: action === 'credit' ? numUnits : -numUnits,
      description: `Manual admin adjustment by Super Admin (${req.user.name})`,
    });

    res.status(200).json({ success: true, message: `Wallet successfully ${action}ed!`, data: wallet });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Reset User Password
// @route   POST /api/admin/users/:id/reset-password
exports.resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword || 'Password123!';
    await user.save();

    await AuditLog.create({
      userId: req.user._id,
      action: 'ADMIN_PASSWORD_RESET',
      details: `Password reset performed for user '${user.email}'`,
    });

    res.status(200).json({ success: true, message: `Password for ${user.email} reset successfully!` });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Delete User Account
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete Super Admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    await Wallet.findOneAndDelete({ userId: req.params.id });

    res.status(200).json({ success: true, message: 'User account permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Maintenance Mode
// @route   POST /api/admin/maintenance
exports.toggleMaintenance = async (req, res, next) => {
  try {
    let setting = await SystemSetting.findOne({ key: 'MAINTENANCE_MODE' });
    if (!setting) {
      setting = await SystemSetting.create({ key: 'MAINTENANCE_MODE', value: true });
    } else {
      setting.value = !setting.value;
      await setting.save();
    }

    res.status(200).json({
      success: true,
      message: `System Maintenance Mode is now ${setting.value ? 'ENABLED' : 'DISABLED'}`,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get API Gateway Credentials
// @route   GET /api/admin/gateway-keys
exports.getGatewayKeys = async (req, res, next) => {
  try {
    const keys = await SystemSetting.find({
      key: { $in: ['ARKESEL_API_KEY', 'PAYSTACK_SECRET_KEY', 'PAYSTACK_PUBLIC_KEY', 'HUBTEL_CLIENT_ID', 'HUBTEL_CLIENT_SECRET'] },
    });

    const keyMap = {};
    keys.forEach((k) => {
      keyMap[k.key] = k.value;
    });

    res.status(200).json({
      success: true,
      data: {
        ARKESEL_API_KEY: keyMap.ARKESEL_API_KEY || process.env.ARKESEL_API_KEY || '',
        PAYSTACK_SECRET_KEY: keyMap.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY || '',
        PAYSTACK_PUBLIC_KEY: keyMap.PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || '',
        HUBTEL_CLIENT_ID: keyMap.HUBTEL_CLIENT_ID || process.env.HUBTEL_CLIENT_ID || '',
        HUBTEL_CLIENT_SECRET: keyMap.HUBTEL_CLIENT_SECRET || process.env.HUBTEL_CLIENT_SECRET || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save API Gateway Credentials (with automatic .trim() for clean keys)
// @route   POST /api/admin/gateway-keys
exports.saveGatewayKeys = async (req, res, next) => {
  try {
    const { ARKESEL_API_KEY, PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY, HUBTEL_CLIENT_ID, HUBTEL_CLIENT_SECRET } = req.body;

    const updates = [
      { key: 'ARKESEL_API_KEY', value: ARKESEL_API_KEY ? String(ARKESEL_API_KEY).trim() : '' },
      { key: 'PAYSTACK_SECRET_KEY', value: PAYSTACK_SECRET_KEY ? String(PAYSTACK_SECRET_KEY).trim() : '' },
      { key: 'PAYSTACK_PUBLIC_KEY', value: PAYSTACK_PUBLIC_KEY ? String(PAYSTACK_PUBLIC_KEY).trim() : '' },
      { key: 'HUBTEL_CLIENT_ID', value: HUBTEL_CLIENT_ID ? String(HUBTEL_CLIENT_ID).trim() : '' },
      { key: 'HUBTEL_CLIENT_SECRET', value: HUBTEL_CLIENT_SECRET ? String(HUBTEL_CLIENT_SECRET).trim() : '' },
    ];

    for (const item of updates) {
      await SystemSetting.findOneAndUpdate(
        { key: item.key },
        { key: item.key, value: item.value },
        { upsert: true, new: true }
      );
    }

    await AuditLog.create({
      userId: req.user._id,
      action: 'ADMIN_GATEWAY_KEYS_UPDATED',
      details: 'Super Admin updated gateway API keys (Arkesel / Paystack / Hubtel)',
    });

    res.status(200).json({ success: true, message: 'Gateway API credentials saved & trimmed successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Demo Accounts & Clean Up Old Balances in Atlas
// @route   POST /api/admin/reset-demo-balances
exports.resetDemoBalances = async (req, res, next) => {
  try {
    const superAdmin = await User.findOne({ email: 'admin@bulksms.com' });
    if (superAdmin) {
      await Wallet.findOneAndUpdate({ userId: superAdmin._id }, { balance: 0.0, smsCredit: 0 });
    }

    const demoUser = await User.findOne({ email: 'user@bulksms.com' });
    if (demoUser) {
      await Wallet.findOneAndUpdate({ userId: demoUser._id }, { balance: 0.0, smsCredit: 10 });
    }

    res.status(200).json({
      success: true,
      message: 'Demo accounts reset to clean zero cash balances in MongoDB Atlas!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Promo Coupons
// @route   GET /api/admin/coupons
exports.getCoupons = async (req, res, next) => {
  try {
    const Coupon = require('../models/Coupon');
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create New Promo Coupon
// @route   POST /api/admin/coupons
exports.createCoupon = async (req, res, next) => {
  try {
    const Coupon = require('../models/Coupon');
    const { code, bonusUnits, maxUses } = req.body;

    if (!code || !bonusUnits) {
      return res.status(400).json({ success: false, message: 'Coupon code and bonus units are required' });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ success: false, message: `Coupon code '${cleanCode}' already exists` });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      bonusUnits: Number(bonusUnits),
      maxUses: Number(maxUses) || 100,
      status: 'Active',
    });

    res.status(201).json({ success: true, message: `Promo coupon '${cleanCode}' created! (+${coupon.bonusUnits} SMS units)`, data: coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Promo Coupon
// @route   DELETE /api/admin/coupons/:id
exports.deleteCoupon = async (req, res, next) => {
  try {
    const Coupon = require('../models/Coupon');
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({ success: true, message: `Promo coupon '${coupon.code}' deleted` });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Security Audit Logs
// @route   GET /api/admin/audit-logs
exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).populate('userId', 'name email role');
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};
