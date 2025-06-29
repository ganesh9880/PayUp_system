const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/payup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function testLoginController() {
  try {
    console.log('Testing login controller logic...');
    
    const emailOrWhatsapp = 'test@example.com';
    const password = 'password123';
    
    console.log('🔍 Searching for user with:', emailOrWhatsapp);
    
    // Find user by email or whatsapp (exact logic from controller)
    const user = await User.findOne({ 
      $or: [
        { email: emailOrWhatsapp }, 
        { whatsapp: emailOrWhatsapp }
      ] 
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('📱 WhatsApp:', user.whatsapp);
    
    // Compare password (exact logic from controller)
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
      return;
    }
    
    console.log('✅ Password matches!');
    console.log('🎉 Login would be successful');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testLoginController(); 