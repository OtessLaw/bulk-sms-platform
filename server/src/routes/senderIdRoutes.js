const express = require('express');
const router = express.Router();
const { getSenderIds, requestSenderId } = require('../controllers/senderIdController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSenderIds);
router.post('/request', requestSenderId);

module.exports = router;
