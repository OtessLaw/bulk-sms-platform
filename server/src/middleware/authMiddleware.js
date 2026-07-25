const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const SystemSetting = require('../models/SystemSetting');

const protect = async (req, res, next) => {
  let token;
  const apiKeyHeader = req.headers['x-api-key'];

  if (apiKeyHeader) {
    const keyDoc = await ApiKey.findOne({ key: apiKeyHeader, status: 'Active' });
    if (!keyDoc) {
      return res.status(401).json({ success: false, message: 'Invalid or revoked API Key' });
    }
    keyDoc.lastUsedAt = new Date();
    await keyDoc.save();

    req.user = await User.findById(keyDoc.userId).select('-password');
    if (!req.user || req.user.status === 'Suspended') {
      return res.status(403).json({ success: false, message: 'Account is suspended or invalid' });
    }
    return next();
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Provide Bearer token or x-api-key header.' });
  }

  if (token.startsWith('bms_live_')) {
    const keyDoc = await ApiKey.findOne({ key: token, status: 'Active' });
    if (!keyDoc) {
      return res.status(401).json({ success: false, message: 'Invalid or revoked API Key' });
    }
    keyDoc.lastUsedAt = new Date();
    await keyDoc.save();

    req.user = await User.findById(keyDoc.userId).select('-password');
    if (!req.user || req.user.status === 'Suspended') {
      return res.status(403).json({ success: false, message: 'Account is suspended or invalid' });
    }
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User account no longer exists' });
    }

    if (decoded.isImpersonating && decoded.impersonatorAdminId) {
      req.isImpersonating = true;
      req.impersonatorAdmin = await User.findById(decoded.impersonatorAdminId).select('-password');
    }

    if (req.user.status === 'Suspended') {
      return res.status(403).json({ success: false, message: 'Account is suspended. Please contact support.' });
    }

    const maintenance = await SystemSetting.findOne({ key: 'MAINTENANCE_MODE' });
    if (maintenance && maintenance.value === true) {
      const isAdminRole = ['Super Admin', 'Admin'].includes(req.user.role);
      if (!isAdminRole) {
        return res.status(503).json({
          success: false,
          message: 'System is currently undergoing scheduled maintenance. Please try again shortly.',
        });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

module.exports = { protect };
