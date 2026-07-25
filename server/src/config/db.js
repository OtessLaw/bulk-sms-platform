const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bulk_sms_platform';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for cluster selection
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    console.log('[Database Notice] Ensure 0.0.0.0/0 (Allow Access From Anywhere) is added to Network Access in MongoDB Atlas.');
    // Do not crash node process immediately on start so Render health checks can log informative details
  }
};

module.exports = connectDB;
