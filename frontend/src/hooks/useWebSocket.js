import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useWebSocket = (userId, onStockUpdate, onSubscriptionsRestored) => {
  const socketRef = useRef(null);
  const chartCallbacksRef = useRef({});
  const [isConnected, setIsConnected] = useState(false);
  const [restoredSubscriptions, setRestoredSubscriptions] = useState([]);

  // Store callbacks in refs so they don't trigger re-renders
  const callbacksRef = useRef({
    onStockUpdate,
    onSubscriptionsRestored
  });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current.onStockUpdate = onStockUpdate;
    callbacksRef.current.onSubscriptionsRestored = onSubscriptionsRestored;
  }, [onStockUpdate, onSubscriptionsRestored]);

  // Main WebSocket effect - NO dependencies that change on every render
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

    // Define event handlers INSIDE useEffect to avoid dependency issues
    const handleConnect = () => {
      console.log('✅ Connected to WebSocket server');
      setIsConnected(true);
      
      // Authenticate with server
      socket.emit('authenticate', { userId });
      console.log('🔐 Sent authentication for user:', userId);
    };

    const handleAuthenticated = (data) => {
      console.log('🔐 Socket authenticated:', data);
      
      // If server sends stocks with authentication, handle them
      if (data.stocks && data.stocks.length > 0) {
        console.log('🔄 Subscriptions restored from authentication:', data.stocks);
        setRestoredSubscriptions(data.stocks || []);
        
        if (callbacksRef.current.onSubscriptionsRestored && data.stocks.length > 0) {
          callbacksRef.current.onSubscriptionsRestored(data.stocks);
        }
      }
    };

    const handleSubscriptionsRestored = (data) => {
      console.log('🔄 Subscriptions restored from server:', data);
      setRestoredSubscriptions(data.stocks || []);
      
      if (callbacksRef.current.onSubscriptionsRestored && data.stocks && data.stocks.length > 0) {
        callbacksRef.current.onSubscriptionsRestored(data.stocks);
      }
    };

    const handleStockUpdate = (stockData) => {
      console.log('📈 Received stock update:', stockData);
      if (callbacksRef.current.onStockUpdate) {
        callbacksRef.current.onStockUpdate(stockData);
      }
    };

    const handleChartData = (chartData) => {
      console.log('📊 Received chart data for:', chartData.symbol, 'Data length:', chartData.data?.length);
      const callback = chartCallbacksRef.current[`${chartData.symbol}_${chartData.timeframe}`];
      if (callback && chartData.data) {
        callback(chartData);
      }
    };

    const handleError = (error) => {
      console.error('❌ Socket error:', error);
    };

    const handleDisconnect = (reason) => {
      console.log('🔌 Disconnected from WebSocket server. Reason:', reason);
      setIsConnected(false);
    };

    // Add event listeners
    socket.on('connect', handleConnect);
    socket.on('authenticated', handleAuthenticated);
    socket.on('stockPricesUpdate', handleStockUpdate);
    socket.on('chartData', handleChartData);
    socket.on('subscriptions_restored', handleSubscriptionsRestored);
    socket.on('subscribed', (data) => {
      console.log('✅ Subscription confirmed:', data);
    });
    socket.on('unsubscribed', (data) => {
      console.log('✅ Unsubscription confirmed:', data);
    });
    socket.on('subscription_error', (error) => {
      console.error('❌ Subscription error:', error);
    });
    socket.on('error', handleError);
    socket.on('disconnect', handleDisconnect);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket...');
      socket.off('connect', handleConnect);
      socket.off('authenticated', handleAuthenticated);
      socket.off('stockPricesUpdate', handleStockUpdate);
      socket.off('chartData', handleChartData);
      socket.off('subscriptions_restored', handleSubscriptionsRestored);
      socket.off('subscribed');
      socket.off('unsubscribed');
      socket.off('subscription_error');
      socket.off('error', handleError);
      socket.off('disconnect', handleDisconnect);
      
      if (socket) {
        socket.disconnect();
      }
      chartCallbacksRef.current = {};
      setRestoredSubscriptions([]);
      setIsConnected(false);
    };
  }, [userId]); // ONLY userId as dependency - functions are defined inside

  const subscribeToStock = useCallback((symbol) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('subscribe', symbol);
      console.log(`✅ Requested subscription to ${symbol}`);
    } else {
      console.warn(`⚠️ Cannot subscribe to ${symbol}: WebSocket not connected`);
    }
  }, []);

  const unsubscribeFromStock = useCallback((symbol) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('unsubscribe', symbol);
      console.log(`✅ Requested unsubscription from ${symbol}`);
    }
  }, []);

  const initializeSubscriptions = useCallback((subscriptions) => {
    if (!socketRef.current || !socketRef.current.connected) {
      console.warn('⚠️ WebSocket not connected, cannot initialize subscriptions');
      return;
    }
    
    console.log('🔄 Initializing WebSocket subscriptions:', subscriptions);
    subscriptions.forEach(symbol => {
      socketRef.current.emit('subscribe', symbol);
      console.log(`✅ Initialized subscription to ${symbol}`);
    });
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

    const requestKey = `${symbol}_${timeframe}`;
    chartCallbacksRef.current[requestKey] = callback;

    console.log(`📊 Requesting chart data for ${symbol} (${timeframe}) via WebSocket`);
    socketRef.current.emit('getChartData', { 
      symbol, 
      timeframe,
      timestamp: new Date().toISOString()
    });
    
    setTimeout(() => {
      if (chartCallbacksRef.current[requestKey] === callback) {
        console.warn(`⏰ Timeout waiting for chart data for ${symbol}`);
        delete chartCallbacksRef.current[requestKey];
        callback({ success: false, error: 'Timeout waiting for chart data' });
      }
    }, 10000);
  }, []);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    subscribeToStock,
    unsubscribeFromStock,
    initializeSubscriptions,
    getChartData,
    socket: socketRef.current,
    isConnected,
    restoredSubscriptions
  }), [subscribeToStock, unsubscribeFromStock, initializeSubscriptions, getChartData, isConnected, restoredSubscriptions]);
};