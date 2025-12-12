import React from 'react';
import { SUPPORTED_STOCKS, STOCK_NAMES } from '../utils/constants';

function SubscriptionManager({ subscriptions, onSubscribe, onUnsubscribe }) {
  const isSubscribed = (symbol) => subscriptions.includes(symbol);

  const handleToggleSubscription = (symbol) => {
    if (isSubscribed(symbol)) {
      onUnsubscribe(symbol);
    } else {
      onSubscribe(symbol);
    }
  };

  return (
    <div className="card">
      <h2>Stock Subscriptions</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Subscribe to stocks to receive real-time updates
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {SUPPORTED_STOCKS.map(symbol => (
          <div
            key={symbol}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 15px',
              backgroundColor: isSubscribed(symbol) ? '#e8f4fd' : '#f8f9fa',
              borderRadius: '6px',
              border: `1px solid ${isSubscribed(symbol) ? '#007bff' : '#dee2e6'}`
            }}
          >
            <span style={{ fontWeight: '600' }}>{symbol}</span>
            <span style={{ fontSize: '14px', color: '#666' }}>
              {STOCK_NAMES[symbol]}
            </span>
            <button
              onClick={() => handleToggleSubscription(symbol)}
              className="btn"
              style={{
                padding: '5px 15px',
                fontSize: '12px',
                backgroundColor: isSubscribed(symbol) ? '#dc3545' : '#28a745',
                color: 'white'
              }}
            >
              {isSubscribed(symbol) ? 'Unsubscribe' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Subscribed: {subscriptions.length} of {SUPPORTED_STOCKS.length} stocks</p>
      </div>
    </div>
  );
}

export default SubscriptionManager;