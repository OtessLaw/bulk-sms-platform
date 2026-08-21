const User = require('../models/User');
const Wallet = require('../models/Wallet');
const AuditLog = require('../models/AuditLog');
const { generateAccessToken } = require('../utils/jwt');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const { formatPhoneForArkesel } = require('../utils/phoneFormatter');

    const cleanEmail = (email || '').toLowerCase().trim();
    const rawPhone = (phone || '').trim();
    const cleanPhone = formatPhoneForArkesel(rawPhone);
    const digitsOnly = rawPhone.replace(/[^0-9]/g, '');

    // 1. Check duplicate Email
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    // 2. Check duplicate Phone Number across formats (e.g. 0241112233, 233241112233, +233241112233)
    if (rawPhone) {
      const phoneQueries = [{ phone: rawPhone }];
      if (cleanPhone) phoneQueries.push({ phone: cleanPhone });
      if (digitsOnly) phoneQueries.push({ phone: digitsOnly });

      const existingPhone = await User.findOne({ $or: phoneQueries });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'An account with this phone number already exists. Please Sign In instead.',
        });
      }
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'Regular User',
      status: 'Pending Verification',
    });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    try {
      await emailService.sendVerificationEmail(user.email, user.name, verificationCode);
    } catch(err) {
      console.error('Failed to send verification email:', err);
    }

    try {
      if (user.phone) {
        const multiSmsService = require('../services/multiSmsService');
        await multiSmsService.sendMultiSms({
          senderId: 'FASREACH',
          recipientPhone: user.phone,
          content: `Your FasReach verification code is ${verificationCode}. Valid for 15 minutes.`,
        });
      }
    } catch (smsErr) {
      console.error('Failed to send verification SMS:', smsErr);
    }

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
      message: 'Registration successful. Verification email sent.',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified },
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

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/phone and password.' });
    }

    const cleanInput = String(email).trim().toLowerCase();
    const rawInput = String(email).trim();
    const { formatPhoneForArkesel } = require('../utils/phoneFormatter');
    const formattedPhone = formatPhoneForArkesel(rawInput);
    const digitsOnly = rawInput.replace(/[^0-9]/g, '');

    const userQueries = [
      { email: cleanInput },
      { phone: rawInput },
    ];
    if (formattedPhone) userQueries.push({ phone: formattedPhone });
    if (digitsOnly) userQueries.push({ phone: digitsOnly });

    const user = await User.findOne({ $or: userQueries });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Check your email/phone and password.' });
    }

    const isMatch = await user.matchPassword(String(password).trim());
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Check your email/phone and password.' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended' });
    }

    if (!user.isEmailVerified && !['Super Admin', 'Admin'].includes(user.role)) {
      const token = generateAccessToken({ id: user._id, role: user.role });
      return res.status(200).json({ 
        success: true, 
        needsVerification: true, 
        message: 'Please verify your email address',
        data: {
          token,
          user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified }
        }
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: user._id, balance: 0.0, smsCredit: 10 });
    }

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

// @desc    Verify email
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    if (user.emailVerificationCode !== code || user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    user.status = 'Active';
    await user.save();

    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: user._id, balance: 0.0, smsCredit: 10 });
    }

    const token = generateAccessToken({ id: user._id, role: user.role });

    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch(err) {
      console.error('Failed to send welcome email:', err);
    }

    res.status(200).json({
      success: true,
      message: 'Email successfully verified',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: true },
        wallet,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
exports.resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    try {
      await emailService.sendVerificationEmail(user.email, user.name, verificationCode);
    } catch(err) {
      console.error('Failed to resend verification email:', err);
    }

    try {
      if (user.phone) {
        const multiSmsService = require('../services/multiSmsService');
        await multiSmsService.sendMultiSms({
          senderId: 'FASREACH',
          recipientPhone: user.phone,
          content: `Your new FasReach verification code is ${verificationCode}. Valid for 15 minutes.`,
        });
      }
    } catch (smsErr) {
      console.error('Failed to resend verification SMS:', smsErr);
    }

    res.status(200).json({ success: true, message: 'Verification code sent to your email and phone number!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'https://fasreach.com'}/reset-password/${resetToken}`;

    try {
      await emailService.sendPasswordResetEmail(user.email, user.name, resetToken, resetUrl);
    } catch(err) {
      console.error('Failed to send reset email:', err);
      return res.status(500).json({ success: false, message: 'Error sending email' });
    }

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been successfully reset' });
  } catch (error) {
    next(error);
  }
};
