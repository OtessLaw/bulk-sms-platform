const app = require('./app');
const connectDB = require('./config/db');
const initSmsScheduler = require('./cron/smsScheduler');

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately on 0.0.0.0 to bind to public network interface
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 FASREACH SAAS BACKEND RUNNING ON PORT: ${PORT}`);
  console.log(`🌟 MODE: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);

  // Connect MongoDB & Start SMS Scheduler
  connectDB();
  initSmsScheduler();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Rejection Error]: ${err.message}`);
});
