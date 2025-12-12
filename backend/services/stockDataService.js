const StockHistory = require('../models/StockHistory');

class StockDataService {
  constructor() {
    console.log('StockDataService initialized');
  }

  // Store stock data in history
  async storeStockHistory(symbol, stockData) {
    try {
      console.log(`📊 Storing stock history for ${symbol}: $${stockData.price}`);
      
      const historyDoc = new StockHistory({
        symbol: symbol.toUpperCase(),
        price: stockData.price || 0,
        high: stockData.high || stockData.price || 0,
        low: stockData.low || stockData.price || 0,
        open: stockData.open || stockData.price || 0,
        close: stockData.close || stockData.price || 0,
        volume: stockData.volume || Math.floor(Math.random() * 1000000),
        timestamp: new Date()
      });

      await historyDoc.save();
      console.log(`✅ Stored history for ${symbol}`);
      return historyDoc;
    } catch (error) {
      console.error('❌ Error storing stock history:', error.message);
      return null;
    }
  }

  // Get all historical data for a symbol
  async getStockHistory(symbol, hours = 24) {
    try {
      const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
      
      const history = await StockHistory.find({
        symbol: symbol.toUpperCase(),
        timestamp: { $gte: cutoffTime }
      })
      .sort({ timestamp: 1 })
      .limit(1000); // Limit to 1000 records
      
      console.log(`📊 Found ${history.length} records for ${symbol} (last ${hours} hours)`);
      return history;
    } catch (error) {
      console.error('❌ Error getting stock history:', error.message);
      return [];
    }
  }

  // Get aggregated data for charts
  async getChartData(symbol, timeframe = '1h') {
    try {
      console.log(`📈 Getting chart data for ${symbol}, timeframe: ${timeframe}`);
      
      // Calculate time range
      let hours = 24;
      switch(timeframe) {
        case '1m': hours = 2; break;
        case '5m': hours = 6; break;
        case '15m': hours = 12; break;
        case '30m': hours = 24; break;
        case '1h': hours = 48; break;
        case '4h': hours = 96; break;
        case '1d': hours = 30 * 24; break;
        case '24h': hours = 7 * 24; break;
      }
      
      const history = await this.getStockHistory(symbol, hours);
      
      if (history.length === 0) {
        console.log(`⚠️ No data found for ${symbol}, generating sample data`);
        return this.generateSampleData(symbol, hours);
      }
      
      // Process data for chart
      const chartData = this.processChartData(history, timeframe);
      const summary = this.calculateSummary(history);
      const indicators = this.calculateIndicators(history);
      
      return {
        candles: chartData,
        summary,
        indicators,
        metadata: {
          symbol: symbol.toUpperCase(),
          timeframe,
          dataPoints: chartData.length,
          isRealData: true
        }
      };
      
    } catch (error) {
      console.error('❌ Error in getChartData:', error.message);
      return this.generateSampleData(symbol, 24);
    }
  }

  // Process raw data for chart display
  processChartData(history, timeframe) {
    const interval = this.getIntervalMs(timeframe);
    const groupedData = [];
    
    history.forEach(record => {
      const timestamp = new Date(record.timestamp);
      const roundedTime = new Date(Math.floor(timestamp.getTime() / interval) * interval);
      
      let group = groupedData.find(g => g.timestamp.getTime() === roundedTime.getTime());
      
      if (!group) {
        group = {
          timestamp: roundedTime,
          open: record.open || record.price,
          high: record.high || record.price,
          low: record.low || record.price,
          close: record.close || record.price,
          volume: record.volume || 0,
          price: record.price
        };
        groupedData.push(group);
      } else {
        group.high = Math.max(group.high, record.high || record.price);
        group.low = Math.min(group.low, record.low || record.price);
        group.close = record.close || record.price;
        group.volume += record.volume || 0;
      }
    });
    
    return groupedData
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(item => ({
        x: item.timestamp.getTime(),
        o: item.open,
        h: item.high,
        l: item.low,
        c: item.close,
        v: item.volume
      }));
  }

  // Calculate summary statistics
  calculateSummary(history) {
    if (history.length === 0) {
      return {
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0,
        avgVolume: 0
      };
    }
    
    const prices = history.map(h => h.close || h.price);
    const volumes = history.map(h => h.volume || 0);
    
    return {
      open: history[0].open || history[0].price,
      high: Math.max(...prices),
      low: Math.min(...prices),
      close: history[history.length - 1].close || history[history.length - 1].price,
      volume: volumes.reduce((a, b) => a + b, 0),
      avgVolume: Math.round(volumes.reduce((a, b) => a + b, 0) / volumes.length)
    };
  }

  // Calculate technical indicators
  calculateIndicators(history) {
    if (history.length < 14) {
      return {
        rsi: 50,
        macd: { macd: 0, signal: 0, histogram: 0 },
        movingAverages: { sma20: 0, sma50: 0, ema12: 0, ema26: 0 },
        bollingerBands: { upper: 0, middle: 0, lower: 0 }
      };
    }
    
    const prices = history.map(h => h.close || h.price);
    
    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      movingAverages: {
        sma20: this.calculateSMA(prices, 20),
        sma50: this.calculateSMA(prices, 50),
        ema12: this.calculateEMA(prices, 12),
        ema26: this.calculateEMA(prices, 26)
      },
      bollingerBands: this.calculateBollingerBands(prices)
    };
  }

  // Helper methods for indicators
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i-1];
      if (change >= 0) gains += change;
      else losses += Math.abs(change);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateMACD(prices) {
    if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0 };
    
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    const signal = this.calculateEMA(prices.slice(-9), 9);
    
    return { macd, signal, histogram: macd - signal };
  }

  calculateSMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    const slice = prices.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  }

  calculateEMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    const multiplier = 2 / (period + 1);
    let ema = this.calculateSMA(prices.slice(0, period), period);
    
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }
    
    return ema;
  }

  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    if (prices.length < period) return { upper: 0, middle: 0, lower: 0 };
    
    const recent = prices.slice(-period);
    const sma = this.calculateSMA(recent, period);
    const variance = recent.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const std = Math.sqrt(variance);
    
    return {
      upper: sma + (std * stdDev),
      middle: sma,
      lower: sma - (std * stdDev)
    };
  }

  getIntervalMs(timeframe) {
    const intervals = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '24h': 60 * 60 * 1000
    };
    return intervals[timeframe] || 60 * 60 * 1000;
  }

  // Generate sample data for when no real data exists
  generateSampleData(symbol, hours) {
    console.log(`📊 Generating sample data for ${symbol} (${hours} hours)`);
    
    const basePrices = {
      'GOOG': 142.31,
      'TSLA': 238.45,
      'AMZN': 176.95,
      'META': 493.80,
      'NVDA': 686.04
    };
    
    const basePrice = basePrices[symbol?.toUpperCase()] || 100;
    const dataPoints = Math.min(50, hours * 2);
    const candles = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = new Date(Date.now() - (dataPoints - i - 1) * 60 * 60 * 1000);
      const trend = Math.sin(i / 10) * 10;
      const noise = (Math.random() - 0.5) * 5;
      const price = basePrice + trend + noise;
      
      candles.push({
        x: timestamp.getTime(),
        o: price + (Math.random() - 0.5) * 2,
        h: price + Math.random() * 3,
        l: price - Math.random() * 3,
        c: price + (Math.random() - 0.5) * 2,
        v: Math.floor(500000 + Math.random() * 1500000)
      });
    }
    
    const prices = candles.map(c => c.c);
    
    return {
      candles,
      summary: {
        open: candles[0].o,
        high: Math.max(...candles.map(c => c.h)),
        low: Math.min(...candles.map(c => c.l)),
        close: candles[candles.length - 1].c,
        volume: candles.reduce((sum, c) => sum + c.v, 0)
      },
      indicators: {
        rsi: this.calculateRSI(prices),
        macd: this.calculateMACD(prices),
        movingAverages: {
          sma20: this.calculateSMA(prices, 20),
          sma50: this.calculateSMA(prices, 50),
          ema12: this.calculateEMA(prices, 12),
          ema26: this.calculateEMA(prices, 26)
        },
        bollingerBands: this.calculateBollingerBands(prices)
      },
      metadata: {
        symbol: symbol?.toUpperCase(),
        timeframe: '1h',
        dataPoints: candles.length,
        isRealData: false,
        isSample: true
      }
    };
  }
}

module.exports = new StockDataService();