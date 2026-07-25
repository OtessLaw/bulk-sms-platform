const Contact = require('../models/Contact');
const Group = require('../models/Group');

exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const groups = await Group.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: { contacts, groups } });
  } catch (error) {
    next(error);
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const { name, phone, email, groupName } = req.body;
    const contact = await Contact.create({
      userId: req.user._id,
      name,
      phone,
      email,
      groupName: groupName || 'General',
    });
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};
