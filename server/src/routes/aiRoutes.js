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
const { protect, authorize } = require('../middleware/auth');

// User AI Support Routes
router.post('/chat', protect, processChat);
router.post('/analyze-image', protect, analyzeImage);
router.get('/conversations', protect, getConversations);
router.post('/feedback', protect, submitFeedback);

// Super Admin AI Knowledge & Analytics Management Routes
router.get('/admin/analytics', protect, authorize('Super Admin', 'Admin'), getAdminAnalytics);
router.get('/admin/knowledge', protect, authorize('Super Admin', 'Admin'), getKnowledgeDocs);
router.post('/admin/knowledge', protect, authorize('Super Admin', 'Admin'), createKnowledgeDoc);
router.delete('/admin/knowledge/:id', protect, authorize('Super Admin', 'Admin'), deleteKnowledgeDoc);

module.exports = router;
