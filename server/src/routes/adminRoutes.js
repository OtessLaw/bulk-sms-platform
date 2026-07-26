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
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);
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

module.exports = router;
