const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start HTTP server first so Render health check passes
app.listen(PORT, () => {
  console.log('=======================================================');
  console.log(`🚀 FASREACH SAAS BACKEND RUNNING ON PORT: ${PORT}`);
  console.log(`🌟 MODE: ${process.env.NODE_ENV || 'development'}`);
  console.log('=======================================================');

  // Initiate MongoDB connection
  connectDB();
});
