const express = require('express');
const router = express.Router();
const { 
  subscribe, 
  unsubscribe, 
  getUserSubscriptions 
} = require('../controllers/subscriptionController');

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/user/:userId', getUserSubscriptions);

module.exports = router;