const express = require('express');
const router = express.Router();
const { sendSMS, sendBulkSMS, getAiTemplates } = require('../controllers/smsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/send', sendSMS);
router.post('/bulk', sendBulkSMS);
router.post('/ai-templates', getAiTemplates);

module.exports = router;
