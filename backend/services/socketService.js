// const Subscription = require('../models/Subscription');
// const { userSubscriptions } = require('../utils/constants');

// function initializeSocket(io) {
//   io.on('connection', (socket) => {
//     console.log(`New client connected: ${socket.id}`);

//     // Store user ID when authenticated
//     let userId = null;

//     // Handle user authentication
//     socket.on('authenticate', async (userData) => {
//       try {
//         userId = userData.userId;
        
//         // Load user's subscriptions from database
//         const subscriptions = await Subscription.find({ userId }).select('symbol');
//         const userStocks = subscriptions.map(sub => sub.symbol);
        
//         // Store in cache
//         userSubscriptions.set(userId, userStocks);
        
//         console.log(`User ${userId} authenticated with stocks:`, userStocks);
//         socket.emit('authenticated', { success: true });
//       } catch (error) {
//         console.error('Socket authentication error:', error);
//         socket.emit('error', { message: 'Authentication failed' });
//       }
//     });

//     // Handle subscription updates
//     socket.on('subscribe', (symbol) => {
//       if (userId) {
//         const stocks = userSubscriptions.get(userId) || [];
//         if (!stocks.includes(symbol)) {
//           stocks.push(symbol);
//           userSubscriptions.set(userId, stocks);
//           console.log(`User ${userId} subscribed to ${symbol}`);
//         }
//       }
//     });

//     socket.on('unsubscribe', (symbol) => {
//       if (userId) {
//         const stocks = userSubscriptions.get(userId) || [];
//         const index = stocks.indexOf(symbol);
//         if (index > -1) {
//           stocks.splice(index, 1);
//           userSubscriptions.set(userId, stocks);
//           console.log(`User ${userId} unsubscribed from ${symbol}`);
//         }
//       }
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//       if (userId) {
//         userSubscriptions.delete(userId);
//       }
//       console.log(`Client disconnected: ${socket.id}`);
//     });
//   });
// }

// module.exports = { initializeSocket };
const Subscription = require('../models/Subscription');
const { userSubscriptions } = require('../utils/constants');

function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Store user ID when authenticated
    let userId = null;
    const userRooms = new Set(); // Track which rooms this socket has joined

    // Handle user authentication
    socket.on('authenticate', async (userData) => {
      try {
        userId = userData.userId;
        console.log(`🔐 User ${userId} authenticating...`);
        
        // 1. Load user's subscriptions from database
        const subscriptions = await Subscription.find({ userId }).select('symbol');
        const userStocks = subscriptions.map(sub => sub.symbol);
        
        // 2. Store in cache
        userSubscriptions.set(userId, userStocks);
        
        // 3. CRITICAL: Join WebSocket rooms for each subscribed stock
        userStocks.forEach(symbol => {
          const roomName = `stock:${symbol}`;
          socket.join(roomName);
          userRooms.add(roomName);
          console.log(`✅ User ${userId} joined room: ${roomName}`);
        });
        
        console.log(`✅ User ${userId} authenticated with ${userStocks.length} stocks:`, userStocks);
        socket.emit('authenticated', { 
          success: true, 
          stocks: userStocks,
          message: `Restored ${userStocks.length} subscribed stocks`
        });
        
        // 4. Send initial stock data if available
        if (userStocks.length > 0) {
          // You might want to fetch initial prices here
          socket.emit('subscriptions_restored', {
            stocks: userStocks,
            count: userStocks.length
          });
        }
        
      } catch (error) {
        console.error('❌ Socket authentication error:', error);
        socket.emit('error', { message: 'Authentication failed' });
      }
    });

    // Handle subscription requests
    socket.on('subscribe', async (symbol) => {
      try {
        if (!userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const uppercaseSymbol = symbol.toUpperCase();
        console.log(`📝 User ${userId} subscribing to ${uppercaseSymbol}`);
        
        // 1. Add to database (if not already)
        const existing = await Subscription.findOne({ 
          userId, 
          symbol: uppercaseSymbol 
        });
        
        if (!existing) {
          await Subscription.create({ 
            userId, 
            symbol: uppercaseSymbol 
          });
          console.log(`✅ Added ${uppercaseSymbol} to database for user ${userId}`);
        }
        
        // 2. Update cache
        const stocks = userSubscriptions.get(userId) || [];
        if (!stocks.includes(uppercaseSymbol)) {
          stocks.push(uppercaseSymbol);
          userSubscriptions.set(userId, stocks);
        }
        
        // 3. Join WebSocket room for this stock
        const roomName = `stock:${uppercaseSymbol}`;
        socket.join(roomName);
        userRooms.add(roomName);
        console.log(`✅ User ${userId} joined room: ${roomName}`);
        
        // 4. Notify client
        socket.emit('subscribed', { 
          success: true,
          symbol: uppercaseSymbol,
          message: `Subscribed to ${uppercaseSymbol}`
        });
        
        console.log(`✅ User ${userId} subscribed to ${uppercaseSymbol}`);
        
      } catch (error) {
        console.error('❌ Subscription error:', error);
        socket.emit('subscription_error', { 
          symbol, 
          message: 'Subscription failed',
          error: error.message 
        });
      }
    });

    // Handle unsubscribe requests
    socket.on('unsubscribe', async (symbol) => {
      try {
        if (!userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const uppercaseSymbol = symbol.toUpperCase();
        console.log(`📝 User ${userId} unsubscribing from ${uppercaseSymbol}`);
        
        // 1. Remove from database
        const result = await Subscription.deleteOne({ 
          userId, 
          symbol: uppercaseSymbol 
        });

        if (result.deletedCount === 0) {
          console.log(`⚠️ ${uppercaseSymbol} not found in database for user ${userId}`);
        } else {
          console.log(`✅ Removed ${uppercaseSymbol} from database for user ${userId}`);
        }
        
        // 2. Update cache
        const stocks = userSubscriptions.get(userId) || [];
        const index = stocks.indexOf(uppercaseSymbol);
        if (index > -1) {
          stocks.splice(index, 1);
          userSubscriptions.set(userId, stocks);
        }
        
        // 3. Leave WebSocket room for this stock
        const roomName = `stock:${uppercaseSymbol}`;
        socket.leave(roomName);
        userRooms.delete(roomName);
        console.log(`✅ User ${userId} left room: ${roomName}`);
        
        // 4. Notify client
        socket.emit('unsubscribed', { 
          success: true,
          symbol: uppercaseSymbol,
          message: `Unsubscribed from ${uppercaseSymbol}`
        });
        
        console.log(`✅ User ${userId} unsubscribed from ${uppercaseSymbol}`);
        
      } catch (error) {
        console.error('❌ Unsubscription error:', error);
        socket.emit('subscription_error', { 
          symbol, 
          message: 'Unsubscription failed',
          error: error.message 
        });
      }
    });

    // Get current subscriptions
    socket.on('get_subscriptions', async () => {
      try {
        if (!userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Get from database (most accurate)
        const subscriptions = await Subscription.find({ userId })
          .select('symbol subscribedAt')
          .lean();

        socket.emit('subscriptions_list', {
          success: true,
          subscriptions: subscriptions.map(sub => sub.symbol),
          details: subscriptions
        });
        
      } catch (error) {
        console.error('❌ Get subscriptions error:', error);
        socket.emit('error', { message: 'Failed to fetch subscriptions' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (userId) {
        console.log(`🔌 User ${userId} disconnected from rooms:`, Array.from(userRooms));
        
        // Clear user rooms tracking
        userRooms.clear();
        
        // Optional: Remove from cache after delay
        setTimeout(() => {
          if (!Array.from(io.sockets.sockets.values()).some(s => s.userId === userId)) {
            userSubscriptions.delete(userId);
            console.log(`🧹 Removed user ${userId} from cache`);
          }
        }, 30000); // 30 second delay
        
        console.log(`Client ${socket.id} (user ${userId}) disconnected`);
      } else {
        console.log(`Anonymous client ${socket.id} disconnected`);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error for user ${userId}:`, error);
    });
  });

  // Function to broadcast stock updates to specific rooms
  const broadcastStockUpdate = (symbol, data) => {
    const roomName = `stock:${symbol}`;
    io.to(roomName).emit('stockPricesUpdate', {
      [symbol]: data
    });
    console.log(`📢 Broadcast update for ${symbol} to room ${roomName}`);
  };

  // Function to get users subscribed to a stock
  const getSubscribedUsers = (symbol) => {
    const roomName = `stock:${symbol}`;
    const room = io.sockets.adapter.rooms.get(roomName);
    return room ? Array.from(room) : [];
  };

  return {
    broadcastStockUpdate,
    getSubscribedUsers
  };
}

module.exports = { initializeSocket };