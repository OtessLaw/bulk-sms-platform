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
    
    // Actually the response might be { success: true, message: ..., data: { token, user } }
    let token = res.data.token;
    if (!token && res.data.data) token = res.data.data.token;
    
    console.log('Token is:', token ? token.substring(0,20) : 'undefined');
    
    const apiRes = await axios.post('https://fasreach-backend.onrender.com/api/settings/api-keys', {
      name: 'Integration Test'
    }, { headers: { Authorization: `Bearer ${token}` } });
    
    console.log('Key generated:', apiRes.data);
  } catch (error) {
    console.error('Error on Render:', error.response ? error.response.status : error.message);
    if(error.response) {
       console.error(error.response.data);
    }
  }
}
testRenderBackend();
