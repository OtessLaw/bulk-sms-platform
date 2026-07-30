const rateLimit = require('express-rate-limit');

// 1. General API Rate Limiter (High limit to allow live support polling without blocking users/admins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.originalUrl && req.originalUrl.includes('/api/ai'),
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after a few minutes.',
  },
});

// 2. Strict Auth Rate Limiter (Max 100 login/register attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Account temporarily locked for 15 minutes to protect against brute-force attacks.',
  },
});

// 3. SMS Dispatch Rate Limiter (Max 120 SMS dispatches per minute per IP)
const smsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'SMS dispatch rate limit exceeded. Maximum 120 broadcasts per minute permitted.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  smsLimiter,
};
