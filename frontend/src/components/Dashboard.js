// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { subscriptionAPI, stockAPI } from '../api/api';
// // // // // import { useWebSocket } from '../hooks/useWebSocket';
// // // // // import StockList from './StockList';
// // // // // import SubscriptionManager from './SubscriptionManager';
// // // // // import PortfolioChart from './PortfolioChart';
// // // // // import AdvancedChartDashboard from './AdvancedChartDashboard'; // ⬅️ NEW

// // // // // function Dashboard({ user, onLogout }) {
// // // // //   const [subscriptions, setSubscriptions] = useState([]);
// // // // //   const [stockPrices, setStockPrices] = useState({});
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [error, setError] = useState('');
// // // // //   const [selectedStock, setSelectedStock] = useState(null);

// // // // //   // Initialize WebSocket connection
// // // // //   const { subscribeToStock, unsubscribeFromStock } = useWebSocket(
// // // // //     user.id,
// // // // //     (updatedPrices) => {
// // // // //       setStockPrices(prev => ({ ...prev, ...updatedPrices }));
// // // // //     }
// // // // //   );

// // // // //   // Load user subscriptions
// // // // //   const loadSubscriptions = async () => {
// // // // //     try {
// // // // //       const response = await subscriptionAPI.getUserSubscriptions(user.id);
// // // // //       if (response.data.success) {
// // // // //         const userSubscriptions = response.data.subscriptions.map(sub => sub.symbol);
// // // // //         setSubscriptions(userSubscriptions);

// // // // //         if (userSubscriptions.length > 0 && !selectedStock) {
// // // // //           setSelectedStock(userSubscriptions[0]);
// // // // //         }
// // // // //       }
// // // // //     } catch (err) {
// // // // //       console.error('Failed to load subscriptions:', err);
// // // // //     }
// // // // //   };

// // // // //   // Load initial stock prices
// // // // //   const loadStockPrices = async () => {
// // // // //     try {
// // // // //       const response = await stockAPI.getStockPrices();
// // // // //       if (response.data.success) {
// // // // //         setStockPrices(response.data.prices);
// // // // //       }
// // // // //     } catch (err) {
// // // // //       console.error('Failed to load stock prices:', err);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     const initializeDashboard = async () => {
// // // // //       setLoading(true);
// // // // //       try {
// // // // //         await Promise.all([loadSubscriptions(), loadStockPrices()]);
// // // // //       } catch (err) {
// // // // //         setError('Failed to initialize dashboard');
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };

// // // // //     initializeDashboard();

// // // // //     const pollInterval = setInterval(loadStockPrices, 30000);

// // // // //     return () => clearInterval(pollInterval);
// // // // //   }, [user.id]);

// // // // //   const handleSubscribe = async (symbol) => {
// // // // //     try {
// // // // //       const response = await subscriptionAPI.subscribe(user.id, symbol);
// // // // //       if (response.data.success) {
// // // // //         setSubscriptions(prev => [...prev, symbol]);
// // // // //         subscribeToStock(symbol);

// // // // //         if (!selectedStock) {
// // // // //           setSelectedStock(symbol);
// // // // //         }
// // // // //       }
// // // // //     } catch (err) {
// // // // //       setError(err.response?.data?.error || 'Failed to subscribe');
// // // // //     }
// // // // //   };

// // // // //   const handleUnsubscribe = async (symbol) => {
// // // // //     try {
// // // // //       const response = await subscriptionAPI.unsubscribe(user.id, symbol);
// // // // //       if (response.data.success) {
// // // // //         setSubscriptions(prev => prev.filter(s => s !== symbol));
// // // // //         unsubscribeFromStock(symbol);

// // // // //         if (selectedStock === symbol) {
// // // // //           const remaining = subscriptions.filter(s => s !== symbol);
// // // // //           setSelectedStock(remaining.length > 0 ? remaining[0] : null);
// // // // //         }
// // // // //       }
// // // // //     } catch (err) {
// // // // //       setError(err.response?.data?.error || 'Failed to unsubscribe');
// // // // //     }
// // // // //   };

// // // // //   const handleStockSelect = (symbol) => {
// // // // //     setSelectedStock(symbol);
// // // // //   };

// // // // //   if (loading) {
// // // // //     return <div className="loading">Loading dashboard...</div>;
// // // // //   }

// // // // //   return (
// // // // //     <div className="dashboard">
// // // // //       <header className="header">
// // // // //         <div>
// // // // //           <h1>📈 Real-Time Stock Dashboard</h1>
// // // // //           <p style={{ color: '#666', marginTop: '5px' }}>
// // // // //             Welcome, {user.email} | Real-time charts & analytics
// // // // //           </p>
// // // // //         </div>
// // // // //         <button onClick={onLogout} className="btn btn-secondary">
// // // // //           Logout
// // // // //         </button>
// // // // //       </header>

// // // // //       <div className="container">
// // // // //         {error && <div className="error">{error}</div>}

// // // // //         {/* Subscriptions & Portfolio Chart */}
// // // // //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
// // // // //           <SubscriptionManager
// // // // //             subscriptions={subscriptions}
// // // // //             onSubscribe={handleSubscribe}
// // // // //             onUnsubscribe={handleUnsubscribe}
// // // // //           />

// // // // //           <PortfolioChart
// // // // //             subscriptions={subscriptions}
// // // // //             stockPrices={stockPrices}
// // // // //           />
// // // // //         </div>

// // // // //         {/* Stock Selector */}
// // // // //         {subscriptions.length > 0 && (
// // // // //           <div className="card" style={{ marginBottom: '20px' }}>
// // // // //             <h3>View Detailed Chart</h3>
// // // // //             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
// // // // //               {subscriptions.map(symbol => (
// // // // //                 <button
// // // // //                   key={symbol}
// // // // //                   onClick={() => handleStockSelect(symbol)}
// // // // //                   style={{
// // // // //                     padding: '8px 16px',
// // // // //                     backgroundColor: selectedStock === symbol ? '#007bff' : '#f8f9fa',
// // // // //                     color: selectedStock === symbol ? 'white' : '#333',
// // // // //                     border: `1px solid ${selectedStock === symbol ? '#007bff' : '#dee2e6'}`,
// // // // //                     borderRadius: '20px',
// // // // //                     cursor: 'pointer',
// // // // //                     fontSize: '14px',
// // // // //                     fontWeight: selectedStock === symbol ? '600' : '400',
// // // // //                     transition: 'all 0.3s ease'
// // // // //                   }}
// // // // //                 >
// // // // //                   {symbol}
// // // // //                   {stockPrices[symbol] && (
// // // // //                     <span style={{
// // // // //                       marginLeft: '5px',
// // // // //                       color: selectedStock === symbol ? 'white' :
// // // // //                         (stockPrices[symbol].change >= 0 ? '#28a745' : '#dc3545'),
// // // // //                       fontSize: '12px'
// // // // //                     }}>
// // // // //                       ${stockPrices[symbol].price.toFixed(2)}
// // // // //                     </span>
// // // // //                   )}
// // // // //                 </button>
// // // // //               ))}
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* ============================ */}
// // // // //         {/* 🔥 NEW ADVANCED CHART LOADED */}
// // // // //         {/* ============================ */}
// // // // //         {selectedStock && (
// // // // //           <AdvancedChartDashboard
// // // // //             symbol={selectedStock}
// // // // //             stockPrices={stockPrices}
// // // // //             userId={user.id} // Pass userId here
// // // // //           />
// // // // //         )}

// // // // //         {/* Stock List */}
// // // // //         <StockList
// // // // //           stockPrices={stockPrices}
// // // // //           subscriptions={subscriptions}
// // // // //           onStockSelect={handleStockSelect}
// // // // //         />

// // // // //         {/* Feature Info */}
// // // // //         <div className="card" style={{ marginTop: '20px' }}>
// // // // //           <h3>📊 Chart Features</h3>
// // // // //           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
// // // // //             <div>
// // // // //               <h4>Real-time Updates</h4>
// // // // //               <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
// // // // //                 <li>Prices update every 15 seconds</li>
// // // // //                 <li>Live WebSocket push notifications</li>
// // // // //                 <li>Auto-refresh toggle available</li>
// // // // //               </ul>
// // // // //             </div>
// // // // //             <div>
// // // // //               <h4>Chart Types</h4>
// // // // //               <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
// // // // //                 <li>Line charts for trends</li>
// // // // //                 <li>Area charts for volume</li>
// // // // //                 <li>Candlestick for OHLC data</li>
// // // // //               </ul>
// // // // //             </div>
// // // // //             <div>
// // // // //               <h4>Timeframes</h4>
// // // // //               <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
// // // // //                 <li>5-minute intervals</li>
// // // // //                 <li>15-minute intervals</li>
// // // // //                 <li>1-hour aggregations</li>
// // // // //                 <li>24-hour overview</li>
// // // // //               </ul>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default Dashboard;

// // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // import { subscriptionAPI, stockAPI } from '../api/api';
// // // // import { useWebSocket } from '../hooks/useWebSocket';
// // // // import StockList from './StockList';
// // // // import SubscriptionManager from './SubscriptionManager';
// // // // import PortfolioChart from './PortfolioChart';
// // // // import AdvancedChartDashboard from './AdvancedChartDashboard';

// // // // function Dashboard({ user, onLogout }) {
// // // //   const [subscriptions, setSubscriptions] = useState([]);
// // // //   const [stockPrices, setStockPrices] = useState({});
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState('');
// // // //   const [selectedStock, setSelectedStock] = useState(null);
// // // //   const [hasInitializedSubscriptions, setHasInitializedSubscriptions] = useState(false);

// // // //   // Initialize WebSocket connection
// // // //   const { subscribeToStock, unsubscribeFromStock, isConnected } = useWebSocket(
// // // //     user.id,
// // // //     (updatedPrices) => {
// // // //       console.log('📈 WebSocket update received:', updatedPrices);
// // // //       setStockPrices(prev => ({ ...prev, ...updatedPrices }));
// // // //     }
// // // //   );

// // // //   // Load user subscriptions from database (PERSISTENT)
// // // //   const loadSubscriptions = async () => {
// // // //     try {
// // // //       console.log('🔄 Loading persistent subscriptions for user:', user.id);
// // // //       const response = await subscriptionAPI.getUserSubscriptions(user.id);
      
// // // //       if (response.data.success) {
// // // //         const userSubscriptions = response.data.subscriptions.map(sub => sub.symbol);
// // // //         console.log('✅ Loaded persistent subscriptions:', userSubscriptions);
        
// // // //         // Set the subscriptions in state
// // // //         setSubscriptions(userSubscriptions);
        
// // // //         // Select first stock if none selected
// // // //         if (userSubscriptions.length > 0 && !selectedStock) {
// // // //           setSelectedStock(userSubscriptions[0]);
// // // //         }
        
// // // //         return userSubscriptions; // Return for WebSocket initialization
// // // //       }
// // // //     } catch (err) {
// // // //       console.error('❌ Failed to load subscriptions:', err);
// // // //       setError('Failed to load your subscriptions. Please refresh.');
// // // //     }
// // // //     return [];
// // // //   };

// // // //   // Load initial stock prices
// // // //   const loadStockPrices = async () => {
// // // //     try {
// // // //       const response = await stockAPI.getStockPrices();
// // // //       if (response.data.success) {
// // // //         setStockPrices(response.data.prices);
// // // //       }
// // // //     } catch (err) {
// // // //       console.error('Failed to load stock prices:', err);
// // // //     }
// // // //   };

// // // //   // Initialize WebSocket subscriptions for persistent subscriptions
// // // //   const initializeWebSocketSubscriptions = useCallback((subscriptionSymbols) => {
// // // //     if (!isConnected) {
// // // //       console.log('⚠️ WebSocket not connected yet, will retry...');
// // // //       setTimeout(() => {
// // // //         if (isConnected && subscriptionSymbols.length > 0) {
// // // //           subscriptionSymbols.forEach(symbol => {
// // // //             subscribeToStock(symbol);
// // // //             console.log(`✅ Re-subscribed to ${symbol} via WebSocket`);
// // // //           });
// // // //         }
// // // //       }, 2000);
// // // //       return;
// // // //     }

// // // //     // Subscribe to all persistent subscriptions in WebSocket
// // // //     if (subscriptionSymbols.length > 0) {
// // // //       console.log('🔗 Initializing WebSocket subscriptions for:', subscriptionSymbols);
// // // //       subscriptionSymbols.forEach(symbol => {
// // // //         subscribeToStock(symbol);
// // // //         console.log(`✅ Subscribed to ${symbol} via WebSocket`);
// // // //       });
// // // //       setHasInitializedSubscriptions(true);
// // // //     }
// // // //   }, [isConnected, subscribeToStock]);

// // // //   // Main initialization effect
// // // //   useEffect(() => {
// // // //     const initializeDashboard = async () => {
// // // //       setLoading(true);
// // // //       try {
// // // //         // Load both subscriptions and prices in parallel
// // // //         const [subscriptionSymbols] = await Promise.all([
// // // //           loadSubscriptions(),
// // // //           loadStockPrices()
// // // //         ]);
        
// // // //         // Initialize WebSocket subscriptions after loading
// // // //         if (subscriptionSymbols.length > 0) {
// // // //           initializeWebSocketSubscriptions(subscriptionSymbols);
// // // //         }
        
// // // //       } catch (err) {
// // // //         console.error('Failed to initialize dashboard:', err);
// // // //         setError('Failed to load dashboard data. Please try again.');
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     initializeDashboard();

// // // //     // Poll for price updates every 30 seconds
// // // //     const pollInterval = setInterval(loadStockPrices, 30000);

// // // //     return () => clearInterval(pollInterval);
// // // //   }, [user.id]);

// // // //   // Handle WebSocket connection changes
// // // //   useEffect(() => {
// // // //     if (isConnected && subscriptions.length > 0 && !hasInitializedSubscriptions) {
// // // //       console.log('🔄 WebSocket connected, initializing subscriptions...');
// // // //       initializeWebSocketSubscriptions(subscriptions);
// // // //     }
// // // //   }, [isConnected, subscriptions, hasInitializedSubscriptions, initializeWebSocketSubscriptions]);

// // // //   const handleSubscribe = async (symbol) => {
// // // //     try {
// // // //       const response = await subscriptionAPI.subscribe(user.id, symbol);
// // // //       if (response.data.success) {
// // // //         // Update local state
// // // //         setSubscriptions(prev => {
// // // //           const newSubscriptions = [...prev, symbol];
// // // //           console.log('📝 Added subscription:', symbol, 'Total:', newSubscriptions);
// // // //           return newSubscriptions;
// // // //         });
        
// // // //         // Subscribe via WebSocket
// // // //         subscribeToStock(symbol);
// // // //         console.log(`✅ WebSocket subscribed to ${symbol}`);

// // // //         // Select this stock if none selected
// // // //         if (!selectedStock) {
// // // //           setSelectedStock(symbol);
// // // //         }
        
// // // //         setError('');
// // // //       }
// // // //     } catch (err) {
// // // //       const errorMsg = err.response?.data?.error || 'Failed to subscribe';
// // // //       console.error('Subscription error:', errorMsg);
// // // //       setError(errorMsg);
// // // //     }
// // // //   };

// // // //   const handleUnsubscribe = async (symbol) => {
// // // //     try {
// // // //       const response = await subscriptionAPI.unsubscribe(user.id, symbol);
// // // //       if (response.data.success) {
// // // //         // Update local state
// // // //         setSubscriptions(prev => {
// // // //           const newSubscriptions = prev.filter(s => s !== symbol);
// // // //           console.log('📝 Removed subscription:', symbol, 'Remaining:', newSubscriptions);
// // // //           return newSubscriptions;
// // // //         });
        
// // // //         // Unsubscribe via WebSocket
// // // //         unsubscribeFromStock(symbol);
// // // //         console.log(`✅ WebSocket unsubscribed from ${symbol}`);

// // // //         // Update selected stock if it was the one unsubscribed
// // // //         if (selectedStock === symbol) {
// // // //           const remaining = subscriptions.filter(s => s !== symbol);
// // // //           setSelectedStock(remaining.length > 0 ? remaining[0] : null);
// // // //         }
        
// // // //         setError('');
// // // //       }
// // // //     } catch (err) {
// // // //       const errorMsg = err.response?.data?.error || 'Failed to unsubscribe';
// // // //       console.error('Unsubscription error:', errorMsg);
// // // //       setError(errorMsg);
// // // //     }
// // // //   };

// // // //   const handleStockSelect = (symbol) => {
// // // //     console.log('📊 Selected stock for detailed view:', symbol);
// // // //     setSelectedStock(symbol);
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="loading" style={{
// // // //         display: 'flex',
// // // //         justifyContent: 'center',
// // // //         alignItems: 'center',
// // // //         height: '100vh',
// // // //         flexDirection: 'column',
// // // //         gap: '20px'
// // // //       }}>
// // // //         <div className="spinner"></div>
// // // //         <h2>Loading Your Dashboard...</h2>
// // // //         <p style={{ color: '#666' }}>
// // // //           Restoring your subscribed stocks and loading real-time data
// // // //         </p>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="dashboard">
// // // //       <header className="header">
// // // //         <div>
// // // //           <h1>📈 Real-Time Stock Dashboard</h1>
// // // //           <div style={{ marginTop: '5px' }}>
// // // //             <p style={{ color: '#666', marginBottom: '5px' }}>
// // // //               Welcome back, {user.email}
// // // //             </p>
// // // //             <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px' }}>
// // // //               <span style={{ 
// // // //                 padding: '4px 10px', 
// // // //                 borderRadius: '12px', 
// // // //                 backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
// // // //                 color: isConnected ? '#155724' : '#721c24'
// // // //               }}>
// // // //                 {isConnected ? '✅ WebSocket Connected' : '⚠️ Connecting...'}
// // // //               </span>
// // // //               <span style={{ color: '#666' }}>
// // // //                 {subscriptions.length} subscribed stocks • Last login: {new Date().toLocaleDateString()}
// // // //               </span>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //         <button onClick={onLogout} className="btn btn-secondary">
// // // //           Logout
// // // //         </button>
// // // //       </header>

// // // //       <div className="container">
// // // //         {error && (
// // // //           <div className="error" style={{
// // // //             backgroundColor: '#f8d7da',
// // // //             color: '#721c24',
// // // //             padding: '15px',
// // // //             borderRadius: '8px',
// // // //             marginBottom: '20px',
// // // //             display: 'flex',
// // // //             justifyContent: 'space-between',
// // // //             alignItems: 'center'
// // // //           }}>
// // // //             <span>{error}</span>
// // // //             <button 
// // // //               onClick={() => setError('')}
// // // //               style={{ background: 'none', border: 'none', color: '#721c24', cursor: 'pointer' }}
// // // //             >
// // // //               ✕
// // // //             </button>
// // // //           </div>
// // // //         )}

// // // //         {/* Welcome message for returning users */}
// // // //         {subscriptions.length > 0 && (
// // // //           <div className="card" style={{ 
// // // //             backgroundColor: '#e8f4fd', 
// // // //             borderColor: '#007bff',
// // // //             marginBottom: '20px'
// // // //           }}>
// // // //             <h3 style={{ color: '#007bff' }}>👋 Welcome Back!</h3>
// // // //             <p style={{ color: '#666', marginTop: '10px' }}>
// // // //               Your {subscriptions.length} subscribed stocks have been restored. 
// // // //               You're receiving real-time updates for: {subscriptions.join(', ')}
// // // //             </p>
// // // //           </div>
// // // //         )}

// // // //         {/* Subscriptions & Portfolio Chart */}
// // // //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
// // // //           <SubscriptionManager
// // // //             subscriptions={subscriptions}
// // // //             onSubscribe={handleSubscribe}
// // // //             onUnsubscribe={handleUnsubscribe}
// // // //           />

// // // //           <PortfolioChart
// // // //             subscriptions={subscriptions}
// // // //             stockPrices={stockPrices}
// // // //           />
// // // //         </div>

// // // //         {/* Stock Selector for Detailed Charts */}
// // // //         {subscriptions.length > 0 && (
// // // //           <div className="card" style={{ marginBottom: '20px' }}>
// // // //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // // //               <h3>View Detailed Chart</h3>
// // // //               <span style={{ fontSize: '14px', color: '#666' }}>
// // // //                 Click on any stock for detailed analysis
// // // //               </span>
// // // //             </div>
// // // //             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
// // // //               {subscriptions.map(symbol => (
// // // //                 <button
// // // //                   key={symbol}
// // // //                   onClick={() => handleStockSelect(symbol)}
// // // //                   style={{
// // // //                     padding: '10px 18px',
// // // //                     backgroundColor: selectedStock === symbol ? '#007bff' : '#f8f9fa',
// // // //                     color: selectedStock === symbol ? 'white' : '#333',
// // // //                     border: `2px solid ${selectedStock === symbol ? '#007bff' : '#dee2e6'}`,
// // // //                     borderRadius: '25px',
// // // //                     cursor: 'pointer',
// // // //                     fontSize: '14px',
// // // //                     fontWeight: selectedStock === symbol ? '600' : '400',
// // // //                     transition: 'all 0.3s ease',
// // // //                     display: 'flex',
// // // //                     alignItems: 'center',
// // // //                     gap: '8px'
// // // //                   }}
// // // //                 >
// // // //                   <span>{symbol}</span>
// // // //                   {stockPrices[symbol] && (
// // // //                     <span style={{
// // // //                       color: selectedStock === symbol ? 'white' :
// // // //                         (stockPrices[symbol].change >= 0 ? '#28a745' : '#dc3545'),
// // // //                       fontSize: '12px',
// // // //                       fontWeight: 'bold'
// // // //                     }}>
// // // //                       ${stockPrices[symbol].price.toFixed(2)}
// // // //                     </span>
// // // //                   )}
// // // //                   {selectedStock === symbol && (
// // // //                     <span style={{ fontSize: '12px' }}>▶️</span>
// // // //                   )}
// // // //                 </button>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Advanced Chart Dashboard */}
// // // //         {selectedStock && (
// // // //           <AdvancedChartDashboard
// // // //             symbol={selectedStock}
// // // //             stockPrices={stockPrices}
// // // //             userId={user.id}
// // // //           />
// // // //         )}

// // // //         {/* Stock List - Shows only subscribed stocks */}
// // // //         <StockList
// // // //           stockPrices={stockPrices}
// // // //           subscriptions={subscriptions}
// // // //           onStockSelect={handleStockSelect}
// // // //         />

// // // //         {/* Dashboard Status */}
// // // //         <div className="card" style={{ marginTop: '20px' }}>
// // // //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // // //             <div>
// // // //               <h3>📊 Dashboard Status</h3>
// // // //               <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '14px' }}>
// // // //                 <div>
// // // //                   <span style={{ color: '#666' }}>Subscriptions: </span>
// // // //                   <strong>{subscriptions.length}</strong>
// // // //                 </div>
// // // //                 <div>
// // // //                   <span style={{ color: '#666' }}>WebSocket: </span>
// // // //                   <strong style={{ color: isConnected ? '#28a745' : '#dc3545' }}>
// // // //                     {isConnected ? 'Connected' : 'Disconnected'}
// // // //                   </strong>
// // // //                 </div>
// // // //                 <div>
// // // //                   <span style={{ color: '#666' }}>Last Updated: </span>
// // // //                   <strong>{new Date().toLocaleTimeString()}</strong>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //             <button 
// // // //               onClick={() => {
// // // //                 loadSubscriptions();
// // // //                 loadStockPrices();
// // // //               }}
// // // //               className="btn"
// // // //               style={{ padding: '8px 16px', fontSize: '14px' }}
// // // //             >
// // // //               🔄 Refresh Data
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {/* Feature Info */}
// // // //         <div className="card" style={{ marginTop: '20px' }}>
// // // //           <h3>📈 How It Works</h3>
// // // //           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
// // // //             <div>
// // // //               <h4 style={{ color: '#007bff' }}>💾 Persistent Subscriptions</h4>
// // // //               <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#666' }}>
// // // //                 <li>Your subscriptions are saved to our database</li>
// // // //                 <li>They automatically restore when you log back in</li>
// // // //                 <li>No need to re-subscribe after logout</li>
// // // //               </ul>
// // // //             </div>
// // // //             <div>
// // // //               <h4 style={{ color: '#28a745' }}>⚡ Real-time Updates</h4>
// // // //               <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#666' }}>
// // // //                 <li>WebSocket connection for live data</li>
// // // //                 <li>Prices update every 15 seconds</li>
// // // //                 <li>Instant notifications for price changes</li>
// // // //               </ul>
// // // //             </div>
// // // //             <div>
// // // //               <h4 style={{ color: '#ff6b6b' }}>📊 Advanced Charts</h4>
// // // //               <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#666' }}>
// // // //                 <li>Multiple chart types available</li>
// // // //                 <li>Historical data analysis</li>
// // // //                 <li>Custom timeframes</li>
// // // //               </ul>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default Dashboard;
// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import { subscriptionAPI, stockAPI } from '../api/api';
// // // import { useWebSocket } from '../hooks/useWebSocket';
// // // import StockList from './StockList';
// // // import SubscriptionManager from './SubscriptionManager';
// // // import PortfolioChart from './PortfolioChart';
// // // import AdvancedChartDashboard from './AdvancedChartDashboard';

// // // function Dashboard({ user, onLogout }) {
// // //   const [subscriptions, setSubscriptions] = useState([]);
// // //   const [stockPrices, setStockPrices] = useState({});
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState('');
// // //   const [selectedStock, setSelectedStock] = useState(null);
// // //   const [hasInitializedWS, setHasInitializedWS] = useState(false);

// // //   // Initialize WebSocket with subscription restoration callback
// // //   const { 
// // //     subscribeToStock, 
// // //     unsubscribeFromStock, 
// // //     initializeSubscriptions,
// // //     isConnected,
// // //     restoredSubscriptions 
// // //   } = useWebSocket(
// // //     user.id,
// // //     // Stock update callback
// // //     (updatedPrices) => {
// // //       console.log('📈 WebSocket update received:', updatedPrices);
// // //       setStockPrices(prev => ({ ...prev, ...updatedPrices }));
// // //     },
// // //     // Subscription restoration callback (NEW)
// // //     (restoredStocks) => {
// // //       console.log('🔄 WebSocket restored subscriptions:', restoredStocks);
// // //       if (restoredStocks && restoredStocks.length > 0) {
// // //         // Merge with existing subscriptions
// // //         setSubscriptions(prev => {
// // //           const merged = [...new Set([...prev, ...restoredStocks])];
// // //           console.log('Merged subscriptions from WebSocket:', merged);
// // //           return merged;
// // //         });
        
// // //         // Select first stock if none selected
// // //         if (!selectedStock && restoredStocks.length > 0) {
// // //           setSelectedStock(restoredStocks[0]);
// // //         }
// // //       }
// // //     }
// // //   );

// // //   // Load user subscriptions from database
// // //   const loadSubscriptions = async () => {
// // //     try {
// // //       console.log('🔄 Loading persistent subscriptions for user:', user.id);
// // //       const response = await subscriptionAPI.getUserSubscriptions(user.id);
      
// // //       if (response.data.success) {
// // //         const userSubscriptions = response.data.subscriptions.map(sub => sub.symbol);
// // //         console.log('✅ Loaded from database:', userSubscriptions);
// // //         return userSubscriptions;
// // //       }
// // //     } catch (err) {
// // //       console.error('❌ Failed to load subscriptions:', err);
// // //       setError('Failed to load your subscriptions. Please refresh.');
// // //     }
// // //     return [];
// // //   };

// // //   // Load initial stock prices
// // //   const loadStockPrices = async () => {
// // //     try {
// // //       const response = await stockAPI.getStockPrices();
// // //       if (response.data.success) {
// // //         setStockPrices(response.data.prices);
// // //       }
// // //     } catch (err) {
// // //       console.error('Failed to load stock prices:', err);
// // //     }
// // //   };

// // //   // Main initialization effect
// // //   useEffect(() => {
// // //     const initializeDashboard = async () => {
// // //       setLoading(true);
// // //       try {
// // //         // Load both subscriptions and prices
// // //         const [dbSubscriptions] = await Promise.all([
// // //           loadSubscriptions(),
// // //           loadStockPrices()
// // //         ]);
        
// // //         // Set subscriptions from database
// // //         setSubscriptions(dbSubscriptions);
        
// // //         // Select first stock if none selected
// // //         if (dbSubscriptions.length > 0 && !selectedStock) {
// // //           setSelectedStock(dbSubscriptions[0]);
// // //         }
        
// // //         console.log('✅ Dashboard initialized with DB subscriptions:', dbSubscriptions);
        
// // //       } catch (err) {
// // //         console.error('Failed to initialize dashboard:', err);
// // //         setError('Failed to load dashboard data. Please try again.');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     initializeDashboard();

// // //     // Poll for price updates every 30 seconds
// // //     const pollInterval = setInterval(loadStockPrices, 30000);
// // //     return () => clearInterval(pollInterval);
// // //   }, [user.id]);

// // //   // Initialize WebSocket subscriptions when connected AND we have subscriptions
// // //   useEffect(() => {
// // //     if (isConnected && subscriptions.length > 0 && !hasInitializedWS) {
// // //       console.log('🔄 Initializing WebSocket subscriptions for:', subscriptions);
// // //       initializeSubscriptions(subscriptions);
// // //       setHasInitializedWS(true);
// // //     }
// // //   }, [isConnected, subscriptions, hasInitializedWS, initializeSubscriptions]);

// // //   // Handle subscribe button
// // //   const handleSubscribe = async (symbol) => {
// // //     try {
// // //       // 1. Add to database via HTTP API
// // //       const response = await subscriptionAPI.subscribe(user.id, symbol);
// // //       if (response.data.success) {
// // //         // 2. Update local state
// // //         setSubscriptions(prev => {
// // //           const newSubscriptions = [...prev, symbol];
// // //           console.log('📝 Added subscription:', symbol, 'Total:', newSubscriptions);
// // //           return newSubscriptions;
// // //         });
        
// // //         // 3. Subscribe via WebSocket
// // //         subscribeToStock(symbol);
// // //         console.log(`✅ WebSocket subscribed to ${symbol}`);

// // //         // 4. Select this stock if none selected
// // //         if (!selectedStock) {
// // //           setSelectedStock(symbol);
// // //         }
        
// // //         setError('');
// // //       }
// // //     } catch (err) {
// // //       const errorMsg = err.response?.data?.error || 'Failed to subscribe';
// // //       console.error('Subscription error:', errorMsg);
// // //       setError(errorMsg);
// // //     }
// // //   };

// // //   // Handle unsubscribe button
// // //   const handleUnsubscribe = async (symbol) => {
// // //     try {
// // //       // 1. Remove from database via HTTP API
// // //       const response = await subscriptionAPI.unsubscribe(user.id, symbol);
// // //       if (response.data.success) {
// // //         // 2. Update local state
// // //         setSubscriptions(prev => {
// // //           const newSubscriptions = prev.filter(s => s !== symbol);
// // //           console.log('📝 Removed subscription:', symbol, 'Remaining:', newSubscriptions);
// // //           return newSubscriptions;
// // //         });
        
// // //         // 3. Unsubscribe via WebSocket
// // //         unsubscribeFromStock(symbol);
// // //         console.log(`✅ WebSocket unsubscribed from ${symbol}`);

// // //         // 4. Update selected stock if it was the one unsubscribed
// // //         if (selectedStock === symbol) {
// // //           const remaining = subscriptions.filter(s => s !== symbol);
// // //           setSelectedStock(remaining.length > 0 ? remaining[0] : null);
// // //         }
        
// // //         setError('');
// // //       }
// // //     } catch (err) {
// // //       const errorMsg = err.response?.data?.error || 'Failed to unsubscribe';
// // //       console.error('Unsubscription error:', errorMsg);
// // //       setError(errorMsg);
// // //     }
// // //   };

// // //   const handleStockSelect = (symbol) => {
// // //     console.log('📊 Selected stock for detailed view:', symbol);
// // //     setSelectedStock(symbol);
// // //   };

// // //   // Show loading state
// // //   if (loading) {
// // //     return (
// // //       <div className="loading" style={{
// // //         display: 'flex',
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         height: '100vh',
// // //         flexDirection: 'column',
// // //         gap: '20px'
// // //       }}>
// // //         <div className="spinner"></div>
// // //         <h2>Loading Your Dashboard...</h2>
// // //         <p style={{ color: '#666' }}>
// // //           Restoring your subscribed stocks and loading real-time data
// // //         </p>
// // //       </div>
// // //     );
// // //   }

// // //   // Show connection status
// // //   const connectionStatus = isConnected ? '✅ Connected' : '⚠️ Connecting...';
// // //   const connectionColor = isConnected ? '#28a745' : '#dc3545';

// // //   return (
// // //     <div className="dashboard">
// // //       <header className="header">
// // //         <div>
// // //           <h1>📈 Real-Time Stock Dashboard</h1>
// // //           <div style={{ marginTop: '5px' }}>
// // //             <p style={{ color: '#666', marginBottom: '5px' }}>
// // //               Welcome back, {user.email}
// // //             </p>
// // //             <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px' }}>
// // //               <span style={{ 
// // //                 padding: '4px 10px', 
// // //                 borderRadius: '12px', 
// // //                 backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
// // //                 color: isConnected ? '#155724' : '#721c24'
// // //               }}>
// // //                 {connectionStatus}
// // //               </span>
// // //               <span style={{ color: '#666' }}>
// // //                 {subscriptions.length} subscribed stocks
// // //               </span>
// // //               {restoredSubscriptions && restoredSubscriptions.length > 0 && (
// // //                 <span style={{ color: '#007bff', fontSize: '12px' }}>
// // //                   ({restoredSubscriptions.length} restored via WebSocket)
// // //                 </span>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <button onClick={onLogout} className="btn btn-secondary">
// // //           Logout
// // //         </button>
// // //       </header>

// // //       <div className="container">
// // //         {error && (
// // //           <div className="error" style={{
// // //             backgroundColor: '#f8d7da',
// // //             color: '#721c24',
// // //             padding: '15px',
// // //             borderRadius: '8px',
// // //             marginBottom: '20px',
// // //             display: 'flex',
// // //             justifyContent: 'space-between',
// // //             alignItems: 'center'
// // //           }}>
// // //             <span>{error}</span>
// // //             <button 
// // //               onClick={() => setError('')}
// // //               style={{ background: 'none', border: 'none', color: '#721c24', cursor: 'pointer' }}
// // //             >
// // //               ✕
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Welcome message with subscription info */}
// // //         <div className="card" style={{ 
// // //           backgroundColor: '#e8f4fd', 
// // //           borderColor: '#007bff',
// // //           marginBottom: '20px'
// // //         }}>
// // //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // //             <div>
// // //               <h3 style={{ color: '#007bff', marginBottom: '10px' }}>
// // //                 {subscriptions.length === 0 ? '👋 Welcome!' : '👋 Welcome Back!'}
// // //               </h3>
// // //               <p style={{ color: '#666' }}>
// // //                 {subscriptions.length === 0 
// // //                   ? 'Subscribe to stocks to start receiving real-time updates.'
// // //                   : `Your ${subscriptions.length} subscribed stocks have been restored.`
// // //                 }
// // //               </p>
// // //             </div>
// // //             <div style={{ textAlign: 'right' }}>
// // //               <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
// // //                 WebSocket: <span style={{ color: connectionColor, fontWeight: 'bold' }}>
// // //                   {connectionStatus}
// // //                 </span>
// // //               </div>
// // //               {hasInitializedWS && (
// // //                 <div style={{ fontSize: '12px', color: '#28a745' }}>
// // //                   ✓ Subscriptions initialized
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
          
// // //           {subscriptions.length > 0 && (
// // //             <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
// // //               <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
// // //                 Subscribed stocks:
// // //               </div>
// // //               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
// // //                 {subscriptions.map(symbol => (
// // //                   <span 
// // //                     key={symbol}
// // //                     style={{
// // //                       padding: '4px 10px',
// // //                       backgroundColor: '#007bff',
// // //                       color: 'white',
// // //                       borderRadius: '15px',
// // //                       fontSize: '12px',
// // //                       fontWeight: '600'
// // //                     }}
// // //                   >
// // //                     {symbol}
// // //                   </span>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Subscriptions & Portfolio Chart */}
// // //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
// // //           <SubscriptionManager
// // //             subscriptions={subscriptions}
// // //             onSubscribe={handleSubscribe}
// // //             onUnsubscribe={handleUnsubscribe}
// // //           />

// // //           <PortfolioChart
// // //             subscriptions={subscriptions}
// // //             stockPrices={stockPrices}
// // //           />
// // //         </div>

// // //         {/* Stock Selector for Detailed Charts */}
// // //         {subscriptions.length > 0 && (
// // //           <div className="card" style={{ marginBottom: '20px' }}>
// // //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
// // //               <h3>View Detailed Chart</h3>
// // //               <span style={{ fontSize: '14px', color: '#666' }}>
// // //                 Click on any stock for detailed analysis
// // //               </span>
// // //             </div>
// // //             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
// // //               {subscriptions.map(symbol => (
// // //                 <button
// // //                   key={symbol}
// // //                   onClick={() => handleStockSelect(symbol)}
// // //                   style={{
// // //                     padding: '10px 18px',
// // //                     backgroundColor: selectedStock === symbol ? '#007bff' : '#f8f9fa',
// // //                     color: selectedStock === symbol ? 'white' : '#333',
// // //                     border: `2px solid ${selectedStock === symbol ? '#007bff' : '#dee2e6'}`,
// // //                     borderRadius: '25px',
// // //                     cursor: 'pointer',
// // //                     fontSize: '14px',
// // //                     fontWeight: selectedStock === symbol ? '600' : '400',
// // //                     transition: 'all 0.3s ease',
// // //                     display: 'flex',
// // //                     alignItems: 'center',
// // //                     gap: '8px'
// // //                   }}
// // //                 >
// // //                   <span>{symbol}</span>
// // //                   {stockPrices[symbol] && (
// // //                     <span style={{
// // //                       color: selectedStock === symbol ? 'white' :
// // //                         (stockPrices[symbol].change >= 0 ? '#28a745' : '#dc3545'),
// // //                       fontSize: '12px',
// // //                       fontWeight: 'bold'
// // //                     }}>
// // //                       ${stockPrices[symbol].price.toFixed(2)}
// // //                     </span>
// // //                   )}
// // //                   {selectedStock === symbol && (
// // //                     <span style={{ fontSize: '12px' }}>▶️</span>
// // //                   )}
// // //                 </button>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Advanced Chart Dashboard */}
// // //         {selectedStock && (
// // //           <AdvancedChartDashboard
// // //             symbol={selectedStock}
// // //             stockPrices={stockPrices}
// // //             userId={user.id}
// // //           />
// // //         )}

// // //         {/* Stock List - Shows only subscribed stocks */}
// // //         <StockList
// // //           stockPrices={stockPrices}
// // //           subscriptions={subscriptions}
// // //           onStockSelect={handleStockSelect}
// // //         />

// // //         {/* Debug info - can remove in production */}
// // //         <div className="card" style={{ marginTop: '20px', backgroundColor: '#f8f9fa', fontSize: '12px' }}>
// // //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // //             <div>
// // //               <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Debug Info</h4>
// // //               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
// // //                 <div>
// // //                   <div style={{ color: '#666' }}>User ID:</div>
// // //                   <div style={{ fontWeight: 'bold' }}>{user.id}</div>
// // //                 </div>
// // //                 <div>
// // //                   <div style={{ color: '#666' }}>Subscriptions:</div>
// // //                   <div style={{ fontWeight: 'bold' }}>{subscriptions.length}</div>
// // //                 </div>
// // //                 <div>
// // //                   <div style={{ color: '#666' }}>WebSocket:</div>
// // //                   <div style={{ fontWeight: 'bold', color: connectionColor }}>{isConnected ? 'Connected' : 'Disconnected'}</div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //             <button 
// // //               onClick={() => {
// // //                 setHasInitializedWS(false);
// // //                 loadSubscriptions();
// // //                 loadStockPrices();
// // //               }}
// // //               className="btn"
// // //               style={{ padding: '6px 12px', fontSize: '12px' }}
// // //             >
// // //               🔄 Refresh All
// // //             </button>
// // //           </div>
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default Dashboard;
// // import React, { useState, useEffect, useCallback } from 'react';
// // import { subscriptionAPI, stockAPI } from '../api/api';
// // import { useWebSocket } from '../hooks/useWebSocket';
// // import StockList from './StockList';
// // import SubscriptionManager from './SubscriptionManager';
// // import PortfolioChart from './PortfolioChart';
// // import AdvancedChartDashboard from './AdvancedChartDashboard';

// // function Dashboard({ user, onLogout }) {
// //   const [subscriptions, setSubscriptions] = useState([]);
// //   const [stockPrices, setStockPrices] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [selectedStock, setSelectedStock] = useState(null);
// //   const [hasInitializedWS, setHasInitializedWS] = useState(false);
// //   const [debugLogs, setDebugLogs] = useState([]);

// //   const addDebugLog = useCallback((message) => {
// //     console.log(`🔍 DEBUG: ${message}`);
// //     setDebugLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
// //   }, []);

// //   // Initialize WebSocket with subscription restoration callback
// //   const { 
// //     subscribeToStock, 
// //     unsubscribeFromStock, 
// //     initializeSubscriptions,
// //     isConnected,
// //     restoredSubscriptions 
// //   } = useWebSocket(
// //     user.id,
// //     // Stock update callback
// //     (updatedPrices) => {
// //       addDebugLog(`WebSocket stock update: ${Object.keys(updatedPrices).join(', ')}`);
// //       setStockPrices(prev => ({ ...prev, ...updatedPrices }));
// //     },
// //     // Subscription restoration callback
// //     (restoredStocks) => {
// //       addDebugLog(`WebSocket restored subscriptions: ${restoredStocks?.join(', ') || 'none'}`);
// //       if (restoredStocks && restoredStocks.length > 0) {
// //         setSubscriptions(prev => {
// //           const merged = [...new Set([...prev, ...restoredStocks])];
// //           addDebugLog(`Merged subscriptions: ${merged.join(', ')}`);
// //           return merged;
// //         });
        
// //         if (!selectedStock && restoredStocks.length > 0) {
// //           setSelectedStock(restoredStocks[0]);
// //         }
// //       }
// //     }
// //   );

// //   // Load user subscriptions from database
// //   const loadSubscriptions = async () => {
// //     try {
// //       addDebugLog(`Loading subscriptions from DB for user: ${user.id}`);
// //       const response = await subscriptionAPI.getUserSubscriptions(user.id);
      
// //       if (response.data.success) {
// //         const userSubscriptions = response.data.subscriptions.map(sub => sub.symbol);
// //         addDebugLog(`Loaded from DB: ${userSubscriptions.join(', ') || 'none'}`);
// //         return userSubscriptions;
// //       }
// //     } catch (err) {
// //       addDebugLog(`Failed to load subscriptions: ${err.message}`);
// //       setError('Failed to load your subscriptions. Please refresh.');
// //     }
// //     return [];
// //   };

// //   // Load initial stock prices
// //   const loadStockPrices = async () => {
// //     try {
// //       const response = await stockAPI.getStockPrices();
// //       if (response.data.success) {
// //         setStockPrices(response.data.prices);
// //         addDebugLog(`Loaded ${Object.keys(response.data.prices).length} stock prices`);
// //       }
// //     } catch (err) {
// //       addDebugLog(`Failed to load stock prices: ${err.message}`);
// //     }
// //   };

// //   // Main initialization effect
// //   useEffect(() => {
// //     const initializeDashboard = async () => {
// //       setLoading(true);
// //       addDebugLog('Starting dashboard initialization...');
// //       try {
// //         const [dbSubscriptions] = await Promise.all([
// //           loadSubscriptions(),
// //           loadStockPrices()
// //         ]);
        
// //         addDebugLog(`Setting subscriptions from DB: ${dbSubscriptions.join(', ')}`);
// //         setSubscriptions(dbSubscriptions);
        
// //         if (dbSubscriptions.length > 0 && !selectedStock) {
// //           setSelectedStock(dbSubscriptions[0]);
// //           addDebugLog(`Selected first stock: ${dbSubscriptions[0]}`);
// //         }
        
// //         addDebugLog('Dashboard initialized');
        
// //       } catch (err) {
// //         addDebugLog(`Initialization error: ${err.message}`);
// //         setError('Failed to load dashboard data. Please try again.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     initializeDashboard();

// //     const pollInterval = setInterval(loadStockPrices, 30000);
// //     return () => clearInterval(pollInterval);
// //   }, [user.id]);

// //   // Initialize WebSocket subscriptions when connected
// //   useEffect(() => {
// //     if (isConnected && subscriptions.length > 0 && !hasInitializedWS) {
// //       addDebugLog(`WebSocket connected, initializing ${subscriptions.length} subscriptions`);
// //       initializeSubscriptions(subscriptions);
// //       setHasInitializedWS(true);
// //     }
// //   }, [isConnected, subscriptions, hasInitializedWS, initializeSubscriptions]);

// //   // Handle subscribe button
// //   const handleSubscribe = async (symbol) => {
// //     try {
// //       addDebugLog(`Subscribing to ${symbol}...`);
// //       const response = await subscriptionAPI.subscribe(user.id, symbol);
// //       if (response.data.success) {
// //         setSubscriptions(prev => [...prev, symbol]);
// //         subscribeToStock(symbol);
// //         addDebugLog(`Subscribed to ${symbol} successfully`);
        
// //         if (!selectedStock) {
// //           setSelectedStock(symbol);
// //         }
        
// //         setError('');
// //       }
// //     } catch (err) {
// //       const errorMsg = err.response?.data?.error || 'Failed to subscribe';
// //       addDebugLog(`Subscribe error: ${errorMsg}`);
// //       setError(errorMsg);
// //     }
// //   };

// //   // Handle unsubscribe button
// //   const handleUnsubscribe = async (symbol) => {
// //     try {
// //       addDebugLog(`Unsubscribing from ${symbol}...`);
// //       const response = await subscriptionAPI.unsubscribe(user.id, symbol);
// //       if (response.data.success) {
// //         setSubscriptions(prev => prev.filter(s => s !== symbol));
// //         unsubscribeFromStock(symbol);
// //         addDebugLog(`Unsubscribed from ${symbol} successfully`);
        
// //         if (selectedStock === symbol) {
// //           const remaining = subscriptions.filter(s => s !== symbol);
// //           setSelectedStock(remaining.length > 0 ? remaining[0] : null);
// //         }
        
// //         setError('');
// //       }
// //     } catch (err) {
// //       const errorMsg = err.response?.data?.error || 'Failed to unsubscribe';
// //       addDebugLog(`Unsubscribe error: ${errorMsg}`);
// //       setError(errorMsg);
// //     }
// //   };

// //   const handleStockSelect = (symbol) => {
// //     addDebugLog(`Selected stock: ${symbol}`);
// //     setSelectedStock(symbol);
// //   };

// //   if (loading) {
// //     return <div className="loading">Loading...</div>;
// //   }

// //   return (
// //     <div className="dashboard">
// //       <header className="header">
// //         <div>
// //           <h1>📈 Real-Time Stock Dashboard</h1>
// //           <div style={{ marginTop: '5px' }}>
// //             <p style={{ color: '#666', marginBottom: '5px' }}>
// //               Welcome back, {user.email}
// //             </p>
// //             <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px' }}>
// //               <span style={{ 
// //                 padding: '4px 10px', 
// //                 borderRadius: '12px', 
// //                 backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
// //                 color: isConnected ? '#155724' : '#721c24'
// //               }}>
// //                 {isConnected ? '✅ WebSocket Connected' : '⚠️ Connecting...'}
// //               </span>
// //               <span style={{ color: '#666' }}>
// //                 {subscriptions.length} subscribed stocks
// //               </span>
// //               {restoredSubscriptions && restoredSubscriptions.length > 0 && (
// //                 <span style={{ color: '#007bff', fontSize: '12px' }}>
// //                   ({restoredSubscriptions.length} restored via WebSocket)
// //                 </span>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //         <button onClick={onLogout} className="btn btn-secondary">
// //           Logout
// //         </button>
// //       </header>

// //       <div className="container">
// //         {error && (
// //           <div className="error" style={{
// //             backgroundColor: '#f8d7da',
// //             color: '#721c24',
// //             padding: '15px',
// //             borderRadius: '8px',
// //             marginBottom: '20px'
// //           }}>
// //             <span>{error}</span>
// //           </div>
// //         )}

// //         {/* Debug Panel - VERY IMPORTANT */}
// //         <div className="card" style={{ 
// //           backgroundColor: '#f8f9fa', 
// //           borderColor: '#dc3545',
// //           marginBottom: '20px'
// //         }}>
// //           <h3 style={{ color: '#dc3545' }}>🔍 Debug Information</h3>
// //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
// //             <div>
// //               <h4>Status</h4>
// //               <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
// //                 <div><strong>User ID:</strong> {user.id}</div>
// //                 <div><strong>WebSocket:</strong> 
// //                   <span style={{ color: isConnected ? '#28a745' : '#dc3545', fontWeight: 'bold', marginLeft: '5px' }}>
// //                     {isConnected ? 'Connected' : 'Disconnected'}
// //                   </span>
// //                 </div>
// //                 <div><strong>Subscriptions in State:</strong> {subscriptions.length}</div>
// //                 <div><strong>Restored from WS:</strong> {restoredSubscriptions?.length || 0}</div>
// //                 <div><strong>WS Initialized:</strong> {hasInitializedWS ? 'Yes' : 'No'}</div>
// //               </div>
// //             </div>
// //             <div>
// //               <h4>Recent Logs</h4>
// //               <div style={{ 
// //                 backgroundColor: 'white', 
// //                 padding: '10px', 
// //                 borderRadius: '6px', 
// //                 maxHeight: '150px', 
// //                 overflowY: 'auto',
// //                 fontSize: '12px',
// //                 fontFamily: 'monospace'
// //               }}>
// //                 {debugLogs.length === 0 ? (
// //                   <div style={{ color: '#999', fontStyle: 'italic' }}>No logs yet...</div>
// //                 ) : (
// //                   debugLogs.map((log, index) => (
// //                     <div key={index} style={{ marginBottom: '3px', color: '#666' }}>
// //                       {log}
// //                     </div>
// //                   ))
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //           <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
// //             <button 
// //               onClick={() => {
// //                 setHasInitializedWS(false);
// //                 loadSubscriptions();
// //               }}
// //               className="btn"
// //               style={{ padding: '8px 15px', fontSize: '14px' }}
// //             >
// //               🔄 Reload Subscriptions
// //             </button>
// //             <button 
// //               onClick={() => setDebugLogs([])}
// //               className="btn btn-secondary"
// //               style={{ padding: '8px 15px', fontSize: '14px' }}
// //             >
// //               🧹 Clear Logs
// //             </button>
// //           </div>
// //         </div>

// //         {/* Welcome message */}
// //         <div className="card" style={{ 
// //           backgroundColor: subscriptions.length > 0 ? '#e8f4fd' : '#f8f9fa', 
// //           borderColor: subscriptions.length > 0 ? '#007bff' : '#dee2e6',
// //           marginBottom: '20px'
// //         }}>
// //           <h3 style={{ color: subscriptions.length > 0 ? '#007bff' : '#666' }}>
// //             {subscriptions.length === 0 ? '👋 Welcome!' : '👋 Welcome Back!'}
// //           </h3>
// //           <p style={{ color: '#666', marginTop: '10px' }}>
// //             {subscriptions.length === 0 
// //               ? 'Subscribe to stocks to start receiving real-time updates.'
// //               : `Your ${subscriptions.length} subscribed stocks have been restored from the database.`
// //             }
// //           </p>
          
// //           {subscriptions.length > 0 && (
// //             <div style={{ marginTop: '15px' }}>
// //               <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
// //                 Currently subscribed to:
// //               </div>
// //               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
// //                 {subscriptions.map(symbol => (
// //                   <span 
// //                     key={symbol}
// //                     style={{
// //                       padding: '4px 10px',
// //                       backgroundColor: '#007bff',
// //                       color: 'white',
// //                       borderRadius: '15px',
// //                       fontSize: '12px',
// //                       fontWeight: '600'
// //                     }}
// //                   >
// //                     {symbol}
// //                   </span>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Subscriptions & Portfolio Chart */}
// //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
// //           <SubscriptionManager
// //             subscriptions={subscriptions}
// //             onSubscribe={handleSubscribe}
// //             onUnsubscribe={handleUnsubscribe}
// //           />
// //           <PortfolioChart
// //             subscriptions={subscriptions}
// //             stockPrices={stockPrices}
// //           />
// //         </div>

// //         {/* Rest of your components remain the same */}
// //         {subscriptions.length > 0 && (
// //           <div className="card" style={{ marginBottom: '20px' }}>
// //             <h3>View Detailed Chart</h3>
// //             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
// //               {subscriptions.map(symbol => (
// //                 <button
// //                   key={symbol}
// //                   onClick={() => handleStockSelect(symbol)}
// //                   style={{
// //                     padding: '10px 18px',
// //                     backgroundColor: selectedStock === symbol ? '#007bff' : '#f8f9fa',
// //                     color: selectedStock === symbol ? 'white' : '#333',
// //                     border: `2px solid ${selectedStock === symbol ? '#007bff' : '#dee2e6'}`,
// //                     borderRadius: '25px',
// //                     cursor: 'pointer',
// //                     fontSize: '14px',
// //                     fontWeight: selectedStock === symbol ? '600' : '400',
// //                     transition: 'all 0.3s ease',
// //                     display: 'flex',
// //                     alignItems: 'center',
// //                     gap: '8px'
// //                   }}
// //                 >
// //                   <span>{symbol}</span>
// //                   {stockPrices[symbol] && (
// //                     <span style={{
// //                       color: selectedStock === symbol ? 'white' :
// //                         (stockPrices[symbol].change >= 0 ? '#28a745' : '#dc3545'),
// //                       fontSize: '12px',
// //                       fontWeight: 'bold'
// //                     }}>
// //                       ${stockPrices[symbol].price.toFixed(2)}
// //                     </span>
// //                   )}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {selectedStock && (
// //           <AdvancedChartDashboard
// //             symbol={selectedStock}
// //             stockPrices={stockPrices}
// //             userId={user.id}
// //           />
// //         )}

// //         <StockList
// //           stockPrices={stockPrices}
// //           subscriptions={subscriptions}
// //           onStockSelect={handleStockSelect}
// //         />

// //       </div>
// //     </div>
// //   );
// // }

// // export default Dashboard;
// import React, { useState, useEffect, useCallback } from 'react';
// import { subscriptionAPI, stockAPI } from '../api/api';
// import { useWebSocket } from '../hooks/useWebSocket';
// import StockList from './StockList';
// import SubscriptionManager from './SubscriptionManager';
// import PortfolioChart from './PortfolioChart';
// import AdvancedChartDashboard from './AdvancedChartDashboard';
// import { getStockInfo } from '../utils/stockLogos';
// import './Dashboard.css';

// // Import dashboard logos


// function Dashboard({ user, onLogout }) {
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [stockPrices, setStockPrices] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [hasInitializedWS, setHasInitializedWS] = useState(false);
//   const [debugLogs, setDebugLogs] = useState([]);
//   const [showDebugPanel, setShowDebugPanel] = useState(false);

//   const addDebugLog = useCallback((message) => {
//     console.log(`🔍 DEBUG: ${message}`);
//     setDebugLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
//   }, []);

//   const { 
//     subscribeToStock, 
//     unsubscribeFromStock, 
//     initializeSubscriptions,
//     isConnected,
//     restoredSubscriptions 
//   } = useWebSocket(
//     user.id,
//     (updatedPrices) => {
//       addDebugLog(`WebSocket stock update: ${Object.keys(updatedPrices).join(', ')}`);
//       setStockPrices(prev => ({ ...prev, ...updatedPrices }));
//     },
//     (restoredStocks) => {
//       addDebugLog(`WebSocket restored subscriptions: ${restoredStocks?.join(', ') || 'none'}`);
//       if (restoredStocks && restoredStocks.length > 0) {
//         setSubscriptions(prev => {
//           const merged = [...new Set([...prev, ...restoredStocks])];
//           addDebugLog(`Merged subscriptions: ${merged.join(', ')}`);
//           return merged;
//         });
        
//         if (!selectedStock && restoredStocks.length > 0) {
//           setSelectedStock(restoredStocks[0]);
//         }
//       }
//     }
//   );

//   const loadSubscriptions = async () => {
//     try {
//       addDebugLog(`Loading subscriptions from DB for user: ${user.id}`);
//       const response = await subscriptionAPI.getUserSubscriptions(user.id);
      
//       if (response.data.success) {
//         const userSubscriptions = response.data.subscriptions.map(sub => sub.symbol);
//         addDebugLog(`Loaded from DB: ${userSubscriptions.join(', ') || 'none'}`);
//         return userSubscriptions;
//       }
//     } catch (err) {
//       addDebugLog(`Failed to load subscriptions: ${err.message}`);
//       setError('Failed to load your subscriptions. Please refresh.');
//     }
//     return [];
//   };

//   const loadStockPrices = async () => {
//     try {
//       const response = await stockAPI.getStockPrices();
//       if (response.data.success) {
//         setStockPrices(response.data.prices);
//         addDebugLog(`Loaded ${Object.keys(response.data.prices).length} stock prices`);
//       }
//     } catch (err) {
//       addDebugLog(`Failed to load stock prices: ${err.message}`);
//     }
//   };

//   useEffect(() => {
//     const initializeDashboard = async () => {
//       setLoading(true);
//       addDebugLog('Starting dashboard initialization...');
//       try {
//         const [dbSubscriptions] = await Promise.all([
//           loadSubscriptions(),
//           loadStockPrices()
//         ]);
        
//         addDebugLog(`Setting subscriptions from DB: ${dbSubscriptions.join(', ')}`);
//         setSubscriptions(dbSubscriptions);
        
//         if (dbSubscriptions.length > 0 && !selectedStock) {
//           setSelectedStock(dbSubscriptions[0]);
//           addDebugLog(`Selected first stock: ${dbSubscriptions[0]}`);
//         }
        
//         addDebugLog('Dashboard initialized');
        
//       } catch (err) {
//         addDebugLog(`Initialization error: ${err.message}`);
//         setError('Failed to load dashboard data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeDashboard();

//     const pollInterval = setInterval(loadStockPrices, 30000);
//     return () => clearInterval(pollInterval);
//   }, [user.id]);

//   useEffect(() => {
//     if (isConnected && subscriptions.length > 0 && !hasInitializedWS) {
//       addDebugLog(`WebSocket connected, initializing ${subscriptions.length} subscriptions`);
//       initializeSubscriptions(subscriptions);
//       setHasInitializedWS(true);
//     }
//   }, [isConnected, subscriptions, hasInitializedWS, initializeSubscriptions]);

//   const handleSubscribe = async (symbol) => {
//     try {
//       addDebugLog(`Subscribing to ${symbol}...`);
//       const response = await subscriptionAPI.subscribe(user.id, symbol);
//       if (response.data.success) {
//         setSubscriptions(prev => [...prev, symbol]);
//         subscribeToStock(symbol);
//         addDebugLog(`Subscribed to ${symbol} successfully`);
        
//         if (!selectedStock) {
//           setSelectedStock(symbol);
//         }
        
//         setError('');
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || 'Failed to subscribe';
//       addDebugLog(`Subscribe error: ${errorMsg}`);
//       setError(errorMsg);
//     }
//   };

//   const handleUnsubscribe = async (symbol) => {
//     try {
//       addDebugLog(`Unsubscribing from ${symbol}...`);
//       const response = await subscriptionAPI.unsubscribe(user.id, symbol);
//       if (response.data.success) {
//         setSubscriptions(prev => prev.filter(s => s !== symbol));
//         unsubscribeFromStock(symbol);
//         addDebugLog(`Unsubscribed from ${symbol} successfully`);
        
//         if (selectedStock === symbol) {
//           const remaining = subscriptions.filter(s => s !== symbol);
//           setSelectedStock(remaining.length > 0 ? remaining[0] : null);
//         }
        
//         setError('');
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || 'Failed to unsubscribe';
//       addDebugLog(`Unsubscribe error: ${errorMsg}`);
//       setError(errorMsg);
//     }
//   };

//   const handleStockSelect = (symbol) => {
//     addDebugLog(`Selected stock: ${symbol}`);
//     setSelectedStock(symbol);
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <img src={LoadingLogo} alt="Loading..." className="loading-logo" />
//         <div className="loading-spinner"></div>
//         <p className="loading-text">Loading your dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard">
//       {/* Enhanced Header */}
//       <header className="dashboard-header">
//         <div className="header-content">
//           <div className="header-left">
//             <div className="logo-section">
//               <img src={StockFlowLogo} alt="StockFlow Logo" className="logo-image" />
//               <div>
//                 <h1 className="dashboard-title">StockFlow</h1>
//                 <p className="dashboard-subtitle">Real-Time Market Intelligence</p>
//               </div>
//             </div>
//             <div className="user-info">
//               <img src={UserDefaultLogo} alt="User Avatar" className="user-avatar" />
//               <div className="user-details">
//                 <p className="user-name">Welcome back</p>
//                 <p className="user-email">{user.email}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="header-right">
//             <div className="header-stats">
//               <div className="stat-item">
//                 <span className="stat-label">Subscriptions</span>
//                 <span className="stat-value">{subscriptions.length}</span>
//               </div>
//               <div className="stat-divider"></div>
//               <div className="stat-item">
//                 <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
//                   <img 
//                     src={isConnected ? ConnectedLogo : DisconnectedLogo} 
//                     alt={isConnected ? "Connected" : "Disconnected"} 
//                     className="status-logo" 
//                   />
//                   <span className="status-text">{isConnected ? 'Live' : 'Offline'}</span>
//                 </div>
//               </div>
//             </div>
//             <button onClick={onLogout} className="logout-btn">
//               <span>Logout</span>
//               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                 <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="dashboard-container">
//         {/* Error Alert */}
//         {error && (
//           <div className="alert alert-error">
//             <img src={ErrorLogo} alt="Error" className="alert-icon-img" />
//             <div className="alert-content">
//               <strong>Error</strong>
//               <p>{error}</p>
//             </div>
//             <button onClick={() => setError('')} className="alert-close">×</button>
//           </div>
//         )}

//         {/* Debug Panel Toggle */}
//         <button 
//           onClick={() => setShowDebugPanel(!showDebugPanel)}
//           className="debug-toggle"
//           title="Toggle Debug Panel"
//         >
//           <img src={DebugLogo} alt="Debug" className="debug-toggle-img" />
//         </button>

//         {/* Debug Panel */}
//         {showDebugPanel && (
//           <div className="debug-panel">
//             <div className="debug-header">
//               <div className="debug-title">
//                 <img src={DebugLogo} alt="Debug" className="debug-header-logo" />
//                 <h3>Debug Information</h3>
//               </div>
//               <button onClick={() => setShowDebugPanel(false)} className="debug-close">×</button>
//             </div>
//             <div className="debug-content">
//               <div className="debug-section">
//                 <h4>System Status</h4>
//                 <div className="debug-info">
//                   <div className="debug-row">
//                     <span>User ID:</span>
//                     <strong>{user.id}</strong>
//                   </div>
//                   <div className="debug-row">
//                     <span>WebSocket:</span>
//                     <strong className={isConnected ? 'text-success' : 'text-danger'}>
//                       {isConnected ? 'Connected' : 'Disconnected'}
//                     </strong>
//                   </div>
//                   <div className="debug-row">
//                     <span>Subscriptions:</span>
//                     <strong>{subscriptions.length}</strong>
//                   </div>
//                   <div className="debug-row">
//                     <span>Restored:</span>
//                     <strong>{restoredSubscriptions?.length || 0}</strong>
//                   </div>
//                   <div className="debug-row">
//                     <span>WS Initialized:</span>
//                     <strong>{hasInitializedWS ? 'Yes' : 'No'}</strong>
//                   </div>
//                 </div>
//               </div>
//               <div className="debug-section">
//                 <h4>Recent Activity</h4>
//                 <div className="debug-logs">
//                   {debugLogs.length === 0 ? (
//                     <div className="debug-empty">No logs yet...</div>
//                   ) : (
//                     debugLogs.map((log, index) => (
//                       <div key={index} className="debug-log-item">{log}</div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="debug-actions">
//               <button onClick={() => { setHasInitializedWS(false); loadSubscriptions(); }} className="debug-btn">
//                 🔄 Reload
//               </button>
//               <button onClick={() => setDebugLogs([])} className="debug-btn debug-btn-secondary">
//                 🧹 Clear
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Welcome Card */}
//         <div className={`welcome-card ${subscriptions.length > 0 ? 'has-subscriptions' : ''}`}>
//           <div className="welcome-icon">
//             {subscriptions.length > 0 ? '🎯' : '👋'}
//           </div>
//           <div className="welcome-content">
//             <h2 className="welcome-title">
//               {subscriptions.length === 0 ? 'Get Started' : 'Portfolio Active'}
//             </h2>
//             <p className="welcome-description">
//               {subscriptions.length === 0 
//                 ? 'Subscribe to stocks below to start tracking real-time market data and receive instant updates.'
//                 : `Monitoring ${subscriptions.length} stock${subscriptions.length > 1 ? 's' : ''} with live market data.`
//               }
//             </p>
            
//             {subscriptions.length > 0 && (
//               <div className="subscribed-stocks">
//                 {subscriptions.map(symbol => {
//                   const stockInfo = getStockInfo(symbol);
//                   return (
//                     <div 
//                       key={symbol} 
//                       className="stock-chip"
//                       style={{ borderLeftColor: stockInfo.color }}
//                     >
//                       <img src={stockInfo.logo} alt={stockInfo.name} className="stock-chip-logo" />
//                       <span className="stock-symbol">{symbol}</span>
//                       {stockPrices[symbol] && (
//                         <span className={`stock-price ${stockPrices[symbol].change >= 0 ? 'positive' : 'negative'}`}>
//                           ${stockPrices[symbol].price.toFixed(2)}
//                         </span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Grid */}
//         <div className="main-grid">
//           <SubscriptionManager
//             subscriptions={subscriptions}
//             onSubscribe={handleSubscribe}
//             onUnsubscribe={handleUnsubscribe}
//           />
//           <PortfolioChart
//             subscriptions={subscriptions}
//             stockPrices={stockPrices}
//           />
//         </div>

//         {/* Stock Selector */}
//         {subscriptions.length > 0 && (
//           <div className="stock-selector-card">
//             <div className="section-header">
//               <img src={ChartLogo} alt="Chart" className="section-logo" />
//               <div>
//                 <h3 className="section-title">Detailed Analysis</h3>
//                 <p className="section-subtitle">Select a stock to view comprehensive charts and analytics</p>
//               </div>
//             </div>
//             <div className="stock-buttons">
//               {subscriptions.map(symbol => {
//                 const stockInfo = getStockInfo(symbol);
//                 return (
//                   <button
//                     key={symbol}
//                     onClick={() => handleStockSelect(symbol)}
//                     className={`stock-button ${selectedStock === symbol ? 'active' : ''}`}
//                     style={selectedStock === symbol ? { borderColor: stockInfo.color } : {}}
//                   >
//                     <div className="stock-button-header">
//                       <img src={stockInfo.logo} alt={stockInfo.name} className="stock-button-logo" />
//                       <span className="stock-button-symbol">{symbol}</span>
//                     </div>
//                     {stockPrices[symbol] && (
//                       <div className="stock-button-details">
//                         <span className="stock-button-price">
//                           ${stockPrices[symbol].price.toFixed(2)}
//                         </span>
//                         <span className={`stock-button-change ${stockPrices[symbol].change >= 0 ? 'positive' : 'negative'}`}>
//                           {stockPrices[symbol].change >= 0 ? '+' : ''}
//                           {stockPrices[symbol].change.toFixed(2)}%
//                         </span>
//                       </div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Advanced Chart */}
//         {selectedStock && (
//           <div className="chart-container">
//             <AdvancedChartDashboard
//               symbol={selectedStock}
//               stockPrices={stockPrices}
//               userId={user.id}
//             />
//           </div>
//         )}

//         {/* Stock List */}
//         <StockList
//           stockPrices={stockPrices}
//           subscriptions={subscriptions}
//           onStockSelect={handleStockSelect}
//         />
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
import React, { useState, useEffect, useCallback } from 'react';
import { subscriptionAPI, stockAPI } from '../api/api';
import { useWebSocket } from '../hooks/useWebSocket';
import StockList from './StockList';
import SubscriptionManager from './SubscriptionManager';
import PortfolioChart from './PortfolioChart';
import AdvancedChartDashboard from './AdvancedChartDashboard';
import { getStockInfo } from '../utils/stockLogos';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [hasInitializedWS, setHasInitializedWS] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const addDebugLog = useCallback((message) => {
    console.log(`🔍 DEBUG: ${message}`);
    setDebugLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  const { 
    subscribeToStock, 
    unsubscribeFromStock, 
    initializeSubscriptions,
    isConnected,
    restoredSubscriptions 
  } = useWebSocket(
    user.id,
    (updatedPrices) => {
      addDebugLog(`WebSocket stock update: ${Object.keys(updatedPrices).join(', ')}`);
      setStockPrices(prev => ({ ...prev, ...updatedPrices }));
    },
    (restoredStocks) => {
      addDebugLog(`WebSocket restored subscriptions: ${restoredStocks?.join(', ') || 'none'}`);
      if (restoredStocks && restoredStocks.length > 0) {
        setSubscriptions(prev => {
          const merged = [...new Set([...prev, ...restoredStocks])];
          addDebugLog(`Merged subscriptions: ${merged.join(', ')}`);
          return merged;
        });
        
        if (!selectedStock && restoredStocks.length > 0) {
          setSelectedStock(restoredStocks[0]);
        }
      }
    }
  );

  const loadSubscriptions = async () => {
    try {
      addDebugLog(`Loading subscriptions from DB for user: ${user.id}`);
      const response = await subscriptionAPI.getUserSubscriptions(user.id);
      
      if (response.data.success) {
        const userSubscriptions = response.data.subscriptions.map(sub => sub.symbol);
        addDebugLog(`Loaded from DB: ${userSubscriptions.join(', ') || 'none'}`);
        return userSubscriptions;
      }
    } catch (err) {
      addDebugLog(`Failed to load subscriptions: ${err.message}`);
      setError('Failed to load your subscriptions. Please refresh.');
    }
    return [];
  };

  const loadStockPrices = async () => {
    try {
      const response = await stockAPI.getStockPrices();
      if (response.data.success) {
        setStockPrices(response.data.prices);
        addDebugLog(`Loaded ${Object.keys(response.data.prices).length} stock prices`);
      }
    } catch (err) {
      addDebugLog(`Failed to load stock prices: ${err.message}`);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      addDebugLog('Starting dashboard initialization...');
      try {
        const [dbSubscriptions] = await Promise.all([
          loadSubscriptions(),
          loadStockPrices()
        ]);
        
        addDebugLog(`Setting subscriptions from DB: ${dbSubscriptions.join(', ')}`);
        setSubscriptions(dbSubscriptions);
        
        if (dbSubscriptions.length > 0 && !selectedStock) {
          setSelectedStock(dbSubscriptions[0]);
          addDebugLog(`Selected first stock: ${dbSubscriptions[0]}`);
        }
        
        addDebugLog('Dashboard initialized');
        
      } catch (err) {
        addDebugLog(`Initialization error: ${err.message}`);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();

    const pollInterval = setInterval(loadStockPrices, 30000);
    return () => clearInterval(pollInterval);
  }, [user.id]);

  useEffect(() => {
    if (isConnected && subscriptions.length > 0 && !hasInitializedWS) {
      addDebugLog(`WebSocket connected, initializing ${subscriptions.length} subscriptions`);
      initializeSubscriptions(subscriptions);
      setHasInitializedWS(true);
    }
  }, [isConnected, subscriptions, hasInitializedWS, initializeSubscriptions]);

  const handleSubscribe = async (symbol) => {
    try {
      addDebugLog(`Subscribing to ${symbol}...`);
      const response = await subscriptionAPI.subscribe(user.id, symbol);
      if (response.data.success) {
        setSubscriptions(prev => [...prev, symbol]);
        subscribeToStock(symbol);
        addDebugLog(`Subscribed to ${symbol} successfully`);
        
        if (!selectedStock) {
          setSelectedStock(symbol);
        }
        
        setError('');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to subscribe';
      addDebugLog(`Subscribe error: ${errorMsg}`);
      setError(errorMsg);
    }
  };

  const handleUnsubscribe = async (symbol) => {
    try {
      addDebugLog(`Unsubscribing from ${symbol}...`);
      const response = await subscriptionAPI.unsubscribe(user.id, symbol);
      if (response.data.success) {
        setSubscriptions(prev => prev.filter(s => s !== symbol));
        unsubscribeFromStock(symbol);
        addDebugLog(`Unsubscribed from ${symbol} successfully`);
        
        if (selectedStock === symbol) {
          const remaining = subscriptions.filter(s => s !== symbol);
          setSelectedStock(remaining.length > 0 ? remaining[0] : null);
        }
        
        setError('');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to unsubscribe';
      addDebugLog(`Unsubscribe error: ${errorMsg}`);
      setError(errorMsg);
    }
  };

  const handleStockSelect = (symbol) => {
    addDebugLog(`Selected stock: ${symbol}`);
    setSelectedStock(symbol);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Enhanced Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-icon">📈</div>
              <div>
                <h1 className="dashboard-title">StockSagu</h1>
                <p className="dashboard-subtitle">Real-Time Market Intelligence</p>
              </div>
            </div>
            <div className="user-info">
              <div className="user-avatar">{user.email.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <p className="user-name">Welcome back</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-label">Subscriptions</span>
                <span className="stat-value">{subscriptions.length}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                  <span className="status-dot"></span>
                  <span className="status-text">{isConnected ? 'Live' : 'Offline'}</span>
                </div>
              </div>
            </div>
            <button onClick={onLogout} className="logout-btn">
              <span>Logout</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Error</strong>
              <p>{error}</p>
            </div>
            <button onClick={() => setError('')} className="alert-close">×</button>
          </div>
        )}

        {/* Debug Panel Toggle */}
        <button 
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          className="debug-toggle"
          title="Toggle Debug Panel"
        >
          🔍
        </button>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="debug-panel">
            <div className="debug-header">
              <h3>🔍 Debug Information</h3>
              <button onClick={() => setShowDebugPanel(false)} className="debug-close">×</button>
            </div>
            <div className="debug-content">
              <div className="debug-section">
                <h4>System Status</h4>
                <div className="debug-info">
                  <div className="debug-row">
                    <span>User ID:</span>
                    <strong>{user.id}</strong>
                  </div>
                  <div className="debug-row">
                    <span>WebSocket:</span>
                    <strong className={isConnected ? 'text-success' : 'text-danger'}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </strong>
                  </div>
                  <div className="debug-row">
                    <span>Subscriptions:</span>
                    <strong>{subscriptions.length}</strong>
                  </div>
                  <div className="debug-row">
                    <span>Restored:</span>
                    <strong>{restoredSubscriptions?.length || 0}</strong>
                  </div>
                  <div className="debug-row">
                    <span>WS Initialized:</span>
                    <strong>{hasInitializedWS ? 'Yes' : 'No'}</strong>
                  </div>
                </div>
              </div>
              <div className="debug-section">
                <h4>Recent Activity</h4>
                <div className="debug-logs">
                  {debugLogs.length === 0 ? (
                    <div className="debug-empty">No logs yet...</div>
                  ) : (
                    debugLogs.map((log, index) => (
                      <div key={index} className="debug-log-item">{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="debug-actions">
              <button onClick={() => { setHasInitializedWS(false); loadSubscriptions(); }} className="debug-btn">
                🔄 Reload
              </button>
              <button onClick={() => setDebugLogs([])} className="debug-btn debug-btn-secondary">
                🧹 Clear
              </button>
            </div>
          </div>
        )}

        {/* Welcome Card */}
        <div className={`welcome-card ${subscriptions.length > 0 ? 'has-subscriptions' : ''}`}>
          <div className="welcome-icon">
            {subscriptions.length > 0 ? '🎯' : '👋'}
          </div>
          <div className="welcome-content">
            <h2 className="welcome-title">
              {subscriptions.length === 0 ? 'Get Started' : 'Portfolio Active'}
            </h2>
            <p className="welcome-description">
              {subscriptions.length === 0 
                ? 'Subscribe to stocks below to start tracking real-time market data and receive instant updates.'
                : `Monitoring ${subscriptions.length} stock${subscriptions.length > 1 ? 's' : ''} with live market data.`
              }
            </p>
            
            {subscriptions.length > 0 && (
              <div className="subscribed-stocks">
                {subscriptions.map(symbol => {
                  const stockInfo = getStockInfo(symbol);
                  return (
                    <div 
                      key={symbol} 
                      className="stock-chip"
                      style={{ borderLeftColor: stockInfo.color }}
                    >
                      {stockInfo.logo && (
                        <img src={stockInfo.logo} alt={stockInfo.name} className="stock-chip-logo" />
                      )}
                      <span className="stock-symbol">{symbol}</span>
                      {stockPrices[symbol] && (
                        <span className={`stock-price ${stockPrices[symbol].change >= 0 ? 'positive' : 'negative'}`}>
                          ${stockPrices[symbol].price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          <SubscriptionManager
            subscriptions={subscriptions}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
          />
          <PortfolioChart
            subscriptions={subscriptions}
            stockPrices={stockPrices}
          />
        </div>

        {/* Stock Selector */}
        {subscriptions.length > 0 && (
          <div className="stock-selector-card">
            <h3 className="section-title">Detailed Analysis</h3>
            <p className="section-subtitle">Select a stock to view comprehensive charts and analytics</p>
            <div className="stock-buttons">
              {subscriptions.map(symbol => {
                const stockInfo = getStockInfo(symbol);
                return (
                  <button
                    key={symbol}
                    onClick={() => handleStockSelect(symbol)}
                    className={`stock-button ${selectedStock === symbol ? 'active' : ''}`}
                    style={selectedStock === symbol ? { borderColor: stockInfo.color } : {}}
                  >
                    <div className="stock-button-header">
                      {stockInfo.logo && (
                        <img src={stockInfo.logo} alt={stockInfo.name} className="stock-button-logo" />
                      )}
                      <span className="stock-button-symbol">{symbol}</span>
                    </div>
                    {stockPrices[symbol] && (
                      <div className="stock-button-details">
                        <span className="stock-button-price">
                          ${stockPrices[symbol].price.toFixed(2)}
                        </span>
                        <span className={`stock-button-change ${stockPrices[symbol].change >= 0 ? 'positive' : 'negative'}`}>
                          {stockPrices[symbol].change >= 0 ? '+' : ''}
                          {stockPrices[symbol].change.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Advanced Chart */}
        {selectedStock && (
          <div className="chart-container">
            <AdvancedChartDashboard
              symbol={selectedStock}
              stockPrices={stockPrices}
              userId={user.id}
            />
          </div>
        )}

        {/* Stock List */}
        <StockList
          stockPrices={stockPrices}
          subscriptions={subscriptions}
          onStockSelect={handleStockSelect}
        />
      </div>
    </div>
  );
}

export default Dashboard;