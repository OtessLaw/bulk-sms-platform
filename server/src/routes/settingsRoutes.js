const express = require('express');
const router = express.Router();
const { getApiKeys, generateApiKey } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/api-keys', getApiKeys);
router.post('/api-keys', generateApiKey);

module.exports = router;
