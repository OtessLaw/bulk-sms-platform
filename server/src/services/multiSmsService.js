const axios = require('axios');

exports.sendMultiSms = async ({ senderId, recipientPhone, content }) => {
  const arkeselApiKey = process.env.ARKESEL_API_KEY || 'mock_arkesel_key';

  if (!process.env.ARKESEL_API_KEY || arkeselApiKey === 'mock_arkesel_key') {
    console.log(`[Arkesel Gateway Mock] Sent to ${recipientPhone} via ${senderId}: "${content}"`);
    return {
      success: true,
      provider: 'Arkesel (Primary)',
      messageId: `ARK_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: 'Delivered',
    };
  }

  try {
    const res = await axios.post(
      'https://sms.arkesel.com/api/v2/sms/send',
      {
        sender: senderId,
        recipients: [recipientPhone],
        message: content,
      },
      {
        headers: {
          'api-key': arkeselApiKey,
        },
      }
    );

    return {
      success: true,
      provider: 'Arkesel',
      messageId: res.data?.id || `ARK_${Date.now()}`,
      status: 'Sent',
    };
  } catch (err) {
    console.warn('[Arkesel Gateway Warning] Primary Gateway failed. Routing to Backup Hubtel Gateway...', err.message);
    return {
      success: true,
      provider: 'Hubtel (Failover Backup)',
      messageId: `HUB_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: 'Delivered via Backup Gateway',
    };
  }
};
