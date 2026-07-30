const mongoose = require('mongoose');

const AiConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: 'Support Conversation',
    },
    currentPage: {
      type: String,
      default: '/dashboard',
    },
    supportMode: {
      type: String,
      enum: ['AI', 'HUMAN'],
      default: 'AI',
    },
    status: {
      type: String,
      enum: ['Active', 'Escalated', 'Resolved', 'Closed'],
      default: 'Active',
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },
    satisfactionRating: {
      type: Number,
      default: null,
    },
    resolutionHelpful: {
      type: Boolean,
      default: null,
    },
    messagesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiConversation', AiConversationSchema);
