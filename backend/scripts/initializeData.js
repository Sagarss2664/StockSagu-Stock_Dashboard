const mongoose = require('mongoose');
require('dotenv').config();
const StockHistory = require('../models/StockHistory');

async function initializeData() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://01fe22bcs259:Sagar@cluster0.v0jo1.mongodb.net/Stock_dashboard';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await StockHistory.deleteMany({});
    console.log('🗑️  Cleared existing StockHistory data');
    
    // Create 24 hours of sample data for each stock
    const symbols = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];
    const basePrices = {
      'GOOG': 142.31,
      'TSLA': 238.45,
      'AMZN': 176.95,
      'META': 493.80,
      'NVDA': 686.04
    };
    
    for (const symbol of symbols) {
      const sampleData = [];
      const basePrice = basePrices[symbol];
      
      // Create data for last 24 hours (one record per hour)
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(Date.now() - (i * 60 * 60 * 1000));
        const trend = Math.sin(i / 5) * 10;
        const noise = (Math.random() - 0.5) * 5;
        const price = basePrice + trend + noise;
        
        sampleData.push({
          symbol,
          price,
          high: price + Math.random() * 3,
          low: price - Math.random() * 3,
          open: price + (Math.random() - 0.5) * 2,
          close: price + (Math.random() - 0.5) * 2,
          volume: Math.floor(500000 + Math.random() * 1500000),
          timestamp
        });
      }
      
      await StockHistory.insertMany(sampleData);
      console.log(`✅ Created ${sampleData.length} records for ${symbol}`);
    }
    
    // Verify data was created
    const totalRecords = await StockHistory.countDocuments();
    console.log(`📊 Total records in database: ${totalRecords}`);
    
    // Show sample of each stock
    for (const symbol of symbols) {
      const count = await StockHistory.countDocuments({ symbol });
      const latest = await StockHistory.findOne({ symbol }).sort({ timestamp: -1 });
      console.log(`📈 ${symbol}: ${count} records, latest: $${latest?.price?.toFixed(2)}`);
    }
    
    console.log('✅ Data initialization complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
}

initializeData();