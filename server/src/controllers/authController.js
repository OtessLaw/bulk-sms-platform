const User = require('../models/User');
const Wallet = require('../models/Wallet');
const AuditLog = require('../models/AuditLog');
const { generateAccessToken } = require('../utils/jwt');

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'Regular User',
    });

    // Create Initial Wallet with 10 free SMS units
    const wallet = await Wallet.create({
      userId: user._id,
      balance: 0.0,
      smsCredit: 10,
    });

    const token = generateAccessToken({ id: user._id, role: user.role });

    await AuditLog.create({
      userId: user._id,
      action: 'USER_REGISTERED',
      details: `New account registered for ${user.email}`,
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        wallet,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const wallet = await Wallet.findOne({ userId: user._id });
    const token = generateAccessToken({ id: user._id, role: user.role });

    await AuditLog.create({
      userId: user._id,
      action: 'USER_LOGIN',
      details: `User logged in from ${req.ip || '127.0.0.1'}`,
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        wallet,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged in User & Wallet
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        wallet,
        isImpersonating: req.isImpersonating || false,
        impersonatorAdmin: req.impersonatorAdmin || null,
      },
    });
  } catch (error) {
    next(error);
  }
};
