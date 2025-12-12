// // import { useEffect, useRef, useCallback } from 'react';
// // import io from 'socket.io-client';

// // const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// // export const useWebSocket = (userId, onStockUpdate) => {
// //   const socketRef = useRef(null);
// //   const chartCallbacksRef = useRef({});

// //   useEffect(() => {
// //     if (!userId) return;

// //     // Initialize socket connection
// //     socketRef.current = io(SOCKET_URL, {
// //       transports: ['websocket', 'polling'],
// //       reconnection: true,
// //       reconnectionAttempts: 5,
// //       reconnectionDelay: 1000,
// //     });

// //     const socket = socketRef.current;

// //     // Socket event listeners
// //     socket.on('connect', () => {
// //       console.log('✅ Connected to WebSocket server');
      
// //       // Authenticate with server
// //       socket.emit('authenticate', { userId });
// //     });

// //     socket.on('authenticated', (data) => {
// //       console.log('🔐 Socket authenticated', data);
// //     });

// //     socket.on('stockPricesUpdate', (stockData) => {
// //       console.log('📈 Received stock update:', stockData);
// //       if (onStockUpdate) {
// //         onStockUpdate(stockData);
// //       }
// //     });

// //     socket.on('chartData', (chartData) => {
// //       console.log('📊 Received chart data:', chartData.symbol, chartData.data?.length);
// //       const callback = chartCallbacksRef.current[chartData.symbol];
// //       if (callback && chartData.data) {
// //         callback(chartData);
// //       }
// //     });

// //     socket.on('error', (error) => {
// //       console.error('❌ Socket error:', error);
// //     });

// //     socket.on('disconnect', () => {
// //       console.log('🔌 Disconnected from WebSocket server');
// //     });

// //     // Cleanup on unmount
// //     return () => {
// //       if (socket) {
// //         socket.disconnect();
// //       }
// //       chartCallbacksRef.current = {};
// //     };
// //   }, [userId, onStockUpdate]);

// //   const subscribeToStock = (symbol) => {
// //     if (socketRef.current && socketRef.current.connected) {
// //       socketRef.current.emit('subscribe', symbol);
// //       console.log(`✅ Subscribed to ${symbol}`);
// //     }
// //   };

// //   const unsubscribeFromStock = (symbol) => {
// //     if (socketRef.current && socketRef.current.connected) {
// //       socketRef.current.emit('unsubscribe', symbol);
// //       console.log(`✅ Unsubscribed from ${symbol}`);
// //     }
// //   };

// //   const getChartData = useCallback((symbol, timeframe, callback) => {
// //     if (!socketRef.current || !socketRef.current.connected) {
// //       console.error('❌ WebSocket not connected');
// //       callback({ success: false, error: 'WebSocket not connected' });
// //       return;
// //     }

// //     // Store the callback
// //     chartCallbacksRef.current[symbol] = callback;

// //     // Request chart data
// //     socketRef.current.emit('getChartData', { 
// //       symbol, 
// //       timeframe,
// //       timestamp: new Date().toISOString()
// //     });
    
// //     console.log(`📊 Requesting chart data for ${symbol} (${timeframe})`);
// //   }, []);

// //   return {
// //     subscribeToStock,
// //     unsubscribeFromStock,
// //     getChartData,
// //     socket: socketRef.current
// //   };
// // };
// import { useEffect, useRef, useCallback, useState } from 'react';
// import io from 'socket.io-client';

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// export const useWebSocket = (userId, onStockUpdate) => {
//   const socketRef = useRef(null);
//   const chartCallbacksRef = useRef({});
//   const [isConnected, setIsConnected] = useState(false);

//   // Use useCallback to prevent recreation of functions on every render
//   const handleStockUpdate = useCallback((stockData) => {
//     console.log('📈 Received stock update:', stockData);
//     if (onStockUpdate) {
//       onStockUpdate(stockData);
//     }
//   }, [onStockUpdate]);

//   const handleChartData = useCallback((chartData) => {
//     console.log('📊 Received chart data:', chartData.symbol, chartData.data?.length);
//     const callback = chartCallbacksRef.current[chartData.symbol];
//     if (callback && chartData.data) {
//       callback(chartData);
//     }
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     // Initialize socket connection
//     socketRef.current = io(SOCKET_URL, {
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     const socket = socketRef.current;

//     // Socket event listeners
//     const handleConnect = () => {
//       console.log('✅ Connected to WebSocket server');
//       setIsConnected(true);
      
//       // Authenticate with server
//       socket.emit('authenticate', { userId });
//     };

//     const handleAuthenticated = (data) => {
//       console.log('🔐 Socket authenticated', data);
//     };

//     const handleError = (error) => {
//       console.error('❌ Socket error:', error);
//     };

//     const handleDisconnect = () => {
//       console.log('🔌 Disconnected from WebSocket server');
//       setIsConnected(false);
//     };

//     socket.on('connect', handleConnect);
//     socket.on('authenticated', handleAuthenticated);
//     socket.on('stockPricesUpdate', handleStockUpdate);
//     socket.on('chartData', handleChartData);
//     socket.on('error', handleError);
//     socket.on('disconnect', handleDisconnect);

//     // Cleanup on unmount
//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('authenticated', handleAuthenticated);
//       socket.off('stockPricesUpdate', handleStockUpdate);
//       socket.off('chartData', handleChartData);
//       socket.off('error', handleError);
//       socket.off('disconnect', handleDisconnect);
      
//       if (socket) {
//         socket.disconnect();
//       }
//       chartCallbacksRef.current = {};
//     };
//   }, [userId, handleStockUpdate, handleChartData]);

//   const subscribeToStock = useCallback((symbol) => {
//     if (socketRef.current && socketRef.current.connected) {
//       socketRef.current.emit('subscribe', symbol);
//       console.log(`✅ Subscribed to ${symbol}`);
//     }
//   }, []);

//   const unsubscribeFromStock = useCallback((symbol) => {
//     if (socketRef.current && socketRef.current.connected) {
//       socketRef.current.emit('unsubscribe', symbol);
//       console.log(`✅ Unsubscribed from ${symbol}`);
//     }
//   }, []);

//   const getChartData = useCallback((symbol, timeframe, callback) => {
//     if (!socketRef.current || !socketRef.current.connected) {
//       console.error('❌ WebSocket not connected');
//       callback({ success: false, error: 'WebSocket not connected' });
//       return;
//     }

//     // Store the callback
//     chartCallbacksRef.current[symbol] = callback;

//     // Request chart data
//     socketRef.current.emit('getChartData', { 
//       symbol, 
//       timeframe,
//       timestamp: new Date().toISOString()
//     });
    
//     console.log(`📊 Requesting chart data for ${symbol} (${timeframe})`);
//   }, []);

//   return {
//     subscribeToStock,
//     unsubscribeFromStock,
//     getChartData,
//     socket: socketRef.current,
//     isConnected
//   };
// };
import { useEffect, useRef, useCallback, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useWebSocket = (userId, onStockUpdate) => {
  const socketRef = useRef(null);
  const chartCallbacksRef = useRef({});
  const [isConnected, setIsConnected] = useState(false);

  // Use useCallback to prevent recreation of functions on every render
  const handleStockUpdate = useCallback((stockData) => {
    console.log('📈 Received stock update:', stockData);
    if (onStockUpdate) {
      onStockUpdate(stockData);
    }
  }, [onStockUpdate]);

  const handleChartData = useCallback((chartData) => {
    console.log('📊 Received chart data for:', chartData.symbol, 'Data length:', chartData.data?.length);
    const callback = chartCallbacksRef.current[`${chartData.symbol}_${chartData.timeframe}`];
    if (callback && chartData.data) {
      callback(chartData);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    console.log('🔄 Initializing WebSocket connection...');
    
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Socket event listeners
    const handleConnect = () => {
      console.log('✅ Connected to WebSocket server');
      setIsConnected(true);
      
      // Authenticate with server
      socket.emit('authenticate', { userId });
      console.log('🔐 Sent authentication for user:', userId);
    };

    const handleAuthenticated = (data) => {
      console.log('🔐 Socket authenticated:', data);
    };

    const handleError = (error) => {
      console.error('❌ Socket error:', error);
    };

    const handleDisconnect = (reason) => {
      console.log('🔌 Disconnected from WebSocket server. Reason:', reason);
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('authenticated', handleAuthenticated);
    socket.on('stockPricesUpdate', handleStockUpdate);
    socket.on('chartData', handleChartData);
    socket.on('error', handleError);
    socket.on('disconnect', handleDisconnect);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket...');
      socket.off('connect', handleConnect);
      socket.off('authenticated', handleAuthenticated);
      socket.off('stockPricesUpdate', handleStockUpdate);
      socket.off('chartData', handleChartData);
      socket.off('error', handleError);
      socket.off('disconnect', handleDisconnect);
      
      if (socket) {
        socket.disconnect();
      }
      chartCallbacksRef.current = {};
    };
  }, [userId, handleStockUpdate, handleChartData]);

  const subscribeToStock = useCallback((symbol) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('subscribe', symbol);
      console.log(`✅ Subscribed to ${symbol}`);
    } else {
      console.warn(`⚠️ Cannot subscribe to ${symbol}: WebSocket not connected`);
    }
  }, []);

  const unsubscribeFromStock = useCallback((symbol) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('unsubscribe', symbol);
      console.log(`✅ Unsubscribed from ${symbol}`);
    }
  }, []);

  const getChartData = useCallback((symbol, timeframe, callback) => {
    if (!socketRef.current) {
      console.error('❌ WebSocket instance not available');
      callback({ success: false, error: 'WebSocket not initialized' });
      return;
    }
    
    if (!socketRef.current.connected) {
      console.error('❌ WebSocket not connected. State:', socketRef.current.connected);
      callback({ success: false, error: 'WebSocket not connected' });
      return;
    }

    // Generate a unique key for this request
    const requestKey = `${symbol}_${timeframe}`;
    
    // Store the callback
    chartCallbacksRef.current[requestKey] = callback;

    // Request chart data
    console.log(`📊 Requesting chart data for ${symbol} (${timeframe}) via WebSocket`);
    socketRef.current.emit('getChartData', { 
      symbol, 
      timeframe,
      timestamp: new Date().toISOString()
    });
    
    // Set a timeout to clear the callback if no response
    setTimeout(() => {
      if (chartCallbacksRef.current[requestKey] === callback) {
        console.warn(`⏰ Timeout waiting for chart data for ${symbol}`);
        delete chartCallbacksRef.current[requestKey];
        callback({ success: false, error: 'Timeout waiting for chart data' });
      }
    }, 10000); // 10 second timeout
  }, []);

  return {
    subscribeToStock,
    unsubscribeFromStock,
    getChartData,
    socket: socketRef.current,
    isConnected
  };
};