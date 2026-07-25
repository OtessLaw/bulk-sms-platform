const express = require('express');
const router = express.Router();
const { getWallet, initializeFunding, verifyFunding } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getWallet);
router.post('/fund', initializeFunding);
router.post('/verify', verifyFunding);

module.exports = router;
