const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');
const mongoose = require('mongoose');

exports.getApiKeys = async (req, res, next) => {
  try {
    const keys = await ApiKey.find({ userId: req.user._id, status: 'Active' }).sort({ createdAt: -1 });
    const formattedKeys = keys.map(k => ({
      _id: k._id,
      name: k.name,
      keyPrefix: k.keyPrefix || (k.key ? k.key.substring(0, 14) + '...' : 'fr_live_***'),
      status: k.status,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
    }));
    res.status(200).json({ success: true, data: formattedKeys });
  } catch (error) {
    next(error);
  }
};

exports.generateApiKey = async (req, res, next) => {
  try {
    const { name } = req.body;
    const randomHex = crypto.randomBytes(24).toString('hex');
    const rawKey = `fr_live_${randomHex}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = `${rawKey.substring(0, 14)}...`;

    // Drop legacy index if it exists to prevent Duplicate field value entered (code 11000)
    try {
      await mongoose.connection.db.collection('apikeys').dropIndex('key_1');
    } catch (e) {
      // Ignore if index doesn't exist
    }

    const apiKeyDoc = await ApiKey.create({
      userId: req.user._id,
      name: name || 'Live API Key',
      keyHash,
      keyPrefix,
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Developer API Key generated successfully! Save this key now as it will not be shown again.',
      data: {
        _id: apiKeyDoc._id,
        name: apiKeyDoc.name,
        rawKey, // Shown once on creation only
        keyPrefix,
        status: apiKeyDoc.status,
        createdAt: apiKeyDoc.createdAt,
      },
    });
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
