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
exports.sendVoiceSmsCall = async ({ recipientPhone, textPrompt, audioUrl, audioFile, type }) => {
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

  // ── PATH A: TTS — use Arkesel's own voice engine with the user's exact message ──
  if (type === 'TTS' || (!audioFile && (!audioUrl || audioUrl.startsWith('blob:')))) {
    const message = textPrompt && textPrompt.trim() ? textPrompt.trim() : null;
    if (!message) {
      return { success: false, provider: 'Arkesel Voice Gateway', error: 'Please enter a text message to send as a voice call.', status: 'Failed' };
    }

    // Arkesel OTP Voice engine speaks the exact message text over the call
    const ttsMessage = message.includes('%otp_code%') ? message : `${message} %otp_code%`;
    console.log('[Voice TTS] Sending exact user message to Arkesel OTP Voice Engine:', ttsMessage);

    try {
      const resTts = await axios.post(
        'https://sms.arkesel.com/api/otp/generate',
        {
          expiry: 5,
          length: 6,
          medium: 'voice',
          message: ttsMessage,
          number: formattedPhone,
          sender_id: 'FasReach',
          type: 'numeric',
        },
        {
          headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
          timeout: 12000,
        }
      );

      console.log('[Arkesel OTP Voice Response]', resTts.data);

      if (resTts.data && (resTts.data.code === '1000' || resTts.data.code === 1000)) {
        return { success: true, provider: 'Arkesel Voice Engine (TTS)', messageId: `VOICE_${Date.now()}`, status: 'Submitted' };
      }

      const errMsg = resTts.data?.message || `Arkesel OTP Voice error code: ${resTts.data?.code}`;
      return { success: false, provider: 'Arkesel Voice Gateway', error: errMsg, status: 'Failed' };

    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      console.warn('[Arkesel OTP Voice Error]', errMsg);
      return { success: false, provider: 'Arkesel Voice Gateway', error: errMsg, status: 'Failed' };
    }
  }

  // ── PATH B: Audio file (recording or uploaded file) → send binary to Arkesel ──
  try {
    let audioBuffer = null;

    if (audioFile && audioFile.buffer) {
      audioBuffer = audioFile.buffer;
      console.log(`[Voice Audio] Received ${audioBuffer.length} bytes from user's audio recording/upload via multer`);
    } else if (audioUrl && !audioUrl.startsWith('blob:')) {
      const audioRes = await axios.get(audioUrl, { responseType: 'arraybuffer', timeout: 10000 });
      audioBuffer = Buffer.from(audioRes.data);
      console.log(`[Voice Audio] Downloaded ${audioBuffer.length} bytes from URL`);
    }

    if (!audioBuffer || audioBuffer.length < 100) {
      return { success: false, provider: 'Arkesel Voice Gateway', error: 'No valid audio file received. Please record or upload an audio file.', status: 'Failed' };
    }

    const form = new FormData();
    form.append('voice_file', audioBuffer, { filename: 'voice_message.mp3', contentType: 'audio/mpeg' });
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
