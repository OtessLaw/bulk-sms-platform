const axios = require('axios');
const SystemSetting = require('../models/SystemSetting');

const getPaystackSecretKey = async () => {
  const dbKey = await SystemSetting.findOne({ key: 'PAYSTACK_SECRET_KEY' });
  if (dbKey && dbKey.value) {
    return dbKey.value;
  }
  return process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_paystack_secret_key';
};

exports.initializePayment = async ({ email, amount, reference, callbackUrl, metadata }) => {
  const PAYSTACK_SECRET = await getPaystackSecretKey();

  if (!PAYSTACK_SECRET || PAYSTACK_SECRET.startsWith('sk_test_mock')) {
    console.log(`[Paystack Mock] Initializing payment ref: ${reference} for ${amount} GHS`);
    return {
      status: true,
      data: {
        authorization_url: `${callbackUrl}?reference=${reference}&status=success`,
        access_code: `mock_code_${Date.now()}`,
        reference,
      },
    };
  }

  try {
    const res = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: Math.round(amount * 100),
        reference,
        callback_url: callbackUrl,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Paystack initialization failed');
  }
};

exports.verifyPayment = async (reference) => {
  const PAYSTACK_SECRET = await getPaystackSecretKey();

  if (!PAYSTACK_SECRET || PAYSTACK_SECRET.startsWith('sk_test_mock')) {
    console.log(`[Paystack Mock] Verifying payment ref: ${reference}`);
    return {
      status: true,
      data: {
        status: 'success',
        reference,
        amount: 1000,
      },
    };
  }

  try {
    const res = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Paystack verification failed');
  }
};
