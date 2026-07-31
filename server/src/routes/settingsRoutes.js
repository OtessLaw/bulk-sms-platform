const express = require('express');
const router = express.Router();
const { getApiKeys, generateApiKey, revokeApiKey } = require('../controllers/settingsController');
const { getContactSettings } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Open endpoint for public landing page & guest support info
router.get('/contact', getContactSettings);

// Protected user routes
router.use(protect);
router.get('/api-keys', getApiKeys);
router.post('/api-keys', generateApiKey);
router.delete('/api-keys/:id', revokeApiKey);

module.exports = router;
