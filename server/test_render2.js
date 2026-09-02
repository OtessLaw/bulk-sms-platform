const axios = require('axios');

async function testRenderBackend() {
  try {
    const res = await axios.post('https://fasreach-backend.onrender.com/api/auth/register', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'Password123!',
      phone: `054${Math.floor(1000000 + Math.random() * 9000000)}`,
      companyName: 'Test Inc'
    });
    
    let token = res.data.token || res.data.data?.token;
    
    console.log('Generating key 1...');
    const apiRes = await axios.post('https://fasreach-backend.onrender.com/api/settings/api-keys', {
      name: 'Integration Test 1'
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Key 1:', apiRes.data.success);
    
    console.log('Generating key 2...');
    const apiRes2 = await axios.post('https://fasreach-backend.onrender.com/api/settings/api-keys', {
      name: 'Integration Test 2'
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Key 2:', apiRes2.data.success);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}
testRenderBackend();
