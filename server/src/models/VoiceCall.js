const mongoose = require('mongoose');

const VoiceCallSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientPhone: { type: String, required: true },
    type: { type: String, enum: ['TTS', 'Recording', 'Upload'], default: 'TTS' },
    textPrompt: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    voiceGender: { type: String, default: 'Female' },
    voiceLanguage: { type: String, default: 'en-GH' },
    durationSeconds: { type: Number, default: 30 },
    costGHS: { type: Number, default: 0.08 },
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Answered', 'No Answer', 'Busy', 'Failed'],
      default: 'Submitted',
    },
    gatewayResponseId: { type: String, default: '' },
    gatewayProvider: { type: String, default: 'FasReach Voice Gateway' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VoiceCall', VoiceCallSchema);
