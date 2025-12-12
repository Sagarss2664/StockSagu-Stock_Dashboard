const { stockService } = require('../services/stockService');
const { SUPPORTED_STOCKS } = require('../utils/constants');

exports.getSupportedStocks = (req, res) => {
  res.status(200).json({
    success: true,
    stocks: SUPPORTED_STOCKS.map(symbol => ({
      symbol,
      name: this.getStockName(symbol)
    }))
  });
};

exports.getStockName = (symbol) => {
  const stockNames = {
    'GOOG': 'Alphabet Inc. (Google)',
    'TSLA': 'Tesla Inc.',
    'AMZN': 'Amazon.com Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation'
  };
  return stockNames[symbol] || symbol;
};

exports.getStockPrices = async (req, res) => {
  try {
    const prices = stockService.getAllCachedStockPrices();
    
    res.status(200).json({
      success: true,
      prices,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Get stock prices error:', error);
    res.status(500).json({ error: 'Server error fetching stock prices' });
  }
};