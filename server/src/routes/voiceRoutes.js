const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendVoiceCall, getVoiceCallHistory } = require('../controllers/voiceController');

const multer = require('multer');
const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } }); // 15MB limit for audio

router.post('/send', protect, upload.single('audioFile'), sendVoiceCall);
router.get('/history', protect, getVoiceCallHistory);

module.exports = router;
