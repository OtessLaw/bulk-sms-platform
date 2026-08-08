const mongoose = require('mongoose');
const autoSeed = require('../seeders/autoSeed');

const connectDB = async (retryCount = 0) => {
  try {
    let rawUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bulk_sms_platform';
    const mongoUri = String(rawUri).trim().replace(/^["']|["']$/g, '');

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      family: 4, // Force IPv4 resolution for SRV DNS queries on cloud hosts
    });

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Automatically seed default Super Admin and Demo User if database is empty
    await autoSeed();
  } catch (error) {
    console.error(`[Database Connection Notice] Attempt ${retryCount + 1}: ${error.message}`);
    if (retryCount < 3) {
      console.log('[Database] Retrying connection in 3 seconds...');
      setTimeout(() => connectDB(retryCount + 1), 3000);
    }
  }
};

module.exports = connectDB;
