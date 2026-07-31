const express = require('express');
const router = express.Router();
const { getSenderIds, requestSenderId, approveSenderId, rejectSenderId, syncSenderIdStatuses } = require('../controllers/senderIdController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.get('/', getSenderIds);
router.post('/request', requestSenderId);
router.post('/sync', syncSenderIdStatuses);

// Admin-only approval endpoints
router.put('/:id/approve', authorize('Super Admin', 'Admin'), approveSenderId);
router.put('/:id/reject', authorize('Super Admin', 'Admin'), rejectSenderId);

module.exports = router;
