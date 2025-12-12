const express = require('express');
const router = express.Router();
const { 
  getSupportedStocks, 
  getStockPrices 
} = require('../controllers/stockController');

router.get('/supported', getSupportedStocks);
router.get('/prices', getStockPrices);

module.exports = router;