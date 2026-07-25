const express = require('express');
const router = express.Router();
const { getSubscriptions, subscribePlan, redeemCoupon } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSubscriptions);
router.post('/subscribe', subscribePlan);
router.post('/redeem-coupon', redeemCoupon);

module.exports = router;
