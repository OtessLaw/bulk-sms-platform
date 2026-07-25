const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bulk_sms_platform';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing users
    await User.deleteMany();
    await Wallet.deleteMany();

    // 1. Super Admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@bulksms.com',
      phone: '+233240000000',
      password: 'AdminPass123!',
      role: 'Super Admin',
      status: 'Active',
    });

    await Wallet.create({
      userId: superAdmin._id,
      balance: 10000.0,
      smsCredit: 250000,
    });

    // 2. Regular Demo User
    const demoUser = await User.create({
      name: 'Demo Client',
      email: 'user@bulksms.com',
      phone: '+233541112233',
      password: 'UserPass123!',
      role: 'Regular User',
      status: 'Active',
    });

    await Wallet.create({
      userId: demoUser._id,
      balance: 250.0,
      smsCredit: 1250,
    });

    console.log('=======================================================');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('👑 Super Admin: admin@bulksms.com / AdminPass123!');
    console.log('👤 Regular User: user@bulksms.com / UserPass123!');
    console.log('=======================================================');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedData();
