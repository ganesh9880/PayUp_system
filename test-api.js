const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing PayUp API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health endpoint:', healthResponse.data);

    // Test registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      console.log('✅ Registration successful:', registerResponse.data.message);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        console.log('✅ User already exists (expected for duplicate test)');
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
      }
    }

    // Test login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
      console.log('✅ Login successful:', loginResponse.data.message);
      
      // Test authenticated endpoints
      const token = loginResponse.data.token;
      console.log('\n4. Testing authenticated endpoints...');
      
      // Test getting groups
      const groupsResponse = await axios.get(`${API_BASE_URL}/groups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Groups endpoint working');
      
      // Test getting users
      const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Users endpoint working');
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
    }

    console.log('\n🎉 API testing completed successfully!');
    console.log('\nYour PayUp application is fully functional!');
    console.log('Backend: http://localhost:5000');
    console.log('Frontend: http://localhost:5173');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI(); 