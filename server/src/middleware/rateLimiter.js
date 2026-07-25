const rateLimit = require('express-rate-limit');

// 1. General API Rate Limiter (Max 100 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// 2. Strict Auth Rate Limiter (Max 20 login/register attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Account temporarily locked for 15 minutes to protect against brute-force attacks.',
  },
});

// 3. SMS Dispatch Rate Limiter (Max 30 SMS dispatches per minute per IP)
const smsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'SMS dispatch rate limit exceeded. Maximum 30 broadcasts per minute permitted.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  smsLimiter,
};
