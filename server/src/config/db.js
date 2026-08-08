const mongoose = require('mongoose');
const autoSeed = require('../seeders/autoSeed');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bulk_sms_platform';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically seed default Super Admin and Demo User if database is empty
    await autoSeed();
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
  }
};

module.exports = connectDB;
