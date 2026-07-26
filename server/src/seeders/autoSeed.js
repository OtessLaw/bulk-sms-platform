const User = require('../models/User');
const Wallet = require('../models/Wallet');

const autoSeed = async () => {
  try {
    const adminUser = await User.findOne({ email: 'admin@bulksms.com' });
    if (!adminUser) {
      console.log('[AutoSeed] Creating clean initial Super Admin and Demo User accounts in MongoDB Atlas...');

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
        balance: 0.0,
        smsCredit: 0,
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

      console.log('[AutoSeed] ✅ Clean accounts created in live MongoDB Atlas database!');
    }
  } catch (err) {
    console.error('[AutoSeed Error]', err.message);
  }
};

module.exports = autoSeed;
