const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('=======================================================');
    console.log(`🚀 BULK SMS SAAS BACKEND RUNNING ON PORT: ${PORT}`);
    console.log(`🌟 MODE: ${process.env.NODE_ENV || 'development'}`);
    console.log('=======================================================');
  });
});
