const axios = require('axios');

async function testEndpoint() {
  try {
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    
    // Register
    console.log('Registering user...');
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: email,
      password: 'Password123!',
      phone: `054${Math.floor(1000000 + Math.random() * 9000000)}`,
      companyName: 'Test Inc'
    });
    
    const token = regRes.data.token;
    console.log('Registered successfully. Token:', token.substring(0, 10) + '...');
    
    // Generate API Key
    console.log('Generating API Key...');
    const apiRes = await axios.post('http://localhost:5000/api/settings/api-keys', {
      name: 'Integration Test'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('API Key generated:', apiRes.data);
    
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Error Message:', error.message);
  }
}

testEndpoint();
