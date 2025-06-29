const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/payup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function testPassword() {
  try {
    console.log('Testing password...');
    
    // Get the user from database
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('🔐 Stored password hash:', user.password);
    
    // Test password comparison
    const testPassword = 'password123';
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    console.log('🔑 Testing password:', testPassword);
    console.log('✅ Password match:', isMatch);
    
    // Test with wrong password
    const wrongPassword = 'wrongpassword';
    const isWrongMatch = await bcrypt.compare(wrongPassword, user.password);
    console.log('❌ Wrong password match:', isWrongMatch);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testPassword(); 