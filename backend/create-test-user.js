const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/payup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('✅ Test user already exists:', existingUser.email);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      whatsapp: '+1234567890',
      password: hashedPassword
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('📱 WhatsApp: +1234567890');
    console.log('🔑 Password: password123');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createTestUser(); 