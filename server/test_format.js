require('dotenv').config();
const axios = require('axios');

async function testArkeselFormat() {
  const key = process.env.ARKESEL_API_KEY;
  try {
    const res = await axios.post(
      'https://sms.arkesel.com/api/v2/sms/send',
      {
        sender: 'FASREACH',
        recipients: ['233540000000'],
        message: 'Format test',
      },
      {
        headers: {
          'api-key': key,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(JSON.stringify(res.data, null, 2));
    
    // How multiSmsService extracts it:
    const msgId = res.data?.data?.id || res.data?.id || `GW_${Date.now()}`;
    console.log('Extracted msgId:', msgId);

  } catch (err) {
    console.error(err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
}
testArkeselFormat();
