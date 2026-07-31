const ApiKey = require('../models/ApiKey');

exports.getApiKeys = async (req, res, next) => {
  try {
    const keys = await ApiKey.find({ userId: req.user._id, status: 'Active' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: keys });
  } catch (error) {
    next(error);
  }
};

exports.generateApiKey = async (req, res, next) => {
  try {
    const { name } = req.body;
    const keyString = `bms_live_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;

    const apiKey = await ApiKey.create({
      userId: req.user._id,
      name: name || 'Live API Key',
      key: keyString,
      status: 'Active',
    });

    res.status(201).json({ success: true, message: 'Developer API Key generated!', data: apiKey });
  } catch (error) {
    next(error);
  }
};

exports.revokeApiKey = async (req, res, next) => {
  try {
    const { id } = req.params;
    const apiKey = await ApiKey.findOne({ _id: id, userId: req.user._id });

    if (!apiKey) {
      return res.status(404).json({ success: false, message: 'API key not found' });
    }

    apiKey.status = 'Revoked';
    await apiKey.save();

    res.status(200).json({ success: true, message: 'API Key revoked successfully' });
  } catch (error) {
    next(error);
  }
};
