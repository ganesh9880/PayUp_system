const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/payup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Check if we can connect
    await mongoose.connection.asPromise();
    console.log('✅ Database connected successfully');
    
    // Check if there are any users
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    if (userCount > 0) {
      const users = await User.find({}, { password: 0 });
      console.log('👥 Users found:', users);
    } else {
      console.log('❌ No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testDatabase(); 