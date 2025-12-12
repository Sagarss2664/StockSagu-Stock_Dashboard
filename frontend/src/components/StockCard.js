import React from 'react';
import { STOCK_COLORS } from '../utils/constants';

function StockCard({ symbol, name, data, isSubscribed }) {
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change) => {
    if (!change) return 'N/A';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatPercent = (percent) => {
    if (!percent) return 'N/A';
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (!change) return '#666';
    return change >= 0 ? '#28a745' : '#dc3545';
  };

  return (
    <div 
      className="card" 
      style={{ 
        borderLeft: `4px solid ${STOCK_COLORS[symbol] || '#007bff'}`,
        opacity: isSubscribed ? 1 : 0.7
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ marginBottom: '5px' }}>{symbol}</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            {name}
          </p>
        </div>
        <span 
          style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: isSubscribed ? '#d4edda' : '#f8f9fa',
            color: isSubscribed ? '#155724' : '#6c757d'
          }}
        >
          {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
        </span>
      </div>

      {data ? (
        <>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {formatPrice(data.price)}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <span style={{ color: getChangeColor(data.change) }}>
                {formatChange(data.change)}
              </span>
              <span style={{ color: getChangeColor(data.changePercent) }}>
                ({formatPercent(data.changePercent)})
              </span>
            </div>
          </div>

          {data.lastUpdated && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No data available
        </div>
      )}
    </div>
  );
}

export default StockCard;