require('dotenv').config();
const listEndpoints = require('express-list-endpoints');
const app = require('./src/app');
console.log(listEndpoints(app));
