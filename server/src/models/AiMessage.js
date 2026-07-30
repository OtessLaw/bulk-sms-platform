const mongoose = require('mongoose');

const AiMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: String,
      enum: ['user', 'assistant', 'system', 'human_admin'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    pageContext: {
      type: String,
      default: '',
    },
    actionButtons: [
      {
        label: String,
        route: String,
        actionType: String,
      },
    ],
    tutorialSteps: [
      {
        stepNumber: Number,
        title: String,
        description: String,
        targetElement: String,
      },
    ],
    imageUrl: {
      type: String,
      default: null,
    },
    confidenceScore: {
      type: Number,
      default: 0.95,
    },
    escalatedToHuman: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiMessage', AiMessageSchema);
