const mongoose = require('mongoose');
require('dotenv').config();
const stockDataService = require('../services/stockDataService');

async function testChart() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://01fe22bcs259:Sagar@cluster0.v0jo1.mongodb.net/Stock_dashboard';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Test getting chart data
    const symbol = 'GOOG';
    console.log(`\n📊 Testing chart data for ${symbol}...`);
    
    const chartData = await stockDataService.getChartData(symbol, '1h');
    
    console.log('\n=== CHART DATA ===');
    console.log(`Data points: ${chartData.candles?.length || 0}`);
    console.log(`Is real data: ${chartData.metadata?.isRealData || false}`);
    
    if (chartData.candles && chartData.candles.length > 0) {
      console.log('First candle:', {
        time: new Date(chartData.candles[0].x).toISOString(),
        open: chartData.candles[0].o,
        high: chartData.candles[0].h,
        low: chartData.candles[0].l,
        close: chartData.candles[0].c,
        volume: chartData.candles[0].v
      });
      
      console.log('Last candle:', {
        time: new Date(chartData.candles[chartData.candles.length - 1].x).toISOString(),
        open: chartData.candles[chartData.candles.length - 1].o,
        high: chartData.candles[chartData.candles.length - 1].h,
        low: chartData.candles[chartData.candles.length - 1].l,
        close: chartData.candles[chartData.candles.length - 1].c,
        volume: chartData.candles[chartData.candles.length - 1].v
      });
    }
    
    console.log('\n=== SUMMARY ===');
    console.log('Open:', chartData.summary?.open);
    console.log('High:', chartData.summary?.high);
    console.log('Low:', chartData.summary?.low);
    console.log('Close:', chartData.summary?.close);
    console.log('Volume:', chartData.summary?.volume);
    
    console.log('\n=== INDICATORS ===');
    console.log('RSI:', chartData.indicators?.rsi?.toFixed(2));
    console.log('MACD:', chartData.indicators?.macd);
    console.log('SMA 20:', chartData.indicators?.movingAverages?.sma20?.toFixed(2));
    console.log('EMA 12:', chartData.indicators?.movingAverages?.ema12?.toFixed(2));
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test error:', error);
    process.exit(1);
  }
}

testChart();