const express = require('express');
const router = express.Router();
const { getApiKeys, generateApiKey, revokeApiKey } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/api-keys', getApiKeys);
router.post('/api-keys', generateApiKey);
router.delete('/api-keys/:id', revokeApiKey);

module.exports = router;
