const mongoose = require('mongoose');

const KnowledgeDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'General',
        'Send SMS',
        'Sender ID',
        'Wallet & Payments',
        'Contacts & Groups',
        'Reports & Delivery',
        'Developer API',
        'Troubleshooting',
        'Super Admin',
      ],
      default: 'General',
    },
    content: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['FAQ', 'Markdown', 'Text', 'PDF', 'Doc', 'System'],
      default: 'FAQ',
    },
    keywords: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    targetPage: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KnowledgeDocument', KnowledgeDocumentSchema);
