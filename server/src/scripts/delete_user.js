const mongoose = require('mongoose');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}

const URI = 'mongodb+srv://lawrenceadjei881_db_user:Law865907@cluster0.gpiu1od.mongodb.net/bulk_sms_platform?retryWrites=true&w=majority';

async function deleteUser() {
  const targetEmail = 'lawrenceadjei884@gmail.com';
  console.log(`--- DELETING USER ACCOUNT FOR: ${targetEmail} ---`);

  try {
    const conn = await mongoose.createConnection(URI, { serverSelectionTimeoutMS: 5000, family: 4 }).asPromise();
    console.log('Connected to MongoDB Atlas database bulk_sms_platform!');

    const userDoc = await conn.collection('users').findOne({ email: targetEmail.toLowerCase() });
    
    if (!userDoc) {
      console.log(`No user account found with email "${targetEmail}". It is ready for new registration!`);
    } else {
      const userId = userDoc._id;
      const delUser = await conn.collection('users').deleteOne({ _id: userId });
      const delWallet = await conn.collection('wallets').deleteMany({ userId });
      const delKeys = await conn.collection('apikeys').deleteMany({ userId });

      console.log(`✅ Successfully deleted user "${targetEmail}" (ID: ${userId})!`);
      console.log(` - Users deleted: ${delUser.deletedCount}`);
      console.log(` - Wallets deleted: ${delWallet.deletedCount}`);
      console.log(` - API keys deleted: ${delKeys.deletedCount}`);
      console.log('🎉 Email and phone number are now 100% cleared and ready for new account signup!');
    }

    await conn.close();
  } catch (err) {
    console.error('Delete Error:', err.message);
  }
}

deleteUser();
