const axios = require('axios');

async function testTranslation() {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t&q=hello+there`;
    const res = await axios.get(url);
    console.log(res.data[0][0][0]); // Should print translation
  } catch (e) {
    console.log('Error:', e.message);
  }
}

testTranslation();
