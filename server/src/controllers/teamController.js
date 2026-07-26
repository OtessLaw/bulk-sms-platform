const TeamMember = require('../models/TeamMember');

// @desc    Get All Team Members for Organization
// @route   GET /api/team
exports.getTeamMembers = async (req, res, next) => {
  try {
    const members = await TeamMember.find({ organizationOwnerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite New Team Member
// @route   POST /api/team/invite
exports.inviteTeamMember = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Member name and email are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    let existing = await TeamMember.findOne({ organizationOwnerId: req.user._id, email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: `Team member '${cleanEmail}' is already added` });
    }

    const member = await TeamMember.create({
      organizationOwnerId: req.user._id,
      name,
      email: cleanEmail,
      role: role || 'Dispatcher',
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      message: `Team member '${name}' invited successfully with '${member.role}' permissions!`,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove/Revoke Team Member
// @route   DELETE /api/team/:id
exports.deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findOneAndDelete({ _id: req.params.id, organizationOwnerId: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    res.status(200).json({ success: true, message: `Team member '${member.name}' removed` });
  } catch (error) {
    next(error);
  }
};
