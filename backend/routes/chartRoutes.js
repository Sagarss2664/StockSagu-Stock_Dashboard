// const express = require('express');
// const router = express.Router();
// const { 
//   getChartData,
//   healthCheck,
//   getTechnicalAnalysis,
//   getMultiChartData 
// } = require('../controllers/chartController');

// // Health check endpoint
// router.get('/health', healthCheck);

// // Main chart data endpoint
// router.get('/:symbol', getChartData);

// // Technical analysis endpoint
// router.get('/:symbol/technical', getTechnicalAnalysis);

// // Multiple charts endpoint
// router.get('/', getMultiChartData);

// module.exports = router;

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