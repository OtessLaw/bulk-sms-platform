const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema(
  {
    organizationOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ['Manager', 'Dispatcher', 'Viewer'], default: 'Dispatcher' },
    status: { type: String, enum: ['Active', 'Pending'], default: 'Active' },
  },
  { timestamps: true }
);

TeamMemberSchema.index({ organizationOwnerId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
