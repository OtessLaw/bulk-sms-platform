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
    const { userId, amount, smsUnits, action } = req.body; // action: 'credit' or 'debit'

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
