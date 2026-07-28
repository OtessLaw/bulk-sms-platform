const axios = require('axios');

async function testPollinations() {
  try {
    const prompt = "What is quantum physics and how do I write a good SMS message for a hair salon?";
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?system=${encodeURIComponent("You are Nova, an intelligent AI Assistant like ChatGPT.")}`;
    
    const res = await axios.get(url, { timeout: 10000 });
    console.log("SUCCESS Free LLM Output:\n", res.data);
  } catch(e) {
    console.log("Error:", e.message);
  }
}

testPollinations();
