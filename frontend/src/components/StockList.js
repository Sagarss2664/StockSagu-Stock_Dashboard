// import React from 'react';
// import StockCard from './StockCard';
// import { SUPPORTED_STOCKS, STOCK_NAMES } from '../utils/constants';

// function StockList({ stockPrices, subscriptions, onStockSelect }) {
//   return (
//     <div className="card">
//       <h2>Stock Prices</h2>
//       <p style={{ color: '#666', marginBottom: '20px' }}>
//         {onStockSelect
//           ? 'Click on any stock card to view detailed chart'
//           : 'Real-time updates for subscribed stocks'}
//       </p>

//       <div className="stock-grid">
//         {SUPPORTED_STOCKS.map(symbol => {
//           const stockData = stockPrices[symbol];
//           const isSubscribed = subscriptions.includes(symbol);

//           return (
//             <div
//               key={symbol}
//               onClick={() => onStockSelect && onStockSelect(symbol)}
//               style={{ cursor: onStockSelect ? 'pointer' : 'default' }}
//             >
//               <StockCard
//                 symbol={symbol}
//                 name={STOCK_NAMES[symbol]}
//                 data={stockData}
//                 isSubscribed={isSubscribed}
//               />
//             </div>
//           );
//         })}
//       </div>

//       {Object.keys(stockPrices).length === 0 && (
//         <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
//           <p>Loading stock prices...</p>
//           <p style={{ fontSize: '14px', marginTop: '10px' }}>
//             (First load may take up to 15 seconds)
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StockList;

import React from 'react';
import StockCard from './StockCard';
import { STOCK_NAMES } from '../utils/constants';

function StockList({ stockPrices, subscriptions, onStockSelect }) {
  // Filter to only show subscribed stocks
  const subscribedStocks = subscriptions.filter(symbol => 
    stockPrices[symbol] !== undefined
  );

  return (
    <div className="card">
      <h2>Your Subscribed Stocks</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        {onStockSelect
          ? 'Click on any stock card to view detailed chart'
          : 'Real-time updates for your subscribed stocks'}
      </p>

      {subscriptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No subscriptions yet</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Use the subscription manager above to add stocks to your watchlist
          </p>
        </div>
      ) : subscribedStocks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Loading stock prices for your subscriptions...</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            (First load may take up to 15 seconds)
          </p>
        </div>
      ) : (
        <div className="stock-grid">
          {subscribedStocks.map(symbol => {
            const stockData = stockPrices[symbol];
            const isSubscribed = subscriptions.includes(symbol);

            return (
              <div
                key={symbol}
                onClick={() => onStockSelect && onStockSelect(symbol)}
                style={{ cursor: onStockSelect ? 'pointer' : 'default' }}
              >
                <StockCard
                  symbol={symbol}
                  name={STOCK_NAMES[symbol]}
                  data={stockData}
                  isSubscribed={isSubscribed}
                />
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
        <p>Showing {subscribedStocks.length} of {subscriptions.length} subscribed stocks</p>
        {subscriptions.length > subscribedStocks.length && (
          <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
            Some stocks may not have price data available yet
          </p>
        )}
      </div>
    </div>
  );
}

export default StockList;