const express = require('express');
const router = express.Router();
const { getReports, arkeselWebhook } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Public Webhook Endpoint for Arkesel Delivery Receipts
router.post('/webhook/arkesel', arkeselWebhook);

// Protected Reports Routes
router.use(protect);
router.get('/', getReports);

module.exports = router;
