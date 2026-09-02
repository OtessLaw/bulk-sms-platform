const axios = require('axios');

async function checkApiKeyGen() {
  try {
    // We don't have a password. Let's just create a token for a user using the JWT secret.
    const jwt = require('jsonwebtoken');
    const mongoose = require('mongoose');
    // Just fetch the first user directly from DB? Wait, I can't connect to DB.
    // But I have the JWT_SECRET from .env!
    // And I can guess a user ID? No, I need a valid mongo ID.
    // If I can't connect to Mongo, I can't get a user ID.
    console.log('Need user ID');
  } catch (e) {
    console.log(e);
  }
}
checkApiKeyGen();
