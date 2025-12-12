const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  high: Number,
  low: Number,
  open: Number,
  close: Number,
  volume: Number
});

// Create TTL index - data expires after 24 hours
stockHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

module.exports = mongoose.model('StockHistory', stockHistorySchema);