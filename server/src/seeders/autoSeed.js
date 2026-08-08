const User = require('../models/User');
const Wallet = require('../models/Wallet');

const autoSeed = async () => {
  try {
    // 1. Super Admin
    let superAdmin = await User.findOne({ email: 'admin@bulksms.com' });
    if (!superAdmin) {
      console.log('[AutoSeed] Creating Super Admin account...');
      superAdmin = await User.create({
        name: 'Super Admin',
        email: 'admin@bulksms.com',
        phone: '+233240000000',
        password: 'AdminPass123!',
        role: 'Super Admin',
        status: 'Active',
        isEmailVerified: true,
      });
      await Wallet.create({ userId: superAdmin._id, balance: 0.0, smsCredit: 0 });
    } else {
      superAdmin.password = 'AdminPass123!';
      superAdmin.status = 'Active';
      superAdmin.isEmailVerified = true;
      await superAdmin.save();
    }

    // 2. Demo User
    let demoUser = await User.findOne({ email: 'user@bulksms.com' });
    if (!demoUser) {
      console.log('[AutoSeed] Creating Demo Client account...');
      demoUser = await User.create({
        name: 'Demo Client',
        email: 'user@bulksms.com',
        phone: '+233541112233',
        password: 'UserPass123!',
        role: 'Regular User',
        status: 'Active',
        isEmailVerified: true,
      });
      await Wallet.create({ userId: demoUser._id, balance: 0.0, smsCredit: 10 });
    } else {
      demoUser.password = 'UserPass123!';
      demoUser.status = 'Active';
      demoUser.isEmailVerified = true;
      await demoUser.save();
    }

    console.log('[AutoSeed] ✅ Default accounts ready in MongoDB Atlas!');
  } catch (err) {
    console.error('[AutoSeed Error]', err.message);
  }
};

module.exports = autoSeed;
