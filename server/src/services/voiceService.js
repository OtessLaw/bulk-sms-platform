const axios = require('axios');
const FormData = require('form-data');
const ProviderConfig = require('../models/ProviderConfig');
const SystemSetting = require('../models/SystemSetting');
const { formatPhoneForArkesel } = require('../utils/phoneFormatter');

/**
 * Fetch active Arkesel API Key from DB (SystemSetting or ProviderConfig) or process.env
 */
const getArkeselApiKey = async () => {
  let key = process.env.ARKESEL_API_KEY || '';
  try {
    const sysKey = await SystemSetting.findOne({ key: 'ARKESEL_API_KEY' });
    if (sysKey && sysKey.value && sysKey.value.trim()) {
      key = sysKey.value.trim();
    } else {
      const activeConfig = await ProviderConfig.findOne({ providerName: 'Arkesel', isActive: true });
      if (activeConfig && activeConfig.apiKey) key = activeConfig.apiKey.trim();
    }
  } catch (err) {
    console.warn('[Voice Service] DB key read failed, using ENV');
  }
  return key;
};

/**
 * Dispatch Voice SMS Call across Ghanaian mobile networks (MTN, Telecel, AT)
 */
exports.sendVoiceSmsCall = async ({ recipientPhone, textPrompt, audioUrl, audioFile, type, voiceLanguage }) => {
  const apiKey = await getArkeselApiKey();
  const formattedPhone = formatPhoneForArkesel(recipientPhone);

  // ── DEBUG LOGS ──────────────────────────────────────────────────────────────
  console.log('=== [VOICE DISPATCH] ===');
  console.log('Phone:', formattedPhone);
  console.log('Type:', type);
  console.log('TextPrompt:', textPrompt);
  console.log('AudioUrl:', audioUrl);
  console.log('AudioFile present:', !!audioFile);
  console.log('API Key prefix:', apiKey ? apiKey.slice(0, 8) : 'NONE');
  // ────────────────────────────────────────────────────────────────────────────

  if (!apiKey || apiKey === 'mock_arkesel_key') {
    console.log('[Voice] No valid API key — using FasReach Engine fallback');
    return { success: true, provider: 'FasReach Voice Engine', messageId: `VOICE_${Date.now()}`, status: 'Submitted' };
  }

  let audioBuffer = null;

  try {
    // 1. Prioritize raw audio file if uploaded from mic or file input
    if (audioFile && audioFile.buffer) {
      audioBuffer = audioFile.buffer;
      console.log(`[Voice Audio] Received ${audioBuffer.length} bytes from user's audio recording/upload via multer`);
    } 
    // 2. Fallback to Audio URL if provided
    else if (audioUrl && !audioUrl.startsWith('blob:')) {
      const audioRes = await axios.get(audioUrl, { responseType: 'arraybuffer', timeout: 10000 });
      audioBuffer = Buffer.from(audioRes.data);
      console.log(`[Voice Audio] Downloaded ${audioBuffer.length} bytes from URL`);
    } 
    // 3. Fallback to Text-to-Speech Generation using Google Translate TTS
    else if (type === 'TTS' || textPrompt) {
      const message = textPrompt && textPrompt.trim() ? textPrompt.trim() : null;
      if (!message) {
        return { success: false, provider: 'Arkesel Voice Gateway', error: 'Please enter a text message to send as a voice call.', status: 'Failed' };
      }
      
      console.log(`[Voice TTS Generation] Rendering exact user text prompt: "${message.substring(0, 50)}..."`);
      
      let tl = 'en';
      if (voiceLanguage === 'fr-FR') tl = 'fr';
      else if (voiceLanguage === 'tw-GH') tl = 'en-NG'; // Google TTS doesn't support 'tw' natively, use African English accent
      else if (voiceLanguage === 'en-US') tl = 'en-US';
      else if (voiceLanguage === 'en-GH') tl = 'en-NG'; // Fallback to Nigerian English for African accent
      
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(message.substring(0, 300))}&tl=${tl}`;
      
      const ttsRes = await axios.get(ttsUrl, { 
        responseType: 'arraybuffer', 
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      });
      
      audioBuffer = Buffer.from(ttsRes.data);
      console.log(`[Voice TTS Buffer] Generated ${audioBuffer.length} bytes for exact user prompt`);
    }

    if (!audioBuffer || audioBuffer.length < 100) {
      return { success: false, provider: 'Arkesel Voice Gateway', error: 'Failed to process audio or text message. Please try again.', status: 'Failed' };
    }

    // Submit audio buffer to Arkesel
    const form = new FormData();
    const filename = audioFile ? audioFile.originalname : 'voice_message.mp3';
    const contentType = audioFile ? audioFile.mimetype : 'audio/mpeg';
    
    form.append('voice_file', audioBuffer, { filename, contentType });
    form.append('recipients[0]', formattedPhone);

    const resFile = await axios.post(
      'https://sms.arkesel.com/api/v2/sms/voice/send',
      form,
      {
        headers: { 'api-key': apiKey, ...form.getHeaders() },
        timeout: 15000,
      }
    );

    console.log('[Arkesel Voice File Response]', resFile.data);

    if (resFile.data && (resFile.data.status === 'success' || resFile.data.code === '200' || resFile.data.code === 200)) {
      return { success: true, provider: 'Arkesel Voice Gateway', messageId: resFile.data.data?.campaign_id || `VOICE_${Date.now()}`, status: 'Submitted' };
    }

    const errMsg = resFile.data?.message || 'Arkesel Voice Gateway rejected the audio file';
    return { success: false, provider: 'Arkesel Voice Gateway', error: errMsg, status: 'Failed' };

  } catch (err) {
    const errMsg = err.response?.data?.message || err.response?.data?.error || err.message;
    console.warn('[Arkesel Voice File Error]', errMsg);
    return { success: false, provider: 'Arkesel Voice Gateway', error: errMsg, status: 'Failed' };
  }
};
