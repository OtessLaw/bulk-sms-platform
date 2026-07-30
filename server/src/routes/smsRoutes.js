const express = require('express');
const router = express.Router();
const { sendSMS, sendBulkSMS, getAiTemplates } = require('../controllers/smsController');
const { protect } = require('../middleware/authMiddleware');

// Optional protect helper so guest visitors & logged-in users can generate AI templates
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

// Open AI Template Generator route
router.post('/ai-templates', optionalProtect, getAiTemplates);

// Protected Dispatch Routes
router.use(protect);
router.post('/send', sendSMS);
router.post('/bulk', sendBulkSMS);

module.exports = router;
