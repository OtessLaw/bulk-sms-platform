require('dotenv').config();
const axios = require('axios');

async function testArkeselNativeTTS() {
  try {
    const apiKey = process.env.ARKESEL_API_KEY;
    if (!apiKey) throw new Error('No API key in .env');

    console.log('Using Key:', apiKey.substring(0, 5));

    const res = await axios.post(
      'https://sms.arkesel.com/api/v2/sms/voice/send',
      {
        message: 'Hello, this is a native TTS test',
        recipients: ['+233541234567'],
        language: 'en'
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
}

testArkeselNativeTTS();
