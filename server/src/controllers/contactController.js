const Contact = require('../models/Contact');
const Group = require('../models/Group');

// @desc    Get All Contacts and Groups
// @route   GET /api/contacts
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const groups = await Group.find({ userId: req.user._id }).sort({ name: 1 });
    res.status(200).json({ success: true, data: { contacts, groups } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Single Contact
// @route   POST /api/contacts
exports.createContact = async (req, res, next) => {
  try {
    const { name, phone, email, groupName } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required' });
    }

    const contact = await Contact.create({
      userId: req.user._id,
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      groupName: (groupName || 'General').trim(),
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk Import Contacts (Excel/CSV payload)
// @route   POST /api/contacts/bulk
exports.createBulkContacts = async (req, res, next) => {
  try {
    const { contacts, defaultGroup } = req.body;
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid array of contacts' });
    }

    const docs = contacts.map((c) => ({
      userId: req.user._id,
      name: (c.name || 'Unnamed Contact').trim(),
      phone: (c.phone || c.mobile || '').trim(),
      email: (c.email || '').trim(),
      groupName: (c.groupName || c.group || defaultGroup || 'General').trim(),
    })).filter((c) => c.phone.length >= 7);

    if (docs.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid contacts with phone numbers found in file' });
    }

    const inserted = await Contact.insertMany(docs);

    // Auto-create any new group names in the group collection
    const uniqueGroups = [...new Set(docs.map((d) => d.groupName))];
    for (const grp of uniqueGroups) {
      if (grp && grp !== 'General') {
        await Group.findOneAndUpdate(
          { userId: req.user._id, name: grp },
          { userId: req.user._id, name: grp },
          { upsert: true, new: true }
        );
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} contacts!`,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Contact
// @route   DELETE /api/contacts/:id
exports.deleteContact = async (req, res, next) => {
  try {
    await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Custom Group
// @route   POST /api/contacts/groups
exports.createGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Group name is required' });
    }

    const cleanName = name.trim();
    const existing = await Group.findOne({ userId: req.user._id, name: cleanName });
    if (existing) {
      return res.status(400).json({ success: false, message: `Group '${cleanName}' already exists` });
    }

    const group = await Group.create({
      userId: req.user._id,
      name: cleanName,
      description: (description || '').trim(),
    });

    res.status(201).json({ success: true, message: `Group '${cleanName}' created successfully!`, data: group });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Group
// @route   DELETE /api/contacts/groups/:id
exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (group) {
      // Re-assign contacts in deleted group to General
      await Contact.updateMany({ userId: req.user._id, groupName: group.name }, { groupName: 'General' });
    }
    res.status(200).json({ success: true, message: 'Group deleted successfully' });
  } catch (error) {
    next(error);
  }
};
