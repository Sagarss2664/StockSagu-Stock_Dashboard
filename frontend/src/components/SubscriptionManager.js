// import React from 'react';
// import { SUPPORTED_STOCKS, STOCK_NAMES } from '../utils/constants';

// function SubscriptionManager({ subscriptions, onSubscribe, onUnsubscribe }) {
//   const isSubscribed = (symbol) => subscriptions.includes(symbol);

//   const handleToggleSubscription = (symbol) => {
//     if (isSubscribed(symbol)) {
//       onUnsubscribe(symbol);
//     } else {
//       onSubscribe(symbol);
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Stock Subscriptions</h2>
//       <p style={{ color: '#666', marginBottom: '20px' }}>
//         Subscribe to stocks to receive real-time updates
//       </p>

//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
//         {SUPPORTED_STOCKS.map(symbol => (
//           <div
//             key={symbol}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '10px',
//               padding: '10px 15px',
//               backgroundColor: isSubscribed(symbol) ? '#e8f4fd' : '#f8f9fa',
//               borderRadius: '6px',
//               border: `1px solid ${isSubscribed(symbol) ? '#007bff' : '#dee2e6'}`
//             }}
//           >
//             <span style={{ fontWeight: '600' }}>{symbol}</span>
//             <span style={{ fontSize: '14px', color: '#666' }}>
//               {STOCK_NAMES[symbol]}
//             </span>
//             <button
//               onClick={() => handleToggleSubscription(symbol)}
//               className="btn"
//               style={{
//                 padding: '5px 15px',
//                 fontSize: '12px',
//                 backgroundColor: isSubscribed(symbol) ? '#dc3545' : '#28a745',
//                 color: 'white'
//               }}
//             >
//               {isSubscribed(symbol) ? 'Unsubscribe' : 'Subscribe'}
//             </button>
//           </div>
//         ))}
//       </div>

//       <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
//         <p>Subscribed: {subscriptions.length} of {SUPPORTED_STOCKS.length} stocks</p>
//       </div>
//     </div>
//   );
// }

// export default SubscriptionManager;

import React, { useState } from 'react';
import { SUPPORTED_STOCKS, STOCK_NAMES } from '../utils/constants';
import { getStockInfo } from '../utils/stockLogos';
import './SubscriptionManager.css';

function SubscriptionManager({ subscriptions, onSubscribe, onUnsubscribe }) {
  const [filter, setFilter] = useState('all'); // 'all', 'subscribed', 'available'
  const [searchQuery, setSearchQuery] = useState('');

  const isSubscribed = (symbol) => subscriptions.includes(symbol);

  const handleToggleSubscription = (symbol) => {
    if (isSubscribed(symbol)) {
      onUnsubscribe(symbol);
    } else {
      onSubscribe(symbol);
    }
  };

  const filteredStocks = SUPPORTED_STOCKS.filter(symbol => {
    const matchesSearch = symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         STOCK_NAMES[symbol]?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'subscribed') {
      return matchesSearch && isSubscribed(symbol);
    } else if (filter === 'available') {
      return matchesSearch && !isSubscribed(symbol);
    }
    return matchesSearch;
  });

  const subscribedCount = subscriptions.length;
  const availableCount = SUPPORTED_STOCKS.length - subscribedCount;

  return (
    <div className="subscription-manager">
      {/* Header */}
      <div className="sm-header">
        <div className="sm-title-section">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="sm-icon">
            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
          </svg>
          <div>
            <h2 className="sm-title">Stock Watchlist</h2>
            <p className="sm-subtitle">Manage your stock subscriptions</p>
          </div>
        </div>
        <div className="sm-stats">
          <div className="sm-stat">
            <span className="sm-stat-value">{subscribedCount}</span>
            <span className="sm-stat-label">Active</span>
          </div>
          <div className="sm-stat-divider"></div>
          <div className="sm-stat">
            <span className="sm-stat-value">{availableCount}</span>
            <span className="sm-stat-label">Available</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sm-controls">
        <div className="sm-search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="7" cy="7" r="5"/>
            <path d="M11 11l3 3"/>
          </svg>
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="sm-search-clear"
            >
              ×
            </button>
          )}
        </div>

        <div className="sm-filter-tabs">
          <button
            className={`sm-filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
            <span className="sm-filter-badge">{SUPPORTED_STOCKS.length}</span>
          </button>
          <button
            className={`sm-filter-tab ${filter === 'subscribed' ? 'active' : ''}`}
            onClick={() => setFilter('subscribed')}
          >
            Subscribed
            <span className="sm-filter-badge">{subscribedCount}</span>
          </button>
          <button
            className={`sm-filter-tab ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            Available
            <span className="sm-filter-badge">{availableCount}</span>
          </button>
        </div>
      </div>

      {/* Stock List */}
      <div className="sm-stock-list">
        {filteredStocks.length === 0 ? (
          <div className="sm-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4m0 4h.01"/>
            </svg>
            <p className="sm-empty-text">No stocks found</p>
            <p className="sm-empty-subtext">
              {searchQuery ? 'Try a different search term' : 'No stocks match your filter'}
            </p>
          </div>
        ) : (
          filteredStocks.map(symbol => {
            const stockInfo = getStockInfo(symbol);
            const subscribed = isSubscribed(symbol);
            
            return (
              <div
                key={symbol}
                className={`sm-stock-item ${subscribed ? 'subscribed' : ''}`}
              >
                <div className="sm-stock-info">
                  {stockInfo.logo ? (
                    <img 
                      src={stockInfo.logo} 
                      alt={stockInfo.name} 
                      className="sm-stock-logo"
                    />
                  ) : (
                    <div className="sm-stock-logo-placeholder">
                      {symbol.charAt(0)}
                    </div>
                  )}
                  <div className="sm-stock-details">
                    <div className="sm-stock-symbol">{symbol}</div>
                    <div className="sm-stock-name">{STOCK_NAMES[symbol]}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleSubscription(symbol)}
                  className={`sm-action-btn ${subscribed ? 'unsubscribe' : 'subscribe'}`}
                >
                  {subscribed ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L5.5 10.5L3 8"/>
                      </svg>
                      Subscribed
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 3v8M3 7h8"/>
                      </svg>
                      Subscribe
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      {filteredStocks.length > 0 && (
        <div className="sm-footer">
          <div className="sm-footer-info">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <circle cx="7" cy="7" r="6"/>
              <path d="M7 5v4M7 3h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>
              {filter === 'all' && `Showing ${filteredStocks.length} of ${SUPPORTED_STOCKS.length} stocks`}
              {filter === 'subscribed' && `${subscribedCount} active subscription${subscribedCount !== 1 ? 's' : ''}`}
              {filter === 'available' && `${availableCount} stock${availableCount !== 1 ? 's' : ''} available to subscribe`}
            </span>
          </div>
          {subscribedCount > 0 && filter !== 'subscribed' && (
            <button
              onClick={() => setFilter('subscribed')}
              className="sm-view-subscribed"
            >
              View Subscribed
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h4M8 6l-2 2M8 6l-2-2"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SubscriptionManager;