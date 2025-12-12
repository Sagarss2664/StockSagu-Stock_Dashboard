// const StockHistory = require('../models/StockHistory');

// class ChartService {
//   constructor() {
//     console.log('Advanced ChartService initialized');
//   }

//   // Store comprehensive stock data
//   async storeStockData(symbol, stockData) {
//     try {
//       console.log(`📊 Storing comprehensive data for ${symbol}`);
      
//       const historyDoc = new StockHistory({
//         symbol: symbol.toUpperCase(),
//         price: stockData.price || 0,
//         high: stockData.high || stockData.price || 0,
//         low: stockData.low || stockData.price || 0,
//         open: stockData.open || stockData.price || 0,
//         close: stockData.close || stockData.price || 0,
//         volume: stockData.volume || Math.floor(Math.random() * 1000000),
//         marketCap: stockData.marketCap,
//         peRatio: stockData.peRatio,
//         dividendYield: stockData.dividendYield,
//         timestamp: new Date()
//       });

//       await historyDoc.save();
//       return historyDoc;
//     } catch (error) {
//       console.error('Error storing stock history:', error.message);
//       return null;
//     }
//   }

//   // Get comprehensive chart data for all chart types
//   async getChartData(symbol, timeframe = '1h', chartType = 'candlestick') {
//     try {
//       console.log(`Getting ${chartType} chart for ${symbol}, timeframe: ${timeframe}`);
      
//       // Calculate time range
//       const hours = this.getHoursFromTimeframe(timeframe);
//       const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
      
//       // Get historical data
//       const history = await StockHistory.find({
//         symbol: symbol.toUpperCase(),
//         timestamp: { $gte: cutoffTime }
//       })
//       .sort({ timestamp: 1 })
//       .limit(this.getDataLimit(timeframe));
      
//       console.log(`Found ${history.length} records for ${symbol}`);
      
//       if (history.length > 0) {
//         const processedData = this.processDataForChartType(history, chartType, timeframe);
//         const summary = this.calculateSummary(history);
//         const technicalIndicators = this.calculateTechnicalIndicators(history);
        
//         return {
//           chartData: processedData,
//           summary,
//           technicalIndicators,
//           metadata: {
//             dataPoints: history.length,
//             timeframe,
//             chartType,
//             symbol: symbol.toUpperCase()
//           }
//         };
//       } else {
//         console.log(`Generating comprehensive sample data for ${symbol}`);
//         return this.generateComprehensiveSampleData(symbol, timeframe, chartType);
//       }
      
//     } catch (error) {
//       console.error('Error in getChartData:', error.message);
//       return this.generateComprehensiveSampleData(symbol, timeframe, chartType);
//     }
//   }

//   // Get data for specific chart types
//   async getChartDataByType(symbol, chartType, timeframe = '1h') {
//     const fullData = await this.getChartData(symbol, timeframe, chartType);
    
//     // Format data specifically for the requested chart type
//     switch(chartType) {
//       case 'candlestick':
//         return this.formatCandlestickData(fullData);
//       case 'line':
//         return this.formatLineData(fullData);
//       case 'area':
//         return this.formatAreaData(fullData);
//       case 'volume':
//         return this.formatVolumeData(fullData);
//       case 'rsi':
//         return this.formatRSIData(fullData);
//       case 'macd':
//         return this.formatMACDData(fullData);
//       case 'bollinger':
//         return this.formatBollingerData(fullData);
//       case 'heatmap':
//         return this.formatHeatmapData(fullData);
//       default:
//         return fullData;
//     }
//   }

//   // Helper methods
//   getHoursFromTimeframe(timeframe) {
//     const timeframeMap = {
//       '1m': 0.5,   // 30 minutes
//       '5m': 2,     // 2 hours
//       '15m': 6,    // 6 hours
//       '30m': 12,   // 12 hours
//       '1h': 24,    // 24 hours
//       '4h': 96,    // 4 days
//       '1d': 30,    // 30 days
//       '1w': 180,   // 180 days
//       '1M': 365,   // 1 year
//       '24h': 24 * 7 // 7 days
//     };
//     return timeframeMap[timeframe] || 24;
//   }

//   getDataLimit(timeframe) {
//     const limitMap = {
//       '1m': 30,   // 30 points
//       '5m': 50,   // 50 points
//       '15m': 80,  // 80 points
//       '30m': 100,
//       '1h': 150,
//       '4h': 200,
//       '1d': 250,
//       '1w': 300,
//       '1M': 365,
//       '24h': 168  // 7 days * 24 hours
//     };
//     return limitMap[timeframe] || 100;
//   }

//   processDataForChartType(history, chartType, timeframe) {
//     // Group data based on timeframe
//     const groupedData = this.groupData(history, timeframe);
    
//     switch(chartType) {
//       case 'candlestick':
//         return groupedData.map(item => ({
//           x: item.timestamp,
//           o: item.open,
//           h: item.high,
//           l: item.low,
//           c: item.close,
//           v: item.volume
//         }));
        
//       case 'line':
//       case 'area':
//         return groupedData.map(item => ({
//           x: item.timestamp,
//           y: item.close
//         }));
        
//       case 'volume':
//         return groupedData.map(item => ({
//           x: item.timestamp,
//           y: item.volume,
//           price: item.close
//         }));
        
//       default:
//         return groupedData;
//     }
//   }

//   groupData(history, timeframe) {
//     const interval = this.getIntervalMilliseconds(timeframe);
//     const grouped = [];
    
//     history.forEach(record => {
//       const timestamp = new Date(record.timestamp);
//       const roundedTime = new Date(Math.floor(timestamp.getTime() / interval) * interval);
      
//       let group = grouped.find(g => g.timestamp.getTime() === roundedTime.getTime());
      
//       if (!group) {
//         group = {
//           timestamp: roundedTime,
//           open: record.open || record.price,
//           high: record.high || record.price,
//           low: record.low || record.price,
//           close: record.close || record.price,
//           volume: record.volume || 0,
//           price: record.price
//         };
//         grouped.push(group);
//       } else {
//         group.high = Math.max(group.high, record.high || record.price);
//         group.low = Math.min(group.low, record.low || record.price);
//         group.close = record.close || record.price;
//         group.volume += record.volume || 0;
//       }
//     });
    
//     return grouped.sort((a, b) => a.timestamp - b.timestamp);
//   }

//   getIntervalMilliseconds(timeframe) {
//     const intervalMap = {
//       '1m': 60 * 1000,        // 1 minute
//       '5m': 5 * 60 * 1000,    // 5 minutes
//       '15m': 15 * 60 * 1000,  // 15 minutes
//       '30m': 30 * 60 * 1000,  // 30 minutes
//       '1h': 60 * 60 * 1000,   // 1 hour
//       '4h': 4 * 60 * 60 * 1000, // 4 hours
//       '1d': 24 * 60 * 60 * 1000, // 1 day
//       '1w': 7 * 24 * 60 * 60 * 1000, // 1 week
//       '1M': 30 * 24 * 60 * 60 * 1000, // 1 month
//       '24h': 60 * 60 * 1000   // 1 hour intervals for 24h
//     };
//     return intervalMap[timeframe] || 60 * 60 * 1000;
//   }

//   calculateSummary(history) {
//     if (history.length === 0) return {};
    
//     const prices = history.map(h => h.close || h.price);
//     const volumes = history.map(h => h.volume || 0);
    
//     return {
//       open: history[0].open || history[0].price,
//       close: history[history.length - 1].close || history[history.length - 1].price,
//       high: Math.max(...prices),
//       low: Math.min(...prices),
//       volume: volumes.reduce((a, b) => a + b, 0),
//       avgVolume: Math.round(volumes.reduce((a, b) => a + b, 0) / volumes.length),
//       volatility: this.calculateVolatility(prices),
//       vwap: this.calculateVWAP(history)
//     };
//   }

//   calculateTechnicalIndicators(history) {
//     const prices = history.map(h => h.close || h.price);
//     const volumes = history.map(h => h.volume || 0);
    
//     return {
//       rsi: this.calculateRSI(prices),
//       macd: this.calculateMACD(prices),
//       bollingerBands: this.calculateBollingerBands(prices),
//       movingAverages: {
//         sma20: this.calculateSMA(prices, 20),
//         sma50: this.calculateSMA(prices, 50),
//         sma200: this.calculateSMA(prices, 200),
//         ema12: this.calculateEMA(prices, 12),
//         ema26: this.calculateEMA(prices, 26)
//       },
//       support: this.calculateSupportResistance(prices),
//       resistance: this.calculateSupportResistance(prices, false)
//     };
//   }

//   // Technical indicator calculations
//   calculateVolatility(prices) {
//     if (prices.length < 2) return 0;
//     const returns = [];
//     for (let i = 1; i < prices.length; i++) {
//       returns.push((prices[i] - prices[i-1]) / prices[i-1]);
//     }
//     const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
//     const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
//     return Math.sqrt(variance) * Math.sqrt(252); // Annualized
//   }

//   calculateVWAP(history) {
//     let totalPV = 0;
//     let totalVolume = 0;
    
//     history.forEach(h => {
//       const price = (h.high + h.low + h.close) / 3;
//       totalPV += price * (h.volume || 0);
//       totalVolume += h.volume || 0;
//     });
    
//     return totalVolume > 0 ? totalPV / totalVolume : 0;
//   }

//   calculateRSI(prices, period = 14) {
//     if (prices.length < period + 1) return 50;
    
//     let gains = 0;
//     let losses = 0;
    
//     for (let i = 1; i <= period; i++) {
//       const change = prices[i] - prices[i-1];
//       if (change >= 0) {
//         gains += change;
//       } else {
//         losses += Math.abs(change);
//       }
//     }
    
//     const avgGain = gains / period;
//     const avgLoss = losses / period;
    
//     if (avgLoss === 0) return 100;
//     const rs = avgGain / avgLoss;
//     return 100 - (100 / (1 + rs));
//   }

//   calculateMACD(prices) {
//     if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0 };
    
//     const ema12 = this.calculateEMA(prices, 12);
//     const ema26 = this.calculateEMA(prices, 26);
//     const macd = ema12 - ema26;
//     const signal = this.calculateEMA(prices.slice(-9), 9); // Signal line (EMA of MACD)
    
//     return {
//       macd,
//       signal,
//       histogram: macd - signal
//     };
//   }

//   calculateBollingerBands(prices, period = 20, stdDev = 2) {
//     if (prices.length < period) return { upper: 0, middle: 0, lower: 0 };
    
//     const recentPrices = prices.slice(-period);
//     const sma = this.calculateSMA(recentPrices, period);
//     const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
//     const std = Math.sqrt(variance);
    
//     return {
//       upper: sma + (std * stdDev),
//       middle: sma,
//       lower: sma - (std * stdDev)
//     };
//   }

//   calculateSMA(prices, period) {
//     if (prices.length < period) return prices[prices.length - 1] || 0;
//     const slice = prices.slice(-period);
//     return slice.reduce((a, b) => a + b, 0) / period;
//   }

//   calculateEMA(prices, period) {
//     if (prices.length < period) return prices[prices.length - 1] || 0;
    
//     const multiplier = 2 / (period + 1);
//     let ema = this.calculateSMA(prices.slice(0, period), period);
    
//     for (let i = period; i < prices.length; i++) {
//       ema = (prices[i] - ema) * multiplier + ema;
//     }
    
//     return ema;
//   }

//   calculateSupportResistance(prices, isSupport = true) {
//     if (prices.length < 20) return prices[prices.length - 1] || 0;
    
//     // Simple pivot point calculation
//     const recent = prices.slice(-20);
//     const high = Math.max(...recent);
//     const low = Math.min(...recent);
//     const close = recent[recent.length - 1];
    
//     const pivot = (high + low + close) / 3;
    
//     return isSupport ? (2 * pivot) - high : (2 * pivot) - low;
//   }

//   // Format data for specific chart types
//   formatCandlestickData(data) {
//     return {
//       candles: data.chartData,
//       summary: data.summary,
//       indicators: data.technicalIndicators
//     };
//   }

//   formatLineData(data) {
//     return {
//       lineData: data.chartData,
//       movingAverages: data.technicalIndicators.movingAverages,
//       summary: data.summary
//     };
//   }

//   // Generate comprehensive sample data
//   generateComprehensiveSampleData(symbol, timeframe, chartType) {
//     console.log(`Generating comprehensive ${chartType} sample for ${symbol}`);
    
//     const basePrices = {
//       'GOOG': { price: 142.31, volatility: 0.02 },
//       'TSLA': { price: 238.45, volatility: 0.035 },
//       'AMZN': { price: 176.95, volatility: 0.018 },
//       'META': { price: 493.80, volatility: 0.025 },
//       'NVDA': { price: 686.04, volatility: 0.04 }
//     };
    
//     const stock = basePrices[symbol?.toUpperCase()] || { price: 100, volatility: 0.02 };
//     const hours = this.getHoursFromTimeframe(timeframe);
//     const dataPoints = this.getDataLimit(timeframe);
    
//     const data = [];
//     let currentPrice = stock.price;
    
//     for (let i = 0; i < dataPoints; i++) {
//       const timeOffset = (dataPoints - i - 1) * this.getIntervalMilliseconds(timeframe);
//       const timestamp = new Date(Date.now() - timeOffset);
      
//       // Realistic price movement with trend and noise
//       const trend = Math.sin(i / (dataPoints / 10)) * stock.price * 0.1;
//       const noise = (Math.random() - 0.5) * stock.price * stock.volatility * 2;
//       const drift = (i * stock.price * 0.0001); // Slight upward drift
      
//       currentPrice = stock.price + trend + noise + drift;
//       const volatility = Math.abs(noise) * 2;
      
//       const open = currentPrice + (Math.random() - 0.5) * volatility;
//       const close = currentPrice + (Math.random() - 0.5) * volatility;
//       const high = Math.max(open, close) + Math.random() * volatility;
//       const low = Math.min(open, close) - Math.random() * volatility;
//       const volume = Math.floor(500000 + Math.random() * 1500000 + i * 10000);
      
//       data.push({
//         timestamp,
//         open,
//         high,
//         low,
//         close,
//         volume,
//         price: currentPrice
//       });
//     }
    
//     const summary = this.calculateSummary(data);
//     const indicators = this.calculateTechnicalIndicators(data);
    
//     return {
//       chartData: this.processDataForChartType(data, chartType, timeframe),
//       summary,
//       technicalIndicators: indicators,
//       metadata: {
//         dataPoints: data.length,
//         timeframe,
//         chartType,
//         symbol: symbol?.toUpperCase(),
//         isSample: true
//       }
//     };
//   }
// }

// module.exports = new ChartService();

const StockHistory = require('../models/StockHistory');

class ChartService {
  constructor() {
    console.log('Advanced ChartService initialized');
  }

  // Get chart data - FIXED VERSION
  async getChartData(symbol, timeframe = '1h', chartType = 'candlestick') {
    try {
      console.log(`Getting ${chartType} chart for ${symbol}, timeframe: ${timeframe}`);
      
      // Calculate time range
      const hours = this.getHoursFromTimeframe(timeframe);
      const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
      
      // Get historical data
      const history = await StockHistory.find({
        symbol: symbol.toUpperCase(),
        timestamp: { $gte: cutoffTime }
      })
      .sort({ timestamp: 1 })
      .limit(this.getDataLimit(timeframe));
      
      console.log(`Found ${history.length} records for ${symbol}`);
      
      if (history.length > 0) {
        const processedData = this.processDataForChartType(history, chartType, timeframe);
        const summary = this.calculateSummary(history);
        const technicalIndicators = this.calculateTechnicalIndicators(history);
        
        return {
          chartData: processedData,
          summary,
          technicalIndicators,
          metadata: {
            dataPoints: history.length,
            timeframe,
            chartType,
            symbol: symbol.toUpperCase()
          }
        };
      } else {
        console.log(`Generating sample data for ${symbol}`);
        return this.generateComprehensiveSampleData(symbol, timeframe, chartType);
      }
      
    } catch (error) {
      console.error('Error in getChartData:', error.message);
      return this.generateComprehensiveSampleData(symbol, timeframe, chartType);
    }
  }

  // Process data for chart type - FIXED
  processDataForChartType(history, chartType, timeframe) {
    // Group data based on timeframe
    const groupedData = this.groupData(history, timeframe);
    
    switch(chartType) {
      case 'candlestick':
        return groupedData.map(item => ({
          x: item.timestamp,
          o: item.open,
          h: item.high,
          l: item.low,
          c: item.close,
          v: item.volume
        }));
        
      case 'line':
      case 'area':
        return groupedData.map(item => ({
          x: item.timestamp,
          y: item.close
        }));
        
      case 'volume':
        return groupedData.map(item => ({
          x: item.timestamp,
          y: item.volume,
          price: item.close
        }));
        
      default:
        return groupedData.map(item => ({
          x: item.timestamp,
          o: item.open,
          h: item.high,
          l: item.low,
          c: item.close,
          v: item.volume
        }));
    }
  }

  // Group data - FIXED
  groupData(history, timeframe) {
    const interval = this.getIntervalMilliseconds(timeframe);
    const grouped = [];
    
    history.forEach(record => {
      const timestamp = new Date(record.timestamp);
      const roundedTime = new Date(Math.floor(timestamp.getTime() / interval) * interval);
      
      let group = grouped.find(g => g.timestamp.getTime() === roundedTime.getTime());
      
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
        grouped.push(group);
      } else {
        group.high = Math.max(group.high, record.high || record.price);
        group.low = Math.min(group.low, record.low || record.price);
        group.close = record.close || record.price;
        group.volume += record.volume || 0;
      }
    });
    
    return grouped.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Get data for specific chart types - FIXED
  async getChartDataByType(symbol, chartType, timeframe = '1h') {
    const fullData = await this.getChartData(symbol, timeframe, chartType);
    
    return {
      candles: fullData.chartData,
      indicators: fullData.technicalIndicators,
      summary: fullData.summary
    };
  }

  // Helper methods (keep the rest as before)
  getHoursFromTimeframe(timeframe) {
    const timeframeMap = {
      '1m': 0.5,   // 30 minutes
      '5m': 2,     // 2 hours
      '15m': 6,    // 6 hours
      '30m': 12,   // 12 hours
      '1h': 24,    // 24 hours
      '4h': 96,    // 4 days
      '1d': 30,    // 30 days
      '1w': 180,   // 180 days
      '1M': 365,   // 1 year
      '24h': 24 * 7 // 7 days
    };
    return timeframeMap[timeframe] || 24;
  }

  getDataLimit(timeframe) {
    const limitMap = {
      '1m': 30,   // 30 points
      '5m': 50,   // 50 points
      '15m': 80,  // 80 points
      '30m': 100,
      '1h': 150,
      '4h': 200,
      '1d': 250,
      '1w': 300,
      '1M': 365,
      '24h': 168  // 7 days * 24 hours
    };
    return limitMap[timeframe] || 100;
  }

  getIntervalMilliseconds(timeframe) {
    const intervalMap = {
      '1m': 60 * 1000,        // 1 minute
      '5m': 5 * 60 * 1000,    // 5 minutes
      '15m': 15 * 60 * 1000,  // 15 minutes
      '30m': 30 * 60 * 1000,  // 30 minutes
      '1h': 60 * 60 * 1000,   // 1 hour
      '4h': 4 * 60 * 60 * 1000, // 4 hours
      '1d': 24 * 60 * 60 * 1000, // 1 day
      '1w': 7 * 24 * 60 * 60 * 1000, // 1 week
      '1M': 30 * 24 * 60 * 60 * 1000, // 1 month
      '24h': 60 * 60 * 1000   // 1 hour intervals for 24h
    };
    return intervalMap[timeframe] || 60 * 60 * 1000;
  }

  calculateSummary(history) {
    if (history.length === 0) return {};
    
    const prices = history.map(h => h.close || h.price);
    const volumes = history.map(h => h.volume || 0);
    
    return {
      open: history[0].open || history[0].price,
      close: history[history.length - 1].close || history[history.length - 1].price,
      high: Math.max(...prices),
      low: Math.min(...prices),
      volume: volumes.reduce((a, b) => a + b, 0),
      avgVolume: Math.round(volumes.reduce((a, b) => a + b, 0) / volumes.length),
      volatility: this.calculateVolatility(prices),
      vwap: this.calculateVWAP(history)
    };
  }

  calculateTechnicalIndicators(history) {
    const prices = history.map(h => h.close || h.price);
    const volumes = history.map(h => h.volume || 0);
    
    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      bollingerBands: this.calculateBollingerBands(prices),
      movingAverages: {
        sma20: this.calculateSMA(prices, 20),
        sma50: this.calculateSMA(prices, 50),
        sma200: this.calculateSMA(prices, 200),
        ema12: this.calculateEMA(prices, 12),
        ema26: this.calculateEMA(prices, 26)
      },
      support: this.calculateSupportResistance(prices),
      resistance: this.calculateSupportResistance(prices, false)
    };
  }

  // Technical indicator calculations (keep as before)
  calculateVolatility(prices) {
    if (prices.length < 2) return 0;
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized
  }

  calculateVWAP(history) {
    let totalPV = 0;
    let totalVolume = 0;
    
    history.forEach(h => {
      const price = (h.high + h.low + h.close) / 3;
      totalPV += price * (h.volume || 0);
      totalVolume += h.volume || 0;
    });
    
    return totalVolume > 0 ? totalPV / totalVolume : 0;
  }

  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i-1];
      if (change >= 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
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
    
    return {
      macd,
      signal,
      histogram: macd - signal
    };
  }

  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    if (prices.length < period) return { upper: 0, middle: 0, lower: 0 };
    
    const recentPrices = prices.slice(-period);
    const sma = this.calculateSMA(recentPrices, period);
    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const std = Math.sqrt(variance);
    
    return {
      upper: sma + (std * stdDev),
      middle: sma,
      lower: sma - (std * stdDev)
    };
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

  calculateSupportResistance(prices, isSupport = true) {
    if (prices.length < 20) return prices[prices.length - 1] || 0;
    
    const recent = prices.slice(-20);
    const high = Math.max(...recent);
    const low = Math.min(...recent);
    const close = recent[recent.length - 1];
    
    const pivot = (high + low + close) / 3;
    
    return isSupport ? (2 * pivot) - high : (2 * pivot) - low;
  }

  // Generate comprehensive sample data
  generateComprehensiveSampleData(symbol, timeframe, chartType) {
    console.log(`Generating comprehensive ${chartType} sample for ${symbol}`);
    
    // const basePrices = {
    //   'GOOG': { price: 142.31, volatility: 0.02 },
    //   'TSLA': { price: 238.45, volatility: 0.035 },
    //   'AMZN': { price: 176.95, volatility: 0.018 },
    //   'META': { price: 493.80, volatility: 0.025 },
    //   'NVDA': { price: 686.04, volatility: 0.04 }
    // };
    
    const stock = basePrices[symbol?.toUpperCase()] || { price: 100, volatility: 0.02 };
    const hours = this.getHoursFromTimeframe(timeframe);
    const dataPoints = Math.min(50, hours * 2);
    
    const data = [];
    let currentPrice = stock.price;
    
    for (let i = 0; i < dataPoints; i++) {
      const timeOffset = (dataPoints - i - 1) * this.getIntervalMilliseconds(timeframe);
      const timestamp = new Date(Date.now() - timeOffset);
      
      const trend = Math.sin(i / (dataPoints / 10)) * stock.price * 0.1;
      const noise = (Math.random() - 0.5) * stock.price * stock.volatility * 2;
      const drift = (i * stock.price * 0.0001);
      
      currentPrice = stock.price + trend + noise + drift;
      const volatility = Math.abs(noise) * 2;
      
      const open = currentPrice + (Math.random() - 0.5) * volatility;
      const close = currentPrice + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility;
      const low = Math.min(open, close) - Math.random() * volatility;
      const volume = Math.floor(500000 + Math.random() * 1500000 + i * 10000);
      
      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
        price: currentPrice
      });
    }
    
    const summary = this.calculateSummary(data);
    const indicators = this.calculateTechnicalIndicators(data);
    const chartData = this.processDataForChartType(data, chartType, timeframe);
    
    return {
      chartData,
      summary,
      technicalIndicators: indicators,
      metadata: {
        dataPoints: data.length,
        timeframe,
        chartType,
        symbol: symbol?.toUpperCase(),
        isSample: true
      }
    };
  }
}

module.exports = new ChartService();