const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { apiLimiter, authLimiter, smsLimiter } = require('./middleware/rateLimiter');
const { sanitizeInput } = require('./middleware/securityMiddleware');

const authRoutes = require('./routes/authRoutes');
const smsRoutes = require('./routes/smsRoutes');
const walletRoutes = require('./routes/walletRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const contactRoutes = require('./routes/contactRoutes');
const senderIdRoutes = require('./routes/senderIdRoutes');
const reportRoutes = require('./routes/reportRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const teamRoutes = require('./routes/teamRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy for Render/Vercel reverse proxies to get real client IPs for rate limiting
app.set('trust proxy', 1);

// 1. Advanced HTTP Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow inline styles & fonts for React UI
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' }, // Clickjacking protection
    noSniff: true, // MIME-type sniffing protection
    xssFilter: true, // XSS filter protection
  })
);

// 2. CORS Security Policy
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  })
);

// 3. Body Parsers with 10mb payload limit to prevent Memory Exhaustion DoS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Input Sanitization against NoSQL Query Injection & XSS
app.use(sanitizeInput);

// 5. Global API Rate Limiter
app.use('/api', apiLimiter);

// Health check endpoint for Render monitoring
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FasReach Enterprise Bulk SMS API Gateway Server Running',
    version: '1.0.0',
    status: 'Healthy',
    security: 'Enhanced Rate-Limiting & NoSQL Sanitization Active',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// API Routes with specialized Rate Limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/sms', smsLimiter, smsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/sender-ids', senderIdRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
