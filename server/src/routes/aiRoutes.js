const express = require('express');
const router = express.Router();
const {
  processChat,
  analyzeImage,
  getConversations,
  submitFeedback,
  getAdminAnalytics,
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

// User AI Support Routes (Public & Authenticated)
router.post('/chat', optionalProtect, processChat);
router.post('/analyze-image', optionalProtect, analyzeImage);
router.get('/conversations', protect, getConversations);
router.post('/feedback', protect, submitFeedback);

// Super Admin AI Knowledge & Analytics Management Routes
router.get('/admin/analytics', protect, authorize('Super Admin', 'Admin'), getAdminAnalytics);
router.get('/admin/knowledge', protect, authorize('Super Admin', 'Admin'), getKnowledgeDocs);
router.post('/admin/knowledge', protect, authorize('Super Admin', 'Admin'), createKnowledgeDoc);
router.delete('/admin/knowledge/:id', protect, authorize('Super Admin', 'Admin'), deleteKnowledgeDoc);

module.exports = router;
