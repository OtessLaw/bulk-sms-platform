require('dotenv').config();
const mongoose = require('mongoose');
const SystemSetting = require('./server/src/models/SystemSetting');
const { sendVoiceSmsCall } = require('./server/src/services/voiceService');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/fasreach');
  try {
    const res = await sendVoiceSmsCall({
      recipientPhone: '+233541234567',
      textPrompt: 'Testing voice',
      type: 'TTS',
      voiceLanguage: 'en-GH'
    });
    console.log('Result:', res);
  } catch(e) {
    console.log('Error:', e.message);
  }
  process.exit(0);
}

test();
