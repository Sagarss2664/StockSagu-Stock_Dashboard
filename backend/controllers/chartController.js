// // // // const { stockService } = require('../services/stockService');

// // // // exports.getChartData = async (req, res) => {
// // // //   try {
// // // //     const { symbol } = req.params;
// // // //     const { timeframe = '1h' } = req.query;

// // // //     if (!symbol) {
// // // //       return res.status(400).json({ error: 'Stock symbol is required' });
// // // //     }

// // // //     const chartData = await stockService.getChartData(symbol, timeframe);
    
// // // //     res.status(200).json({
// // // //       success: true,
// // // //       data: chartData
// // // //     });
// // // //   } catch (error) {
// // // //     console.error('Get chart data error:', error);
// // // //     res.status(500).json({ error: 'Server error fetching chart data' });
// // // //   }
// // // // };

// // // // exports.getMultiChartData = async (req, res) => {
// // // //   try {
// // // //     const { symbols } = req.query;
    
// // // //     if (!symbols) {
// // // //       return res.status(400).json({ error: 'Symbols are required' });
// // // //     }

// // // //     const symbolArray = symbols.split(',');
// // // //     const promises = symbolArray.map(symbol => 
// // // //       stockService.getChartData(symbol, '1h')
// // // //     );

// // // //     const results = await Promise.all(promises);
    
// // // //     res.status(200).json({
// // // //       success: true,
// // // //       data: results
// // // //     });
// // // //   } catch (error) {
// // // //     console.error('Get multi chart data error:', error);
// // // //     res.status(500).json({ error: 'Server error fetching multi chart data' });
// // // //   }
// // // // };
// // // const { stockService } = require('../services/stockService');

// // // // ---------------------------------------
// // // // Fetch Chart Data for Single Stock
// // // // ---------------------------------------
// // // exports.getChartData = async (req, res) => {
// // //   try {
// // //     const { symbol } = req.params;

// // //     if (!symbol) {
// // //       return res.status(400).json({ error: 'Stock symbol is required' });
// // //     }

// // //     const chartData = await stockService.getChartData(symbol);

// // //     if (!chartData) {
// // //       return res.status(500).json({ error: "Unable to fetch chart data" });
// // //     }

// // //     res.status(200).json({
// // //       success: true,
// // //       symbol,
// // //       data: chartData
// // //     });
// // //   } catch (error) {
// // //     console.error("Get chart data error:", error);
// // //     res.status(500).json({ error: "Server error fetching chart data" });
// // //   }
// // // };

// // // // ---------------------------------------
// // // // Fetch Chart Data for Multiple Stocks
// // // // ---------------------------------------
// // // exports.getMultiChartData = async (req, res) => {
// // //   try {
// // //     const { symbols } = req.query;

// // //     if (!symbols) {
// // //       return res.status(400).json({ error: "Symbols are required" });
// // //     }

// // //     const symbolArray = symbols.split(",");

// // //     const promises = symbolArray.map(symbol => stockService.getChartData(symbol));
// // //     const results = await Promise.all(promises);

// // //     const response = symbolArray.map((symbol, idx) => ({
// // //       symbol,
// // //       data: results[idx] || []
// // //     }));

// // //     res.status(200).json({
// // //       success: true,
// // //       data: response
// // //     });
// // //   } catch (error) {
// // //     console.error("Get multi chart data error:", error);
// // //     res.status(500).json({ error: "Server error fetching multi chart data" });
// // //   }
// // // };
// // const { stockService } = require('../services/stockService');
// // const chartService = require('../services/chartService');

// // // Simple health check for chart endpoint
// // exports.healthCheck = (req, res) => {
// //   res.json({ 
// //     status: 'healthy',
// //     message: 'Chart API is working',
// //     timestamp: new Date().toISOString()
// //   });
// // };

// // // Get chart data - with extensive error handling
// // exports.getChartData = async (req, res) => {
// //   const startTime = Date.now();
  
// //   try {
// //     const { symbol } = req.params;
// //     const { timeframe = '1h' } = req.query;

// //     console.log(`📊 Chart API Request: ${symbol}, timeframe: ${timeframe}`);

// //     // Validate input
// //     if (!symbol || typeof symbol !== 'string') {
// //       console.log('Invalid symbol parameter');
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Valid stock symbol is required',
// //         example: '/api/charts/GOOG?timeframe=1h'
// //       });
// //     }

// //     const uppercaseSymbol = symbol.toUpperCase();
    
// //     // Get current stock data (from cache)
// //     let currentData = stockService.getCachedStockPrice(uppercaseSymbol);
    
// //     if (!currentData) {
// //       console.log(`No cached data for ${uppercaseSymbol}, creating default`);
// //       currentData = {
// //         symbol: uppercaseSymbol,
// //         price: 0,
// //         change: 0,
// //         changePercent: 0,
// //         lastUpdated: new Date()
// //       };
// //     }

// //     // Get historical data - this will ALWAYS return data
// //     console.log(`Fetching historical data for ${uppercaseSymbol}...`);
// //     const historicalData = await chartService.getChartData(uppercaseSymbol, timeframe);
// //     console.log(`Received ${historicalData.length} data points`);

// //     // Prepare response
// //     const response = {
// //       success: true,
// //       data: {
// //         symbol: uppercaseSymbol,
// //         current: currentData,
// //         historical: historicalData,
// //         timeframe: timeframe
// //       },
// //       metadata: {
// //         dataPoints: historicalData.length,
// //         generatedAt: new Date().toISOString(),
// //         processingTime: `${Date.now() - startTime}ms`
// //       }
// //     };

// //     console.log(`✅ Chart data sent for ${uppercaseSymbol} (${historicalData.length} points)`);
// //     res.status(200).json(response);

// //   } catch (error) {
// //     console.error('❌ Chart API Error:', error.message);
// //     console.error(error.stack);
    
// //     // Even on catastrophic error, return something usable
// //     const symbol = req.params.symbol?.toUpperCase() || 'STOCK';
// //     const sampleData = chartService.generateSampleData(symbol, 24);
    
// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         symbol: symbol,
// //         current: {
// //           symbol: symbol,
// //           price: 100,
// //           change: 0,
// //           changePercent: 0,
// //           lastUpdated: new Date()
// //         },
// //         historical: sampleData,
// //         timeframe: req.query.timeframe || '1h'
// //       },
// //       metadata: {
// //         note: 'Sample data - real data unavailable',
// //         error: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable',
// //         dataPoints: sampleData.length
// //       }
// //     });
// //   }
// // };

// const { stockService } = require('../services/stockService');
// const chartService = require('../services/chartService');

// // Simple health check for chart endpoint
// exports.healthCheck = (req, res) => {
//   res.json({ 
//     status: 'healthy',
//     message: 'Chart API is working',
//     timestamp: new Date().toISOString()
//   });
// };

// // Get chart data - with extensive error handling
// exports.getChartData = async (req, res) => {
//   const startTime = Date.now();
  
//   try {
//     const { symbol } = req.params;
//     const { timeframe = '1h', type = 'candlestick' } = req.query;

//     console.log(`📈 Chart Request: ${symbol}, ${timeframe}, ${type}`);

//     if (!symbol) {
//       return res.status(400).json({
//         success: false,
//         error: 'Stock symbol is required'
//       });
//     }

//     // Get comprehensive chart data
//     const chartData = await chartService.getChartDataByType(
//       symbol.toUpperCase(), 
//       type, 
//       timeframe
//     );

//     // Get current market data
//     const currentData = stockService.getCachedStockPrice(symbol.toUpperCase()) || {
//       symbol: symbol.toUpperCase(),
//       price: 0,
//       change: 0,
//       changePercent: 0,
//       lastUpdated: new Date()
//     };

//     res.status(200).json({
//       success: true,
//       data: {
//         symbol: symbol.toUpperCase(),
//         current: currentData,
//         chart: chartData,
//         timeframe,
//         chartType: type,
//         timestamp: new Date().toISOString()
//       }
//     });

//   } catch (error) {
//     console.error('Chart API Error:', error);
    
//     // Return sample data on error
//     const symbol = req.params.symbol?.toUpperCase() || 'STOCK';
//     const sampleData = chartService.generateComprehensiveSampleData(
//       symbol, 
//       req.query.timeframe || '1h', 
//       req.query.type || 'candlestick'
//     );

//     res.status(200).json({
//       success: true,
//       data: {
//         symbol,
//         current: { price: 100, change: 0, changePercent: 0 },
//         chart: sampleData,
//         timeframe: req.query.timeframe || '1h',
//         chartType: req.query.type || 'candlestick',
//         isSample: true
//       }
//     });
//   }
// };

// // Get multiple chart types at once
// exports.getMultiChartData = async (req, res) => {
//   try {
//     const { symbols, types = 'candlestick,line,volume', timeframe = '1h' } = req.query;

//     if (!symbols) {
//       return res.status(400).json({ error: 'Symbols are required' });
//     }

//     const symbolArray = symbols.split(',');
//     const typeArray = types.split(',');

//     const results = await Promise.all(
//       symbolArray.map(async symbol => {
//         const charts = await Promise.all(
//           typeArray.map(type => 
//             chartService.getChartDataByType(symbol.trim(), type.trim(), timeframe)
//           )
//         );
        
//         return {
//           symbol: symbol.toUpperCase(),
//           charts: charts.reduce((acc, chart, index) => {
//             acc[typeArray[index]] = chart;
//             return acc;
//           }, {})
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       data: results
//     });

//   } catch (error) {
//     console.error('Multi-chart error:', error);
//     res.status(500).json({ error: 'Failed to fetch multi-chart data' });
//   }
// };

// // Get technical analysis
// exports.getTechnicalAnalysis = async (req, res) => {
//   try {
//     const { symbol } = req.params;
//     const { timeframe = '1d' } = req.query;

//     const data = await chartService.getChartData(symbol, timeframe, 'technical');
    
//     res.status(200).json({
//       success: true,
//       data: {
//         symbol: symbol.toUpperCase(),
//         indicators: data.technicalIndicators,
//         summary: data.summary,
//         signals: generateTradingSignals(data.technicalIndicators),
//         timeframe
//       }
//     });

//   } catch (error) {
//     console.error('Technical analysis error:', error);
//     res.status(500).json({ error: 'Failed to generate technical analysis' });
//   }
// };

// // Helper functions
// function generateTradingSignals(indicators) {
//   const signals = [];
  
//   if (!indicators) return signals;
  
//   // RSI signals
//   if (indicators.rsi > 70) {
//     signals.push({ type: 'SELL', indicator: 'RSI', strength: 'Strong', message: 'Overbought (RSI > 70)' });
//   } else if (indicators.rsi < 30) {
//     signals.push({ type: 'BUY', indicator: 'RSI', strength: 'Strong', message: 'Oversold (RSI < 30)' });
//   }
  
//   // MACD signals
//   if (indicators.macd?.histogram > 0 && indicators.macd?.macd > indicators.macd?.signal) {
//     signals.push({ type: 'BUY', indicator: 'MACD', strength: 'Medium', message: 'MACD bullish crossover' });
//   } else if (indicators.macd?.histogram < 0 && indicators.macd?.macd < indicators.macd?.signal) {
//     signals.push({ type: 'SELL', indicator: 'MACD', strength: 'Medium', message: 'MACD bearish crossover' });
//   }
  
//   // Moving average signals
//   if (indicators.movingAverages?.ema12 > indicators.movingAverages?.ema26) {
//     signals.push({ type: 'BUY', indicator: 'EMA', strength: 'Weak', message: 'EMA 12 > EMA 26' });
//   } else {
//     signals.push({ type: 'SELL', indicator: 'EMA', strength: 'Weak', message: 'EMA 12 < EMA 26' });
//   }
  
//   return signals;
// }

const { stockService } = require('../services/stockService');
const stockDataService = require('../services/stockDataService');

// Health check
exports.healthCheck = (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'Chart API is working',
    timestamp: new Date().toISOString()
  });
};

// Get chart data
exports.getChartData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;

    console.log(`📈 Chart Request: ${symbol}, timeframe: ${timeframe}`);

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Stock symbol is required'
      });
    }

    // Get current stock price
    const currentData = stockService.getCachedStockPrice(symbol.toUpperCase()) || {
      symbol: symbol.toUpperCase(),
      price: 0,
      change: 0,
      changePercent: 0,
      lastUpdated: new Date()
    };

    // Get chart data
    const chartData = await stockDataService.getChartData(symbol, timeframe);

    res.status(200).json({
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        current: currentData,
        chart: chartData,
        timeframe: timeframe,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Chart API Error:', error);
    
    // Return sample data on error
    const symbol = req.params.symbol?.toUpperCase() || 'STOCK';
    const sampleData = stockDataService.generateSampleData(symbol, 24);
    
    res.status(200).json({
      success: true,
      data: {
        symbol,
        current: { price: 100, change: 0, changePercent: 0 },
        chart: sampleData,
        timeframe: req.query.timeframe || '1h',
        isSample: true
      }
    });
  }
};