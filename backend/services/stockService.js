

// const axios = require('axios');
// const stockDataService = require('./stockDataService'); // Add this
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
//     console.log(`📡 Fetching ${symbol}...`);
    
//     // Check rate limiting
//     const now = Date.now();
//     const oneMinuteAgo = now - 60000;
//     requestTimestamps = requestTimestamps.filter(t => t > oneMinuteAgo);
    
//     if (requestTimestamps.length >= 5) {
//       console.log('⏳ Rate limit reached, using cache');
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
//           open: parseFloat(quote['02. open']) || 0,
//           high: parseFloat(quote['03. high']) || 0,
//           low: parseFloat(quote['04. low']) || 0,
//           close: parseFloat(quote['05. price']) || 0,
//           volume: parseInt(quote['06. volume']) || 0,
//           lastUpdated: new Date()
//         };

//         // Update cache
//         stockCache.set(symbol, stockData);
        
//         // Store in history database
//         try {
//           await stockDataService.storeStockHistory(symbol, stockData);
//         } catch (historyError) {
//           console.error('❌ Failed to store history:', historyError.message);
//         }
        
//         console.log(`✅ Fetched ${symbol}: $${stockData.price}`);
//         return stockData;
//       } else {
//         console.log(`⚠️ No data for ${symbol} from API`);
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
//       console.error(`❌ Error fetching ${symbol}:`, error.message);
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

//   // Get chart data from stockDataService
//   async getChartData(symbol, timeframe) {
//     return await stockDataService.getChartData(symbol, timeframe);
//   }
// }

// // Singleton instance
// const stockService = new StockService();

// // Start polling
// let pollingInterval;

// function startStockPolling(io) {
//   console.log('🔄 Starting stock polling...');
  
//   // Initial fetch
//   setTimeout(async () => {
//     console.log('📥 Initial stock fetch...');
//     const prices = stockService.getAllCachedStockPrices();
//     io.emit('stockPricesUpdate', prices);
//   }, 1000);

//   // Poll every 30 seconds
//   pollingInterval = setInterval(async () => {
//     try {
//       console.log('\n=== POLLING CYCLE START ===');
      
//       // Process stocks one by one to respect rate limits
//       for (const symbol of SUPPORTED_STOCKS) {
//         try {
//           console.log(`📥 Fetching ${symbol}...`);
//           await stockService.fetchStockPrice(symbol);
          
//           // Emit update after each stock
//           const updatedPrices = stockService.getAllCachedStockPrices();
//           io.emit('stockPricesUpdate', updatedPrices);
          
//           // Wait 2 seconds between stocks for rate limiting
//           await new Promise(resolve => setTimeout(resolve, 2000));
          
//         } catch (error) {
//           console.error(`❌ Failed to update ${symbol}:`, error.message);
//         }
//       }
      
//       console.log('=== POLLING CYCLE COMPLETE ===\n');
      
//     } catch (error) {
//       console.error('❌ Polling cycle error:', error);
//     }
//   }, 30000); // 30 seconds
// }

// module.exports = {
//   stockService,
//   startStockPolling
// };

const axios = require('axios');
const stockDataService = require('./stockDataService');
const { 
  SUPPORTED_STOCKS, 
  stockCache,
  ALPHA_VANTAGE_CONFIG 
} = require('../utils/constants');

// Track request timestamps for rate limiting
let requestTimestamps = [];
// Track last real API values for realistic simulations
let lastRealValues = new Map();
// Track volatility for each stock
let stockVolatility = new Map();

class StockService {
  constructor() {
    this.apiKey = ALPHA_VANTAGE_CONFIG.API_KEY;
    this.baseUrl = ALPHA_VANTAGE_CONFIG.BASE_URL;
    console.log('StockService initialized with API key:', this.apiKey ? 'Yes' : 'No');
    
    // Initialize volatility based on typical stock behavior
    SUPPORTED_STOCKS.forEach(symbol => {
      stockVolatility.set(symbol, this.getDefaultVolatility(symbol));
    });
  }

  // Get realistic volatility based on stock type
  getDefaultVolatility(symbol) {
    const volatilities = {
      'AAPL': 0.002,  // Apple - relatively stable
      'GOOGL': 0.0025, // Google - moderate
      'TSLA': 0.008,   // Tesla - high volatility
      'MSFT': 0.002,   // Microsoft - stable
      'AMZN': 0.003,   // Amazon - moderate
      'default': 0.003
    };
    return volatilities[symbol] || volatilities.default;
  }

  // Generate realistic price movement
  generateRealisticMovement(symbol, currentPrice, lastRealPrice) {
    if (!lastRealPrice) return currentPrice;
    
    const volatility = stockVolatility.get(symbol);
    const basePrice = lastRealPrice;
    
    // Simulate random walk with mean reversion
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    const timeDecay = 0.1; // Pull toward real price over time
    
    // Calculate new price
    const drift = (basePrice - currentPrice) * timeDecay;
    const randomMove = currentPrice * volatility * randomFactor;
    const newPrice = currentPrice + drift + randomMove;
    
    // Ensure price doesn't go negative
    return Math.max(newPrice, 0.01);
  }

  // Fetch single stock price (real API call)
  async fetchRealStockPrice(symbol) {
    console.log(`📡 [REAL API] Fetching ${symbol}...`);
    
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
          lastUpdated: new Date(),
          isRealData: true
        };

        // Update cache with real data
        stockCache.set(symbol, stockData);
        // Store real value for simulation
        lastRealValues.set(symbol, stockData.price);
        
        // Update volatility based on recent movement
        const cachedPrice = this.getCachedStockPrice(symbol)?.price;
        if (cachedPrice) {
          const priceChange = Math.abs(stockData.price - cachedPrice) / cachedPrice;
          // Smooth volatility update
          const currentVol = stockVolatility.get(symbol);
          const newVol = currentVol * 0.7 + priceChange * 0.3;
          stockVolatility.set(symbol, Math.min(newVol, 0.02)); // Cap at 2%
        }
        
        // Store in history database
        try {
          await stockDataService.storeStockHistory(symbol, stockData);
        } catch (historyError) {
          console.error('❌ Failed to store history:', historyError.message);
        }
        
        console.log(`✅ [REAL API] Fetched ${symbol}: $${stockData.price.toFixed(2)}`);
        return stockData;
      } else {
        console.log(`⚠️ No real data for ${symbol} from API`);
        return this.getCachedStockPrice(symbol);
      }
    } catch (error) {
      console.error(`❌ Error fetching real ${symbol}:`, error.message);
      return this.getCachedStockPrice(symbol);
    }
  }

  // Get simulated stock price (updated every second)
  getSimulatedStockPrice(symbol) {
    const realData = this.getCachedStockPrice(symbol);
    const lastRealPrice = lastRealValues.get(symbol);
    
    if (!realData) {
      return {
        symbol,
        price: 0,
        change: 0,
        changePercent: 0,
        lastUpdated: new Date(),
        isRealData: false
      };
    }
    
    // If we have real data less than 5 seconds old, use it directly
    const timeSinceRealUpdate = Date.now() - realData.lastUpdated.getTime();
    if (timeSinceRealUpdate < 5000) {
      return { ...realData, isRealData: true };
    }
    
    // Generate realistic simulation
    const simulatedPrice = this.generateRealisticMovement(
      symbol, 
      realData.price, 
      lastRealPrice
    );
    
    // Calculate change from open
    const change = simulatedPrice - (realData.open || simulatedPrice);
    const changePercent = (change / (realData.open || simulatedPrice)) * 100;
    
    return {
      ...realData,
      symbol,
      price: parseFloat(simulatedPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      lastUpdated: new Date(),
      isRealData: false
    };
  }

  // Get all simulated stock prices
  getAllSimulatedStockPrices() {
    const result = {};
    SUPPORTED_STOCKS.forEach(symbol => {
      result[symbol] = this.getSimulatedStockPrice(symbol);
    });
    return result;
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
        lastUpdated: new Date(),
        isRealData: false
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

// Start polling with dual intervals
let realPollingInterval;
let simulatedPollingInterval;

function startStockPolling(io) {
  console.log('🔄 Starting dual-mode stock polling...');
  
  // Function to update all stocks from API (real data)
  async function updateRealStockPrices() {
    console.log('\n=== REAL API POLLING CYCLE START ===');
    
    for (const symbol of SUPPORTED_STOCKS) {
      try {
        await stockService.fetchRealStockPrice(symbol);
        // Wait between stocks for rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ Failed to update ${symbol}:`, error.message);
      }
    }
    
    console.log('=== REAL API POLLING CYCLE COMPLETE ===\n');
    
    // Emit real data update
    const realPrices = stockService.getAllCachedStockPrices();
    io.emit('stockPricesUpdate', {
      ...realPrices,
      _metadata: { 
        isRealData: true,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  // Function to update simulated prices (every second)
  function updateSimulatedStockPrices() {
    const simulatedPrices = stockService.getAllSimulatedStockPrices();
    io.emit('stockPricesUpdate', {
      ...simulatedPrices,
      _metadata: { 
        isRealData: false,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  // Initial real fetch
  setTimeout(async () => {
    console.log('📥 Initial real stock fetch...');
    await updateRealStockPrices();
  }, 1000);
  
  // Real API polling every 30 seconds
  realPollingInterval = setInterval(async () => {
    try {
      await updateRealStockPrices();
    } catch (error) {
      console.error('❌ Real polling cycle error:', error);
    }
  }, 30000); // 30 seconds for real API calls
  
  // Simulated updates every second
  simulatedPollingInterval = setInterval(() => {
    try {
      updateSimulatedStockPrices();
    } catch (error) {
      console.error('❌ Simulated update error:', error);
    }
  }, 1000); // 1 second for simulated updates
  
  console.log(`📈 Real updates: every 30 seconds`);
  console.log(`📊 Simulated updates: every 1 second`);
}

// Cleanup function
function stopStockPolling() {
  if (realPollingInterval) clearInterval(realPollingInterval);
  if (simulatedPollingInterval) clearInterval(simulatedPollingInterval);
  console.log('🛑 Stopped all stock polling');
}

module.exports = {
  stockService,
  startStockPolling,
  stopStockPolling
};