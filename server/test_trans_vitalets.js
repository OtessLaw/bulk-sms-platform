const { translate } = require('@vitalets/google-translate-api');

async function testTranslation() {
  try {
    const res = await translate('Hello there, how are you?', { to: 'tw' });
    console.log('Twi:', res.text);
    
    const res2 = await translate('Hello there, how are you?', { to: 'fr' });
    console.log('French:', res2.text);
  } catch (e) {
    console.log('Error:', e.message);
  }
}

testTranslation();
