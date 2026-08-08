const mongoose = require('mongoose');

const OLD_URI = 'mongodb+srv://otesslaw:6431940989aA@cluster0.p7xpt.mongodb.net/fasreach_sms?retryWrites=true&w=majority';
const NEW_URI = 'mongodb+srv://lawrenceadjei881_db_user:Law865907@cluster0.gpiu1od.mongodb.net/fasreach_sms?retryWrites=true&w=majority';

async function checkDatabases() {
  console.log('--- CHECKING OLD DATABASE CLUSTER (cluster0.p7xpt.mongodb.net) ---');
  try {
    const connOld = await mongoose.createConnection(OLD_URI, { serverSelectionTimeoutMS: 5000, family: 4 }).asPromise();
    console.log('Connected to OLD Cluster!');
    const usersOld = await connOld.collection('users').find({}).toArray();
    console.log(`Found ${usersOld.length} users in OLD database:`);
    usersOld.forEach(u => console.log(` - ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Phone: ${u.phone}, Role: ${u.role}`));
    await connOld.close();
  } catch (err) {
    console.error('OLD Database Notice:', err.message);
  }

  console.log('\n--- CHECKING NEW DATABASE CLUSTER (cluster0.gpiu1od.mongodb.net) ---');
  try {
    const connNew = await mongoose.createConnection(NEW_URI, { serverSelectionTimeoutMS: 5000, family: 4 }).asPromise();
    console.log('Connected to NEW Cluster!');
    const usersNew = await connNew.collection('users').find({}).toArray();
    console.log(`Found ${usersNew.length} users in NEW database:`);
    usersNew.forEach(u => console.log(` - ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Phone: ${u.phone}, Role: ${u.role}`));
    await connNew.close();
  } catch (err) {
    console.error('NEW Database Notice:', err.message);
  }
}

checkDatabases();
