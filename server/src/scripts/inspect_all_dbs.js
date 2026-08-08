const mongoose = require('mongoose');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}

const NEW_URI = 'mongodb+srv://lawrenceadjei881_db_user:Law865907@cluster0.gpiu1od.mongodb.net/?retryWrites=true&w=majority';

async function inspectCluster() {
  console.log('--- INSPECTING CLUSTER0.GPIU1OD.MONGODB.NET ---');
  try {
    const conn = await mongoose.createConnection(NEW_URI, { serverSelectionTimeoutMS: 5000, family: 4 }).asPromise();
    const adminDb = conn.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('Available Databases in this Cluster:');
    
    for (let dbInfo of dbs.databases) {
      console.log(`\n📁 Database: "${dbInfo.name}" (Size: ${(dbInfo.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
      const targetDb = conn.useDb(dbInfo.name);
      const collections = await targetDb.db.listCollections().toArray();
      for (let col of collections) {
        const count = await targetDb.collection(col.name).countDocuments();
        console.log(`   └─ Collection "${col.name}": ${count} documents`);
        if (col.name === 'users') {
          const users = await targetDb.collection('users').find({}).toArray();
          users.forEach(u => console.log(`      👤 User: ${u.name} | ${u.email} | ${u.phone} | Role: ${u.role}`));
        }
      }
    }

    await conn.close();
  } catch (err) {
    console.error('Inspection Error:', err.message);
  }
}

inspectCluster();
