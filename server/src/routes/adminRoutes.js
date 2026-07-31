const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  impersonateUser,
  adjustUserWallet,
  resetUserPassword,
  deleteUser,
  toggleMaintenance,
  getAuditLogs,
  getGatewayKeys,
  saveGatewayKeys,
  resetDemoBalances,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getContactSettings,
  saveContactSettings,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

// Public / Authenticated route to read contact settings
router.get('/public-contact', getContactSettings);

// Admin-only routes
router.use(authorize('Super Admin', 'Admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.post('/impersonate/:id', impersonateUser);
router.post('/wallet/adjust', adjustUserWallet);
router.post('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUser);
router.post('/maintenance', toggleMaintenance);
router.get('/audit-logs', getAuditLogs);
router.get('/gateway-keys', getGatewayKeys);
router.post('/gateway-keys', saveGatewayKeys);
router.post('/reset-demo-balances', resetDemoBalances);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.get('/contact-settings', getContactSettings);
router.post('/contact-settings', saveContactSettings);

module.exports = router;
