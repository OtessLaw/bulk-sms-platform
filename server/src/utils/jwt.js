const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bulk_sms_jwt_secret_key_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1d';

const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
