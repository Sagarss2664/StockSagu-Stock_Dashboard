const mongoose = require('mongoose');
require('dotenv').config();

async function clearDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get collections
    const StockHistory = require('../models/StockHistory');
    const User = require('../models/User');
    const Subscription = require('../models/Subscription');
    
    // Clear collections
    await StockHistory.deleteMany({});
    await User.deleteMany({});
    await Subscription.deleteMany({});
    
    console.log('✅ All collections cleared');
    
    // Create a test user
    const testUser = await User.create({
      email: 'test@example.com'
    });
    
    console.log('✅ Test user created:', testUser.email);
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();