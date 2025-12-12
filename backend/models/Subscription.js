// backend/models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA']
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure user can't subscribe to same stock twice
subscriptionSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);