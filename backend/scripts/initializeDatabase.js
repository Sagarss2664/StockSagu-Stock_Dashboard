const mongoose = require('mongoose');
require('dotenv').config();
const StockHistory = require('../models/StockHistory');

async function initializeDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://01fe22bcs259:Sagar@cluster0.v0jo1.mongodb.net/Stock_dashboard';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB:', mongoose.connection.name);
    
    // Get database reference
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📊 Existing Collections:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    // Create StockHistory collection if it doesn't exist
    const collectionNames = collections.map(c => c.name);
    if (!collectionNames.includes('stockhistories')) {
      console.log('\n⚠️  stockhistories collection not found. Creating...');
      
      // Create collection by inserting and deleting a document
      const dummyDoc = new StockHistory({
        symbol: 'INIT',
        price: 0,
        timestamp: new Date()
      });
      await dummyDoc.save();
      console.log('✅ Created stockhistories collection');
      
      await StockHistory.deleteOne({ symbol: 'INIT' });
      console.log('✅ Cleared dummy document');
    }
    
    // Clear existing stock data
    console.log('\n🗑️  Clearing existing stock data...');
    await StockHistory.deleteMany({});
    console.log('✅ Cleared existing stock data');
    
    // Create 24 hours of sample data for each stock
    console.log('\n📊 Creating sample data...');
    const symbols = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];
    const basePrices = {
      'GOOG': 142.31,
      'TSLA': 238.45,
      'AMZN': 176.95,
      'META': 493.80,
      'NVDA': 686.04
    };
    
    let totalRecords = 0;
    
    for (const symbol of symbols) {
      const sampleData = [];
      const basePrice = basePrices[symbol];
      
      // Create data for last 24 hours (one record per hour)
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(Date.now() - (i * 60 * 60 * 1000));
        const trend = Math.sin(i / 5) * (basePrice * 0.02);
        const noise = (Math.random() - 0.5) * (basePrice * 0.01);
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
      totalRecords += sampleData.length;
      console.log(`✅ Created ${sampleData.length} records for ${symbol}`);
    }
    
    // Create TTL index for automatic cleanup (24 hours)
    console.log('\n📈 Creating TTL index...');
    try {
      await StockHistory.collection.createIndex(
        { timestamp: 1 },
        { 
          expireAfterSeconds: 24 * 60 * 60, // 24 hours
          name: 'timestamp_ttl'
        }
      );
      console.log('✅ Created TTL index (24-hour expiry)');
    } catch (indexError) {
      console.log('⚠️  Index creation warning:', indexError.message);
    }
    
    // Verify data was created
    console.log('\n📊 Verification:');
    console.log(`Total records: ${totalRecords}`);
    
    for (const symbol of symbols) {
      const count = await StockHistory.countDocuments({ symbol });
      const latest = await StockHistory.findOne({ symbol }).sort({ timestamp: -1 });
      console.log(`${symbol}: ${count} records, latest: $${latest?.price?.toFixed(2)}`);
    }
    
    // Test chart data retrieval
    console.log('\n🧪 Testing chart data retrieval...');
    const testSymbol = 'GOOG';
    const testData = await StockHistory.find({ symbol: testSymbol })
      .sort({ timestamp: 1 })
      .limit(5);
    
    console.log(`First 5 records for ${testSymbol}:`);
    testData.forEach((record, index) => {
      console.log(`  ${index + 1}. ${record.timestamp.toISOString()}: $${record.price.toFixed(2)}`);
    });
    
    console.log('\n✅ Database initialization complete!');
    console.log('\n🔗 API Endpoints:');
    console.log('  Health Check: http://localhost:5000/health');
    console.log('  Database Debug: http://localhost:5000/debug/db');
    console.log('  Chart Data: http://localhost:5000/api/charts/GOOG?timeframe=1h');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
}

initializeDatabase();