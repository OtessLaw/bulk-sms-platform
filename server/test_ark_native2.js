require('dotenv').config();
const mongoose = require('mongoose');
const SystemSetting = require('./src/models/SystemSetting');
const ProviderConfig = require('./src/models/ProviderConfig');
const axios = require('axios');

async function testArkeselNativeTTS() {
  await mongoose.connect('mongodb://localhost:27017/fasreach');
  try {
    let apiKey = process.env.ARKESEL_API_KEY;
    const sysKey = await SystemSetting.findOne({ key: 'ARKESEL_API_KEY' });
    if (sysKey && sysKey.value) apiKey = sysKey.value;
    else {
      const activeConfig = await ProviderConfig.findOne({ providerName: 'Arkesel' });
      if (activeConfig) apiKey = activeConfig.apiKey;
    }

    console.log('Using Key:', apiKey ? apiKey.substring(0, 10) : 'NONE');

    const res = await axios.post(
      'https://sms.arkesel.com/api/v2/sms/voice/send',
      {
        message: 'Hello, this is a native TTS test',
        recipients: ['+233541234567'],
        language: 'tw'
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('SUCCESS:', res.data);
  } catch (e) {
    console.log('ERROR:', e.response ? e.response.data : e.message);
  }
  await mongoose.disconnect();
}

testArkeselNativeTTS();
