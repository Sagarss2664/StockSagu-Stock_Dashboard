// Supported stocks
const SUPPORTED_STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];

// Stock price cache (in-memory)
const stockCache = new Map();

// User subscriptions cache
const userSubscriptions = new Map();

// Alpha Vantage configuration
const ALPHA_VANTAGE_CONFIG = {
  BASE_URL: 'https://www.alphavantage.co/query',
  FUNCTION: 'GLOBAL_QUOTE',
  API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
  POLLING_INTERVAL: 15000, // 15 seconds (respecting rate limits)
  MAX_REQUESTS_PER_MINUTE: 5,
};

module.exports = {
  SUPPORTED_STOCKS,
  stockCache,
  userSubscriptions,
  ALPHA_VANTAGE_CONFIG
};