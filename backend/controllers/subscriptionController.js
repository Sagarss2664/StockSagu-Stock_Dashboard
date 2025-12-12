const Subscription = require('../models/Subscription');
const { SUPPORTED_STOCKS } = require('../utils/constants');

exports.subscribe = async (req, res) => {
  try {
    const { userId, symbol } = req.body;

    if (!userId || !symbol) {
      return res.status(400).json({ error: 'User ID and symbol are required' });
    }

    if (!SUPPORTED_STOCKS.includes(symbol)) {
      return res.status(400).json({ error: 'Unsupported stock symbol' });
    }

    // Check if already subscribed
    const existing = await Subscription.findOne({ userId, symbol });
    if (existing) {
      return res.status(400).json({ error: 'Already subscribed to this stock' });
    }

    // Create subscription
    const subscription = await Subscription.create({ userId, symbol });

    res.status(201).json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Server error during subscription' });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { userId, symbol } = req.body;

    if (!userId || !symbol) {
      return res.status(400).json({ error: 'User ID and symbol are required' });
    }

    // Delete subscription
    const result = await Subscription.deleteOne({ userId, symbol });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Server error during unsubscription' });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const subscriptions = await Subscription.find({ userId }).select('symbol subscribedAt');

    res.status(200).json({
      success: true,
      subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Server error fetching subscriptions' });
  }
};