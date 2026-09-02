require('dotenv').config();
const mongoose = require('mongoose');

async function fixDatabaseIndexes() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('No MONGODB_URI found in .env');
      return;
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    const db = mongoose.connection.db;
    const collection = db.collection('apikeys'); // mongoose usually lowercase + plural
    
    console.log('Current indexes:');
    const indexes = await collection.indexes();
    console.log(indexes.map(i => i.name));

    // Try to drop the 'key_1' index if it exists
    const hasKeyIndex = indexes.some(i => i.name === 'key_1');
    if (hasKeyIndex) {
      console.log('Found legacy "key_1" index. Dropping it...');
      await collection.dropIndex('key_1');
      console.log('Successfully dropped legacy index!');
    } else {
      console.log('No legacy "key_1" index found. Try dropping any other duplicate index.');
    }
    
    // Also sync indexes using the model just in case
    const ApiKey = require('./src/models/ApiKey');
    await ApiKey.syncIndexes();
    console.log('Indexes synced to match current schema.');

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixDatabaseIndexes();
