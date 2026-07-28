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
    status: {
      type: String,
      enum: ['Active', 'Escalated', 'Resolved', 'Closed'],
      default: 'Active',
    },
    satisfactionRating: {
      type: Number, // 1 to 5 stars
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
