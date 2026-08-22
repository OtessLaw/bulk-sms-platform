const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendVoiceCall, getVoiceCallHistory } = require('../controllers/voiceController');

router.post('/send', protect, sendVoiceCall);
router.get('/history', protect, getVoiceCallHistory);

module.exports = router;
