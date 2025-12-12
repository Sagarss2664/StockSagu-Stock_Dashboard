const mongoose = require('mongoose');
require('dotenv').config();
const StockHistory = require('../models/StockHistory');

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB for initialization');
    
    // Create TTL index for StockHistory
    await StockHistory.collection.createIndex(
      { timestamp: 1 },
      { expireAfterSeconds: 86400 },
      { background: true }
    );
    
    console.log('TTL index created for StockHistory');
    
    // Create sample historical data for testing
    const symbols = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];
    
    for (const symbol of symbols) {
      // Check if we have any data for this symbol
      const count = await StockHistory.countDocuments({ symbol });
      
      if (count === 0) {
        console.log(`Creating sample data for ${symbol}...`);
        
        const sampleData = [];
        const basePrice = symbol === 'GOOG' ? 100 : 
                         symbol === 'TSLA' ? 200 :
                         symbol === 'AMZN' ? 150 :
                         symbol === 'META' ? 300 : 400;
        
        // Create 24 hours of sample data
        for (let i = 0; i < 24; i++) {
          const timestamp = new Date(Date.now() - (i * 60 * 60 * 1000));
          const variation = (Math.random() - 0.5) * 10;
          const price = basePrice + variation;
          
          sampleData.push({
            symbol,
            price,
            high: price + Math.random() * 5,
            low: price - Math.random() * 5,
            open: price + (Math.random() - 0.5) * 2,
            close: price + (Math.random() - 0.5) * 2,
            volume: Math.floor(Math.random() * 1000000),
            timestamp
          });
        }
        
        await StockHistory.insertMany(sampleData);
        console.log(`Created ${sampleData.length} sample records for ${symbol}`);
      } else {
        console.log(`${symbol} already has ${count} historical records`);
      }
    }
    
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

initDatabase();