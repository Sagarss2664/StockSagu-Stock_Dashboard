const Subscription = require('../models/Subscription');
const { userSubscriptions } = require('../utils/constants');

function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Store user ID when authenticated
    let userId = null;

    // Handle user authentication
    socket.on('authenticate', async (userData) => {
      try {
        userId = userData.userId;
        
        // Load user's subscriptions from database
        const subscriptions = await Subscription.find({ userId }).select('symbol');
        const userStocks = subscriptions.map(sub => sub.symbol);
        
        // Store in cache
        userSubscriptions.set(userId, userStocks);
        
        console.log(`User ${userId} authenticated with stocks:`, userStocks);
        socket.emit('authenticated', { success: true });
      } catch (error) {
        console.error('Socket authentication error:', error);
        socket.emit('error', { message: 'Authentication failed' });
      }
    });

    // Handle subscription updates
    socket.on('subscribe', (symbol) => {
      if (userId) {
        const stocks = userSubscriptions.get(userId) || [];
        if (!stocks.includes(symbol)) {
          stocks.push(symbol);
          userSubscriptions.set(userId, stocks);
          console.log(`User ${userId} subscribed to ${symbol}`);
        }
      }
    });

    socket.on('unsubscribe', (symbol) => {
      if (userId) {
        const stocks = userSubscriptions.get(userId) || [];
        const index = stocks.indexOf(symbol);
        if (index > -1) {
          stocks.splice(index, 1);
          userSubscriptions.set(userId, stocks);
          console.log(`User ${userId} unsubscribed from ${symbol}`);
        }
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (userId) {
        userSubscriptions.delete(userId);
      }
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { initializeSocket };