const axios = require('axios');

async function testBackend() {
  try {
    // You need a valid auth token for the user.
    // Or I can just check what the actual frontend request is returning by mocking a login.
    // Wait, let's login first.
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com', // Need a real email, wait, I don't know it.
      password: 'password123'
    });
    console.log(loginRes.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}
testBackend();
