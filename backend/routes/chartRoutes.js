const express = require('express');
const router = express.Router();
const { 
  getChartData,
  healthCheck 
} = require('../controllers/chartController');

// Health check endpoint
router.get('/health', healthCheck);

// Main chart data endpoint
router.get('/:symbol', getChartData);

module.exports = router;