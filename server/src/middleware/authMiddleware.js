const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const SystemSetting = require('../models/SystemSetting');

const protect = async (req, res, next) => {
  // Extract API key from all possible headers, query params, or body fields
  const apiKeyCandidate =
    req.headers['x-api-key'] ||
    req.headers['X-API-KEY'] ||
    req.headers['api-key'] ||
    req.headers['API-KEY'] ||
    req.headers['apikey'] ||
    req.headers['APIKEY'] ||
    req.headers['x-api-token'] ||
    req.headers['key'] ||
    req.query?.api_key ||
    req.query?.apiKey ||
    req.query?.key ||
    req.query?.token ||
    req.query?.access_token ||
    req.body?.api_key ||
    req.body?.apiKey ||
    req.body?.key ||
    req.body?.token ||
    req.body?.access_token;

  let token;
  if (req.headers.authorization) {
    const authHeader = String(req.headers.authorization).trim();
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader;
    }
  }

  const rawKey = String(apiKeyCandidate || token || '').trim();

  // Handle API Key authentication (SHA-256 Hashed or Legacy)
  if (rawKey && (rawKey.startsWith('fr_live_') || rawKey.startsWith('bms_live_') || apiKeyCandidate)) {
    const crypto = require('crypto');
    const calculatedHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const keyDoc = await ApiKey.findOne({
      $or: [{ keyHash: calculatedHash }, { key: rawKey }],
      status: 'Active',
    });

    if (keyDoc) {
      keyDoc.lastUsedAt = new Date();
      await keyDoc.save();

      req.user = await User.findById(keyDoc.userId).select('-password');
      if (!req.user || req.user.status === 'Suspended') {
        return res.status(403).json({ success: false, message: 'Account is suspended or invalid' });
      }
      return next();
    }
    if (apiKeyCandidate || rawKey.startsWith('fr_live_') || rawKey.startsWith('bms_live_')) {
      return res.status(401).json({ success: false, message: 'Invalid or revoked API Key' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Provide Bearer token or x-api-key header / query param.' });
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
