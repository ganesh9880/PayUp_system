const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      emailOrWhatsapp: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user.name);
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
  }
}

testLogin(); 