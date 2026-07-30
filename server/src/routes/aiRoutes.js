const express = require('express');
const router = express.Router();
const {
  processChat,
  escalateToHuman,
  getConversationMessages,
  analyzeImage,
  getConversations,
  submitFeedback,
  getAdminAnalytics,
  getAllUserChatLogs,
  adminReplyToUser,
  getLiveSupportChats,
  toggleSupportMode,
  getKnowledgeDocs,
  createKnowledgeDoc,
  deleteKnowledgeDoc,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

// Optional protect middleware helper for public/guest chat support
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

// User AI & Live Support Routes
router.post('/chat', optionalProtect, processChat);
router.post('/escalate', protect, escalateToHuman);
router.get('/messages/:conversationId', protect, getConversationMessages);
router.post('/analyze-image', optionalProtect, analyzeImage);
router.get('/conversations', protect, getConversations);
router.post('/feedback', protect, submitFeedback);

// Super Admin AI & Live Human Chat Management Routes
router.get('/admin/analytics', protect, authorize('Super Admin', 'Admin'), getAdminAnalytics);
router.get('/admin/user-logs', protect, authorize('Super Admin', 'Admin'), getAllUserChatLogs);
router.get('/admin/live-chats', protect, authorize('Super Admin', 'Admin'), getLiveSupportChats);
router.post('/admin/reply', protect, authorize('Super Admin', 'Admin'), adminReplyToUser);
router.post('/admin/toggle-mode', protect, authorize('Super Admin', 'Admin'), toggleSupportMode);

// Super Admin RAG Knowledge Base Routes
router.get('/admin/knowledge', protect, authorize('Super Admin', 'Admin'), getKnowledgeDocs);
router.post('/admin/knowledge', protect, authorize('Super Admin', 'Admin'), createKnowledgeDoc);
router.delete('/admin/knowledge/:id', protect, authorize('Super Admin', 'Admin'), deleteKnowledgeDoc);

module.exports = router;
