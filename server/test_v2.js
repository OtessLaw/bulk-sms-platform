require('dotenv').config();
const mongoose = require('mongoose');
const SystemSetting = require('./src/models/SystemSetting');
const axios = require('axios');

async function testV2() {
  await mongoose.connect(process.env.MONGODB_URI);
  let key = process.env.ARKESEL_API_KEY;
  const dbKey = await SystemSetting.findOne({ key: 'ARKESEL_API_KEY' });
  if (dbKey && dbKey.value && dbKey.value.trim().length > 0) {
    key = dbKey.value.trim();
  }
  
  try {
    const res = await axios.post(
      'https://sms.arkesel.com/api/v2/sms/send',
      {
        sender: 'FASREACH',
        recipients: ['233540000000'],
        message: 'Test message for response format',
      },
      {
        headers: {
          'api-key': key,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
  mongoose.disconnect();
}

testV2();
