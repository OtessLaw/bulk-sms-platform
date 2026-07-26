const Message = require('../models/Message');
const { sendMultiSms } = require('../services/multiSmsService');

const processScheduledMessages = async () => {
  try {
    const now = new Date();
    const dueMessages = await Message.find({
      status: 'Scheduled',
      scheduledFor: { $lte: now },
    }).limit(50);

    if (dueMessages.length > 0) {
      console.log(`[SMS Scheduler Worker] Processing ${dueMessages.length} scheduled SMS dispatches...`);
      for (const msg of dueMessages) {
        try {
          const res = await sendMultiSms({
            senderId: msg.senderId,
            recipientPhone: msg.recipientPhone,
            content: msg.content,
          });

          msg.gatewayProvider = res.provider;
          msg.gatewayResponseId = res.messageId;
          msg.status = 'Delivered';
          await msg.save();
        } catch (err) {
          console.error(`[SMS Scheduler Error] Message ${msg._id} failed:`, err.message);
          msg.status = 'Failed';
          await msg.save();
        }
      }
    }
  } catch (err) {
    console.error('[SMS Scheduler Worker Error]', err.message);
  }
};

const initSmsScheduler = () => {
  // Run every 30 seconds
  setInterval(processScheduledMessages, 30000);
  console.log('⏰ [SMS Scheduler Service] Initialized (polling every 30 seconds)');
};

module.exports = initSmsScheduler;
