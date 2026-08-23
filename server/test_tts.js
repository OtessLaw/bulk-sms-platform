const axios = require('axios');

async function testTts() {
  const languages = ['en', 'fr', 'tw', 'en-NG', 'ak'];
  for (const lang of languages) {
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=hello&tl=${lang}`;
      await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(`${lang}: SUCCESS`);
    } catch (e) {
      console.log(`${lang}: FAILED - ${e.response ? e.response.status : e.message}`);
    }
  }
}

testTts();
