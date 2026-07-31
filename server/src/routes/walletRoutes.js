const express = require('express');
const router = express.Router();
const { getWallet, initializeFunding, verifyFunding, buyCreditsFromBalance } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getWallet);
router.get('/balance', getWallet);
router.post('/fund', initializeFunding);
router.post('/verify', verifyFunding);
router.post('/buy-credits', buyCreditsFromBalance);

module.exports = router;
