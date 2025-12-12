// // // const axios = require('axios');

// // // const { 
// // //   SUPPORTED_STOCKS, 
// // //   stockCache,
// // //   ALPHA_VANTAGE_CONFIG 
// // // } = require('../utils/constants');

// // // // Track request timestamps for rate limiting
// // // let requestTimestamps = [];


// // // class StockService {
// // //   constructor() {
// // //     this.apiKey = ALPHA_VANTAGE_CONFIG.API_KEY;
// // //     this.baseUrl = ALPHA_VANTAGE_CONFIG.BASE_URL;
// // //   }

// // //   // Rate limiting helper
// // //   canMakeRequest() {
// // //     const now = Date.now();
// // //     const oneMinuteAgo = now - 60000;
    
// // //     // Remove timestamps older than 1 minute
// // //     requestTimestamps = requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo);
    
// // //     // Check if we've made fewer than 5 requests in the last minute
// // //     return requestTimestamps.length < ALPHA_VANTAGE_CONFIG.MAX_REQUESTS_PER_MINUTE;
// // //   }

// // //   // Fetch single stock price
// // //   async fetchStockPrice(symbol) {
// // //     if (!this.canMakeRequest()) {
// // //       console.warn('Rate limit reached, skipping request');
// // //       return null;
// // //     }

// // //     try {
// // //       requestTimestamps.push(Date.now());
      
// // //       const response = await axios.get(this.baseUrl, {
// // //         params: {
// // //           function: ALPHA_VANTAGE_CONFIG.FUNCTION,
// // //           symbol: symbol,
// // //           apikey: this.apiKey
// // //         }
// // //       });

// // //       const data = response.data;
      
// // //       if (data['Global Quote'] && data['Global Quote']['05. price']) {
// // //         const price = parseFloat(data['Global Quote']['05. price']);
// // //         const change = parseFloat(data['Global Quote']['09. change']);
// // //         const changePercent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));
        
// // //         const stockData = {
// // //           symbol,
// // //           price,
// // //           change,
// // //           changePercent,
// // //           lastUpdated: new Date()
// // //         };

// // //         // Update cache
// // //         stockCache.set(symbol, stockData);
        
// // //         return stockData;
// // //       }
      
// // //       console.error(`Invalid response for ${symbol}:`, data);
// // //       return null;
// // //     } catch (error) {
// // //       console.error(`Error fetching ${symbol}:`, error.message);
// // //       return null;
// // //     }
// // //   }

// // //   // Fetch all supported stock prices
// // //   async fetchAllStockPrices() {
// // //     const promises = SUPPORTED_STOCKS.map(symbol => 
// // //       this.fetchStockPrice(symbol)
// // //     );
    
// // //     const results = await Promise.all(promises);
// // //     const validResults = results.filter(result => result !== null);
    
// // //     return validResults;
// // //   }

// // //   // Get cached stock price
// // //   getCachedStockPrice(symbol) {
// // //     return stockCache.get(symbol) || null;
// // //   }

// // //   // Get all cached stock prices
// // //   getAllCachedStockPrices() {
// // //     const result = {};
// // //     SUPPORTED_STOCKS.forEach(symbol => {
// // //       const cached = stockCache.get(symbol);
// // //       if (cached) {
// // //         result[symbol] = cached;
// // //       }
// // //     });
// // //     return result;
// // //   }
// // // }

// // // // Singleton instance
// // // const stockService = new StockService();

// // // // Start polling for stock prices
// // // let pollingInterval;

// // // function startStockPolling(io) {
// // //   if (pollingInterval) {
// // //     clearInterval(pollingInterval);
// // //   }

// // //   pollingInterval = setInterval(async () => {
// // //     try {
// // //       console.log('Fetching latest stock prices...');
// // //       const updatedStocks = await stockService.fetchAllStockPrices();
      
// // //       // Emit updates to all connected clients
// // //       io.emit('stockPricesUpdate', stockService.getAllCachedStockPrices());
      
// // //       console.log(`Updated ${updatedStocks.length} stocks`);
// // //     } catch (error) {
// // //       console.error('Error in stock polling:', error);
// // //     }
// // //   }, ALPHA_VANTAGE_CONFIG.POLLING_INTERVAL);
// // // }

// // // module.exports = {
// // //   stockService,
// // //   startStockPolling
// // // };

// // const axios = require('axios');

// // const { 
// //   SUPPORTED_STOCKS, 
// //   stockCache,
// //   ALPHA_VANTAGE_CONFIG 
// // } = require('../utils/constants');

// // // Track request timestamps for rate limiting
// // let requestTimestamps = [];

// // class StockService {
// //   constructor() {
// //     this.apiKey = ALPHA_VANTAGE_CONFIG.API_KEY;
// //     this.baseUrl = ALPHA_VANTAGE_CONFIG.BASE_URL;
// //   }

// //   // Rate limiting helper
// //   canMakeRequest() {
// //     const now = Date.now();
// //     const oneMinuteAgo = now - 60000;

// //     // Remove timestamps older than 1 minute
// //     requestTimestamps = requestTimestamps.filter(ts => ts > oneMinuteAgo);

// //     // Check if we have remaining request quota
// //     return requestTimestamps.length < ALPHA_VANTAGE_CONFIG.MAX_REQUESTS_PER_MINUTE;
// //   }

// //   // ------------------------------  
// //   // Fetch Single Stock Price  
// //   // ------------------------------
// //   async fetchStockPrice(symbol) {
// //     if (!this.canMakeRequest()) {
// //       console.warn("Rate limit reached, skipping request");
// //       return null;
// //     }

// //     try {
// //       requestTimestamps.push(Date.now());

// //       const response = await axios.get(this.baseUrl, {
// //         params: {
// //           function: ALPHA_VANTAGE_CONFIG.FUNCTION,
// //           symbol: symbol,
// //           apikey: this.apiKey
// //         }
// //       });

// //       const data = response.data;

// //       if (data['Global Quote'] && data['Global Quote']['05. price']) {
// //         const price = parseFloat(data['Global Quote']['05. price']);
// //         const change = parseFloat(data['Global Quote']['09. change']);
// //         const changePercent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));

// //         const stockData = {
// //           symbol,
// //           price,
// //           change,
// //           changePercent,
// //           lastUpdated: new Date()
// //         };

// //         stockCache.set(symbol, stockData);
// //         return stockData;
// //       }

// //       console.error(`Invalid response for ${symbol}:`, data);
// //       return null;

// //     } catch (error) {
// //       console.error(`Error fetching ${symbol}:`, error.message);
// //       return null;
// //     }
// //   }

// //   // ------------------------------  
// //   // Fetch All Stock Prices  
// //   // ------------------------------
// //   async fetchAllStockPrices() {
// //     const promises = SUPPORTED_STOCKS.map(symbol => this.fetchStockPrice(symbol));
// //     const results = await Promise.all(promises);
// //     return results.filter(r => r !== null);
// //   }

// //   // ------------------------------  
// //   // Get Cached Prices  
// //   // ------------------------------
// //   getCachedStockPrice(symbol) {
// //     return stockCache.get(symbol) || null;
// //   }

// //   getAllCachedStockPrices() {
// //     const result = {};
// //     SUPPORTED_STOCKS.forEach(symbol => {
// //       const cached = stockCache.get(symbol);
// //       if (cached) result[symbol] = cached;
// //     });
// //     return result;
// //   }

// //   // ------------------------------  
// //   // NEW FUNCTION: Chart Data Fetch  
// //   // ------------------------------
// //   async getChartData(symbol) {
// //     if (!this.canMakeRequest()) {
// //       console.warn("Rate limit reached for chart data");
// //       return null;
// //     }

// //     try {
// //       requestTimestamps.push(Date.now());

// //       const response = await axios.get(this.baseUrl, {
// //         params: {
// //           function: "TIME_SERIES_DAILY",
// //           symbol,
// //           apikey: this.apiKey
// //         }
// //       });

// //       const raw = response.data["Time Series (Daily)"];

// //       if (!raw) {
// //         console.error("Invalid chart API response:", response.data);
// //         return null;
// //       }

// //       const chartData = Object.entries(raw)
// //         .map(([date, values]) => ({
// //           date,
// //           open: parseFloat(values["1. open"]),
// //           high: parseFloat(values["2. high"]),
// //           low: parseFloat(values["3. low"]),
// //           close: parseFloat(values["4. close"])
// //         }))
// //         .reverse(); // oldest → latest

// //       return chartData;

// //     } catch (error) {
// //       console.error(`Chart API error (${symbol}):`, error.message);
// //       return null;
// //     }
// //   }
// // }

// // // ------------------------------  
// // // Singleton Instance  
// // // ------------------------------
// // const stockService = new StockService();

// // // ------------------------------  
// // // Stock Polling for WebSocket  
// // // ------------------------------
// // let pollingInterval;

// // function startStockPolling(io) {
// //   if (pollingInterval) clearInterval(pollingInterval);

// //   pollingInterval = setInterval(async () => {
// //     try {
// //       console.log("Fetching latest stock prices...");
// //       await stockService.fetchAllStockPrices();

// //       io.emit("stockPricesUpdate", stockService.getAllCachedStockPrices());
// //     } catch (err) {
// //       console.error("Error in stock polling:", err);
// //     }
// //   }, ALPHA_VANTAGE_CONFIG.POLLING_INTERVAL);
// // }

// // module.exports = {
// //   stockService,
// //   startStockPolling
// // };
// const axios = require('axios');
// const chartService = require('./chartService'); // Add this import
// const { 
//   SUPPORTED_STOCKS, 
//   stockCache,
//   ALPHA_VANTAGE_CONFIG 
// } = require('../utils/constants');

// // Track request timestamps for rate limiting
// let requestTimestamps = [];

// class StockService {
//   constructor() {
//     this.apiKey = ALPHA_VANTAGE_CONFIG.API_KEY;
//     this.baseUrl = ALPHA_VANTAGE_CONFIG.BASE_URL;
//     console.log('StockService initialized with API key:', this.apiKey ? 'Yes' : 'No');
//   }

//   // Fetch single stock price
//   async fetchStockPrice(symbol) {
//     console.log(`Fetching ${symbol}...`);
    
//     // Check rate limiting
//     const now = Date.now();
//     const oneMinuteAgo = now - 60000;
//     requestTimestamps = requestTimestamps.filter(t => t > oneMinuteAgo);
    
//     if (requestTimestamps.length >= 5) {
//       console.log('Rate limit reached, using cache');
//       const cached = this.getCachedStockPrice(symbol);
//       if (cached) return cached;
//     }

//     try {
//       requestTimestamps.push(now);
      
//       const response = await axios.get(this.baseUrl, {
//         params: {
//           function: 'GLOBAL_QUOTE',
//           symbol: symbol,
//           apikey: this.apiKey
//         },
//         timeout: 10000
//       });

//       const data = response.data;
      
//       if (data['Global Quote'] && data['Global Quote']['05. price']) {
//         const quote = data['Global Quote'];
//         const stockData = {
//           symbol,
//           price: parseFloat(quote['05. price']),
//           change: parseFloat(quote['09. change']),
//           changePercent: parseFloat(quote['10. change percent']?.replace('%', '')),
//           lastUpdated: new Date()
//         };

//         // Update cache
//         stockCache.set(symbol, stockData);
        
//         // Store in history for charts
//         try {
//           await chartService.storeStockData(symbol, stockData);
//         } catch (historyError) {
//           console.error('Failed to store history:', historyError.message);
//         }
        
//         console.log(`✅ Fetched ${symbol}: $${stockData.price}`);
//         return stockData;
//       } else {
//         console.log(`No data for ${symbol} from API`);
//         const cached = this.getCachedStockPrice(symbol);
//         if (cached) return cached;
        
//         // Return default data
//         return {
//           symbol,
//           price: 0,
//           change: 0,
//           changePercent: 0,
//           lastUpdated: new Date()
//         };
//       }
//     } catch (error) {
//       console.error(`Error fetching ${symbol}:`, error.message);
//       const cached = this.getCachedStockPrice(symbol);
//       if (cached) return cached;
      
//       return {
//         symbol,
//         price: 0,
//         change: 0,
//         changePercent: 0,
//         lastUpdated: new Date()
//       };
//     }
//   }

//   // Get cached stock price
//   getCachedStockPrice(symbol) {
//     return stockCache.get(symbol) || null;
//   }

//   // Get all cached stock prices
//   getAllCachedStockPrices() {
//     const result = {};
//     SUPPORTED_STOCKS.forEach(symbol => {
//       result[symbol] = this.getCachedStockPrice(symbol) || {
//         symbol,
//         price: 0,
//         change: 0,
//         changePercent: 0,
//         lastUpdated: new Date()
//       };
//     });
//     return result;
//   }

//   // Get chart data (wrapper for chartService)
//   async getChartData(symbol, timeframe) {
//     return await chartService.getChartData(symbol, timeframe);
//   }
// }

// // Singleton instance
// const stockService = new StockService();

// // Start polling
// let pollingInterval;

// function startStockPolling(io) {
//   console.log('Starting stock polling...');
  
//   // Initial fetch
//   setTimeout(async () => {
//     console.log('Initial stock fetch...');
//     const prices = stockService.getAllCachedStockPrices();
//     io.emit('stockPricesUpdate', prices);
//   }, 1000);

//   // Poll every 30 seconds
//   pollingInterval = setInterval(async () => {
//     try {
//       console.log('\n=== Polling Cycle ===');
      
//       // Process stocks one by one to respect rate limits
//       for (const symbol of SUPPORTED_STOCKS) {
//         try {
//           await stockService.fetchStockPrice(symbol);
          
//           // Emit update after each stock
//           const updatedPrices = stockService.getAllCachedStockPrices();
//           io.emit('stockPricesUpdate', updatedPrices);
          
//           // Wait 2 seconds between stocks for rate limiting
//           await new Promise(resolve => setTimeout(resolve, 2000));
          
//         } catch (error) {
//           console.error(`Failed to update ${symbol}:`, error.message);
//         }
//       }
      
//       console.log('=== Polling Complete ===\n');
      
//     } catch (error) {
//       console.error('Polling cycle error:', error);
//     }
//   }, 30000); // 30 seconds
// }

// module.exports = {
//   stockService,
//   startStockPolling
// };

const axios = require('axios');
const stockDataService = require('./stockDataService'); // Add this
const { 
  SUPPORTED_STOCKS, 
  stockCache,
  ALPHA_VANTAGE_CONFIG 
} = require('../utils/constants');

// Track request timestamps for rate limiting
let requestTimestamps = [];

class StockService {
  constructor() {
    this.apiKey = ALPHA_VANTAGE_CONFIG.API_KEY;
    this.baseUrl = ALPHA_VANTAGE_CONFIG.BASE_URL;
    console.log('StockService initialized with API key:', this.apiKey ? 'Yes' : 'No');
  }

  // Fetch single stock price
  async fetchStockPrice(symbol) {
    console.log(`📡 Fetching ${symbol}...`);
    
    // Check rate limiting
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    requestTimestamps = requestTimestamps.filter(t => t > oneMinuteAgo);
    
    if (requestTimestamps.length >= 5) {
      console.log('⏳ Rate limit reached, using cache');
      const cached = this.getCachedStockPrice(symbol);
      if (cached) return cached;
    }

    try {
      requestTimestamps.push(now);
      
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: this.apiKey
        },
        timeout: 10000
      });

      const data = response.data;
      
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        const quote = data['Global Quote'];
        const stockData = {
          symbol,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent']?.replace('%', '')),
          open: parseFloat(quote['02. open']) || 0,
          high: parseFloat(quote['03. high']) || 0,
          low: parseFloat(quote['04. low']) || 0,
          close: parseFloat(quote['05. price']) || 0,
          volume: parseInt(quote['06. volume']) || 0,
          lastUpdated: new Date()
        };

        // Update cache
        stockCache.set(symbol, stockData);
        
        // Store in history database
        try {
          await stockDataService.storeStockHistory(symbol, stockData);
        } catch (historyError) {
          console.error('❌ Failed to store history:', historyError.message);
        }
        
        console.log(`✅ Fetched ${symbol}: $${stockData.price}`);
        return stockData;
      } else {
        console.log(`⚠️ No data for ${symbol} from API`);
        const cached = this.getCachedStockPrice(symbol);
        if (cached) return cached;
        
        // Return default data
        return {
          symbol,
          price: 0,
          change: 0,
          changePercent: 0,
          lastUpdated: new Date()
        };
      }
    } catch (error) {
      console.error(`❌ Error fetching ${symbol}:`, error.message);
      const cached = this.getCachedStockPrice(symbol);
      if (cached) return cached;
      
      return {
        symbol,
        price: 0,
        change: 0,
        changePercent: 0,
        lastUpdated: new Date()
      };
    }
  }

  // Get cached stock price
  getCachedStockPrice(symbol) {
    return stockCache.get(symbol) || null;
  }

  // Get all cached stock prices
  getAllCachedStockPrices() {
    const result = {};
    SUPPORTED_STOCKS.forEach(symbol => {
      result[symbol] = this.getCachedStockPrice(symbol) || {
        symbol,
        price: 0,
        change: 0,
        changePercent: 0,
        lastUpdated: new Date()
      };
    });
    return result;
  }

  // Get chart data from stockDataService
  async getChartData(symbol, timeframe) {
    return await stockDataService.getChartData(symbol, timeframe);
  }
}

// Singleton instance
const stockService = new StockService();

// Start polling
let pollingInterval;

function startStockPolling(io) {
  console.log('🔄 Starting stock polling...');
  
  // Initial fetch
  setTimeout(async () => {
    console.log('📥 Initial stock fetch...');
    const prices = stockService.getAllCachedStockPrices();
    io.emit('stockPricesUpdate', prices);
  }, 1000);

  // Poll every 30 seconds
  pollingInterval = setInterval(async () => {
    try {
      console.log('\n=== POLLING CYCLE START ===');
      
      // Process stocks one by one to respect rate limits
      for (const symbol of SUPPORTED_STOCKS) {
        try {
          console.log(`📥 Fetching ${symbol}...`);
          await stockService.fetchStockPrice(symbol);
          
          // Emit update after each stock
          const updatedPrices = stockService.getAllCachedStockPrices();
          io.emit('stockPricesUpdate', updatedPrices);
          
          // Wait 2 seconds between stocks for rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.error(`❌ Failed to update ${symbol}:`, error.message);
        }
      }
      
      console.log('=== POLLING CYCLE COMPLETE ===\n');
      
    } catch (error) {
      console.error('❌ Polling cycle error:', error);
    }
  }, 30000); // 30 seconds
}

module.exports = {
  stockService,
  startStockPolling
};