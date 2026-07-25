const User = require('../models/User');
const Wallet = require('../models/Wallet');

const autoSeed = async () => {
  try {
    const adminCount = await User.countDocuments({ email: 'admin@bulksms.com' });
    if (adminCount === 0) {
      console.log('[AutoSeed] Creating default initial Super Admin and Regular User accounts in MongoDB Atlas...');

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

      // 2. Demo User
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
        balance: 0.0,
        smsCredit: 10,
      });

      console.log('[AutoSeed] ✅ Default accounts seeded in live MongoDB Atlas database!');
    }
  } catch (err) {
    console.error('[AutoSeed Error]', err.message);
  }
};

module.exports = autoSeed;
