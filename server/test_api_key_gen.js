require('dotenv').config();
const mongoose = require('mongoose');
const ApiKey = require('./src/models/ApiKey');
const crypto = require('crypto');
const User = require('./src/models/User');

async function testApiKeyGen() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fasreach';
    await mongoose.connect(mongoUri);
    
    // Get first user
    const user = await User.findOne();
    if (!user) {
      console.log('No user found in DB:', mongoUri);
      return;
    }

    console.log('Creating key for user:', user._id);
    
    const randomHex = crypto.randomBytes(24).toString('hex');
    const rawKey = `fr_live_${randomHex}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = `${rawKey.substring(0, 14)}...`;

    const apiKeyDoc = await ApiKey.create({
      userId: user._id,
      name: 'Test Key',
      keyHash,
      keyPrefix,
      status: 'Active',
    });

    console.log('Success:', apiKeyDoc);
  } catch (error) {
    console.error('Error creating ApiKey:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testApiKeyGen();
