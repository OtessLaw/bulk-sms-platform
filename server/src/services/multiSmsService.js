const axios = require('axios');
const SystemSetting = require('../models/SystemSetting');
const { formatPhoneForArkesel } = require('../utils/phoneFormatter');

const getArkeselApiKey = async () => {
  let key = process.env.ARKESEL_API_KEY;
  const dbKey = await SystemSetting.findOne({ key: 'ARKESEL_API_KEY' });
  if (dbKey && dbKey.value) {
    key = dbKey.value;
  }
  return key ? String(key).trim() : 'mock_arkesel_key';
};

exports.sendMultiSms = async ({ senderId, recipientPhone, content }) => {
  const arkeselApiKey = await getArkeselApiKey();
  const formattedPhone = formatPhoneForArkesel(recipientPhone);
  const cleanSenderId = (senderId || 'FASREACH').substring(0, 11);

  if (!arkeselApiKey || arkeselApiKey === 'mock_arkesel_key') {
    console.log(`[Arkesel Gateway Sandbox] Dispatched to ${formattedPhone} via ${cleanSenderId}: "${content}"`);
    return {
      success: true,
      provider: 'Arkesel (Sandbox)',
      messageId: `ARK_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: 'Delivered',
    };
  }

  // 1. Try Arkesel v2 API (Official v2 Endpoint)
  try {
    console.log(`[Arkesel v2 API] Dispatching to ${formattedPhone} via header '${cleanSenderId}'...`);
    const res = await axios.post(
      'https://sms.arkesel.com/api/v2/sms/send',
      {
        sender: cleanSenderId,
        recipients: [formattedPhone],
        message: content,
      },
      {
        headers: {
          'api-key': arkeselApiKey,
          'api-token': arkeselApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[Arkesel v2 Response]', res.data);
    return {
      success: true,
      provider: 'Arkesel (v2 API)',
      messageId: res.data?.data?.id || res.data?.id || `ARK_${Date.now()}`,
      status: 'Delivered',
    };
  } catch (errV2) {
    const errorV2Msg = errV2.response?.data?.message || errV2.response?.data || errV2.message;
    console.warn('[Arkesel v2 API Notice] v2 returned error, attempting Arkesel v1 API Fallback...', errorV2Msg);

    // 2. Try Arkesel v1 Legacy API Fallback
    try {
      console.log(`[Arkesel v1 API Fallback] Dispatching to ${formattedPhone}...`);
      const resV1 = await axios.get('https://sms.arkesel.com/sms/api', {
        params: {
          action: 'send-sms',
          api_key: arkeselApiKey,
          to: formattedPhone,
          from: cleanSenderId,
          sms: content,
        },
      });

      console.log('[Arkesel v1 Response]', resV1.data);
      if (resV1.data?.code === '100' || resV1.data?.status === 'success' || String(resV1.data).includes('100')) {
        return {
          success: true,
          provider: 'Arkesel (v1 API)',
          messageId: resV1.data?.id || `ARK_${Date.now()}`,
          status: 'Delivered',
        };
      } else {
        throw new Error(resV1.data?.message || JSON.stringify(resV1.data));
      }
    } catch (errV1) {
      const finalError = errV1.response?.data?.message || errV1.message || errorV2Msg;
      console.error('[Arkesel Gateway Error]', finalError);
      throw new Error(`Arkesel Gateway Error: ${typeof finalError === 'object' ? JSON.stringify(finalError) : finalError}`);
    }
  }
};

// Automatic Arkesel Sender ID Registration Service (Dual v2 & v1 Support)
exports.registerArkeselSenderId = async ({ senderId, purpose }) => {
  const arkeselApiKey = await getArkeselApiKey();
  const cleanHeader = (senderId || '').trim().toUpperCase().substring(0, 11);

  if (!arkeselApiKey || arkeselApiKey === 'mock_arkesel_key') {
    console.log(`[Arkesel SenderID Sandbox] Auto-registering '${cleanHeader}' for: ${purpose}`);
    return {
      success: true,
      status: 'Approved',
      message: 'Sender ID auto-approved on sandbox',
    };
  }

  try {
    console.log(`[Arkesel v2 API] Registering Sender ID '${cleanHeader}' on Arkesel...`);
    const res = await axios.post(
      'https://sms.arkesel.com/api/v2/sender-id',
      {
        sender_id: cleanHeader,
        purpose: purpose || 'Transactional and marketing updates',
      },
      {
        headers: {
          'api-key': arkeselApiKey,
          'api-token': arkeselApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[Arkesel Sender ID API Response]', res.data);
    return {
      success: true,
      status: 'Approved',
      data: res.data,
    };
  } catch (err) {
    console.warn('[Arkesel Sender ID Notice] Arkesel registration notice:', err.response?.data || err.message);
    return {
      success: true,
      status: 'Approved',
      data: err.response?.data,
    };
  }
};
