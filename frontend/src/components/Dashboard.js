import React, { useState, useEffect, useCallback } from 'react';
import { subscriptionAPI, stockAPI } from '../api/api';
import { useWebSocket } from '../hooks/useWebSocket';
import StockList from './StockList';
import SubscriptionManager from './SubscriptionManager';
import PortfolioChart from './PortfolioChart';
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
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
              </div>
              <div>
                <h1 className="dashboard-title">StockSagu Pro</h1>
                <p className="dashboard-subtitle">Real-Time Market Intelligence</p>
              </div>
            </div>
            <div className="user-info">
              <div className="user-avatar">{user.email.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <p className="user-name">Welcome</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-label">Watchlist</span>
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
              <span>Sign Out</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="alert-content">
              <strong>Error</strong>
              <p>{error}</p>
            </div>
            <button onClick={() => setError('')} className="alert-close">×</button>
          </div>
        )}

        <button 
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          className="debug-toggle"
          title="Toggle Debug Panel"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
          </svg>
        </button>

        {showDebugPanel && (
          <div className="debug-panel">
            <div className="debug-header">
              <h3>Debug Information</h3>
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
                Reload
              </button>
              <button onClick={() => setDebugLogs([])} className="debug-btn debug-btn-secondary">
                Clear Logs
              </button>
            </div>
          </div>
        )}

        <div className={`welcome-card ${subscriptions.length > 0 ? 'has-subscriptions' : ''}`}>
          <div className="welcome-icon">
            {subscriptions.length > 0 ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
            )}
          </div>
          <div className="welcome-content">
            <h2 className="welcome-title">
              {subscriptions.length === 0 ? 'Start Building Your Watchlist' : 'Portfolio Overview'}
            </h2>
            <p className="welcome-description">
              {subscriptions.length === 0 
                ? 'Track your favorite stocks with real-time market data and instant price updates.'
                : `You're monitoring ${subscriptions.length} stock${subscriptions.length > 1 ? 's' : ''} with live market data.`
              }
            </p>
            
            {subscriptions.length > 0 && (
              <div className="subscribed-stocks">
                {subscriptions.map(symbol => {
                  const stockInfo = getStockInfo(symbol);
                  const price = stockPrices[symbol];
                  return (
                    <div 
                      key={symbol} 
                      className="stock-chip"
                      style={{ borderLeftColor: stockInfo.color }}
                    >
                      {stockInfo.logo && (
                        <img src={stockInfo.logo} alt={stockInfo.name} className="stock-chip-logo" />
                      )}
                      <div className="stock-chip-info">
                        <span className="stock-chip-symbol">{symbol}</span>
                        {price && (
                          <div className="stock-chip-details">
                            <span className="stock-chip-price">${price.price.toFixed(2)}</span>
                            <span className={`stock-chip-change ${price.change >= 0 ? 'positive' : 'negative'}`}>
                              {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

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

        {subscriptions.length > 0 && (
          <div className="stock-selector-card">
            <div className="section-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
              </svg>
              <div>
                <h3 className="section-title">Detailed Analysis</h3>
                <p className="section-subtitle">Select a stock for comprehensive market insights</p>
              </div>
            </div>
            <div className="stock-buttons">
              {subscriptions.map(symbol => {
                const stockInfo = getStockInfo(symbol);
                const price = stockPrices[symbol];
                return (
                  <button
                    key={symbol}
                    onClick={() => handleStockSelect(symbol)}
                    className={`stock-button ${selectedStock === symbol ? 'active' : ''}`}
                  >
                    <div className="stock-button-header">
                      {stockInfo.logo && (
                        <img src={stockInfo.logo} alt={stockInfo.name} className="stock-button-logo" />
                      )}
                      <div className="stock-button-info">
                        <span className="stock-button-symbol">{symbol}</span>
                        <span className="stock-button-name">{stockInfo.name}</span>
                      </div>
                    </div>
                    {price && (
                      <div className="stock-button-details">
                        <span className="stock-button-price">
                          ${price.price.toFixed(2)}
                        </span>
                        <span className={`stock-button-change ${price.change >= 0 ? 'positive' : 'negative'}`}>
                          {price.change >= 0 ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                              <path d="M6 2L10 8H2z"/>
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                              <path d="M6 10L2 4h8z"/>
                            </svg>
                          )}
                          {Math.abs(price.change).toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

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