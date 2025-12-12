import React, { useState, useEffect } from 'react';
import { subscriptionAPI, stockAPI } from '../api/api';
import { useWebSocket } from '../hooks/useWebSocket';
import StockList from './StockList';
import SubscriptionManager from './SubscriptionManager';
import PortfolioChart from './PortfolioChart';
import AdvancedChartDashboard from './AdvancedChartDashboard'; // ⬅️ NEW

function Dashboard({ user, onLogout }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  // Initialize WebSocket connection
  const { subscribeToStock, unsubscribeFromStock } = useWebSocket(
    user.id,
    (updatedPrices) => {
      setStockPrices(prev => ({ ...prev, ...updatedPrices }));
    }
  );

  // Load user subscriptions
  const loadSubscriptions = async () => {
    try {
      const response = await subscriptionAPI.getUserSubscriptions(user.id);
      if (response.data.success) {
        const userSubscriptions = response.data.subscriptions.map(sub => sub.symbol);
        setSubscriptions(userSubscriptions);

        if (userSubscriptions.length > 0 && !selectedStock) {
          setSelectedStock(userSubscriptions[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    }
  };

  // Load initial stock prices
  const loadStockPrices = async () => {
    try {
      const response = await stockAPI.getStockPrices();
      if (response.data.success) {
        setStockPrices(response.data.prices);
      }
    } catch (err) {
      console.error('Failed to load stock prices:', err);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      try {
        await Promise.all([loadSubscriptions(), loadStockPrices()]);
      } catch (err) {
        setError('Failed to initialize dashboard');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();

    const pollInterval = setInterval(loadStockPrices, 30000);

    return () => clearInterval(pollInterval);
  }, [user.id]);

  const handleSubscribe = async (symbol) => {
    try {
      const response = await subscriptionAPI.subscribe(user.id, symbol);
      if (response.data.success) {
        setSubscriptions(prev => [...prev, symbol]);
        subscribeToStock(symbol);

        if (!selectedStock) {
          setSelectedStock(symbol);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to subscribe');
    }
  };

  const handleUnsubscribe = async (symbol) => {
    try {
      const response = await subscriptionAPI.unsubscribe(user.id, symbol);
      if (response.data.success) {
        setSubscriptions(prev => prev.filter(s => s !== symbol));
        unsubscribeFromStock(symbol);

        if (selectedStock === symbol) {
          const remaining = subscriptions.filter(s => s !== symbol);
          setSelectedStock(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to unsubscribe');
    }
  };

  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol);
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>📈 Real-Time Stock Dashboard</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Welcome, {user.email} | Real-time charts & analytics
          </p>
        </div>
        <button onClick={onLogout} className="btn btn-secondary">
          Logout
        </button>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}

        {/* Subscriptions & Portfolio Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>View Detailed Chart</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {subscriptions.map(symbol => (
                <button
                  key={symbol}
                  onClick={() => handleStockSelect(symbol)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: selectedStock === symbol ? '#007bff' : '#f8f9fa',
                    color: selectedStock === symbol ? 'white' : '#333',
                    border: `1px solid ${selectedStock === symbol ? '#007bff' : '#dee2e6'}`,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: selectedStock === symbol ? '600' : '400',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {symbol}
                  {stockPrices[symbol] && (
                    <span style={{
                      marginLeft: '5px',
                      color: selectedStock === symbol ? 'white' :
                        (stockPrices[symbol].change >= 0 ? '#28a745' : '#dc3545'),
                      fontSize: '12px'
                    }}>
                      ${stockPrices[symbol].price.toFixed(2)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================ */}
        {/* 🔥 NEW ADVANCED CHART LOADED */}
        {/* ============================ */}
        {selectedStock && (
          <AdvancedChartDashboard
            symbol={selectedStock}
            stockPrices={stockPrices}
            userId={user.id} // Pass userId here
          />
        )}

        {/* Stock List */}
        <StockList
          stockPrices={stockPrices}
          subscriptions={subscriptions}
          onStockSelect={handleStockSelect}
        />

        {/* Feature Info */}
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>📊 Chart Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
            <div>
              <h4>Real-time Updates</h4>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <li>Prices update every 15 seconds</li>
                <li>Live WebSocket push notifications</li>
                <li>Auto-refresh toggle available</li>
              </ul>
            </div>
            <div>
              <h4>Chart Types</h4>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <li>Line charts for trends</li>
                <li>Area charts for volume</li>
                <li>Candlestick for OHLC data</li>
              </ul>
            </div>
            <div>
              <h4>Timeframes</h4>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <li>5-minute intervals</li>
                <li>15-minute intervals</li>
                <li>1-hour aggregations</li>
                <li>24-hour overview</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
