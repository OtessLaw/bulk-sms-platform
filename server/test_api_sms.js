require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

async function testApiSms() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  try {
    // 1. Get an active API key from the DB
    const ApiKey = require('./src/models/ApiKey');
    const Message = require('./src/models/Message');
    
    const keyDoc = await ApiKey.findOne({ status: 'Active' });
    if (!keyDoc) {
      console.log('No active API key found');
      return;
    }
    console.log('Using API Key for User:', keyDoc.userId);

    // To use it, we actually need the raw key, which we don't store (only hash).
    // So let's generate a temporary raw key for testing.
    const crypto = require('crypto');
    const randomHex = crypto.randomBytes(24).toString('hex');
    const rawKey = `fr_live_${randomHex}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    
    const testKey = await ApiKey.create({
      userId: keyDoc.userId,
      name: 'Temp Test Key',
      keyHash,
      keyPrefix: rawKey.substring(0, 14),
      status: 'Active'
    });

    console.log('Created temporary key:', rawKey);

    // 2. Send SMS using the API
    // Note: We use the production backend URL for the test to mimic the user
    console.log('Sending SMS via API...');
    const res = await axios.post(
      'https://fasreach-backend.onrender.com/api/sms/send',
      {
        to: '233540000000',
        from: 'FASREACH',
        message: 'Test API Delivery Report Visibility'
      },
      {
        headers: {
          'Authorization': `Bearer ${rawKey}`
        }
      }
    );

    console.log('SMS Send Response:', res.data);
    const msgId = res.data.id; // This should be the gatewayResponseId

    // 3. Check if it's in the DB
    const dbMsg = await Message.findOne({ gatewayResponseId: msgId });
    if (dbMsg) {
      console.log('SUCCESS: Message found in DB!', dbMsg.status);
    } else {
      console.log('ERROR: Message NOT found in DB!');
      // Let's check the most recently created message for this user just in case
      const latestMsg = await Message.findOne({ userId: keyDoc.userId }).sort({ createdAt: -1 });
      console.log('Latest message for user in DB:', latestMsg);
    }

    // Clean up
    await ApiKey.deleteOne({ _id: testKey._id });

  } catch (err) {
    console.error('Test Failed:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  } finally {
    await mongoose.disconnect();
  }
}

testApiSms();
