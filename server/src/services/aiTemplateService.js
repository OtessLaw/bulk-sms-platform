const axios = require('axios');

exports.generateTemplates = async ({ category, keywords } = {}) => {
  try {
    let kw = 'Special Offer';
    if (Array.isArray(keywords) && keywords.length > 0 && keywords[0]) {
      kw = String(keywords[0]).trim();
    } else if (typeof keywords === 'string' && keywords.trim()) {
      kw = keywords.trim();
    }

    const cat = category || 'Marketing';

    // 1. Try Google Gemini LLM API if key is set
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiApiKey) {
      try {
        const promptText = `Generate 3 distinct, creative, high-converting SMS broadcast messages for category '${cat}' about topic: '${kw}'. Keep each message under 150 characters. Return JSON array of strings like: ["msg1", "msg2", "msg3"]`;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

        const aiRes = await axios.post(
          apiUrl,
          {
            contents: [{ role: 'user', parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 600 },
          },
          { timeout: 5000 }
        );

        const text = aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const matches = text.match(/"([^"\\]*(\\.[^"\\]*)*)"/g);
          if (matches && matches.length >= 2) {
            return matches.slice(0, 4).map((m, idx) => ({
              id: idx + 1,
              content: m.replace(/^"|"$/g, '').replace(/\\"/g, '"').trim(),
            }));
          }
        }
      } catch (e) {
        console.warn('[AI Template Gen Notice]:', e.message);
      }
    }

    // 2. High-diversity fallback templates (randomized variation to prevent repetitive static messages)
    const templateVariations = [
      `🔥 Exclusive Deal: Upgrade your ${kw} experience today! Get up to 35% off. Order now at fasreach.com or reply YES to confirm.`,
      `🎉 Special Announcement for ${kw}! Limited slots available. Claim your exclusive discount now before offer expires tonight!`,
      `⭐ Hi there! Don't miss out on our ${kw} special. Tap here or reply INFO to learn more and claim your bonus!`,
      `🚀 Boost your results with ${kw}! Fast, reliable, and tailored for you. Contact support today or visit us to get started.`,
      `📢 Reminder: Your special offer for ${kw} is waiting! Reply CLAIM to activate your discount code now.`,
    ];

    const shuffled = [...templateVariations].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((text, idx) => ({
      id: idx + 1,
      content: text,
    }));
  } catch (err) {
    console.error('[AI Template Gen Catch]:', err);
    return [
      { id: 1, content: `🔥 Exclusive Special: Special offer on ${keywords || 'our service'}! Contact us today to claim.` },
      { id: 2, content: `🎉 Announcement: Check out our latest update regarding ${keywords || 'our service'}!` },
    ];
  }
};
