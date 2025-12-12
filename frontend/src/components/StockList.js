// import React from 'react';
// import StockCard from './StockCard';
// import { SUPPORTED_STOCKS, STOCK_NAMES } from '../utils/constants';

// function StockList({ stockPrices, subscriptions }) {
//   return (
//     <div className="card">
//       <h2>Stock Prices</h2>
//       <p style={{ color: '#666', marginBottom: '20px' }}>
//         Real-time updates for subscribed stocks
//       </p>

//       <div className="stock-grid">
//         {SUPPORTED_STOCKS.map(symbol => {
//           const stockData = stockPrices[symbol];
//           const isSubscribed = subscriptions.includes(symbol);
          
//           return (
//             <StockCard
//               key={symbol}
//               symbol={symbol}
//               name={STOCK_NAMES[symbol]}
//               data={stockData}
//               isSubscribed={isSubscribed}
//             />
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

// // Add onStockSelect prop
// function StockList({ stockPrices, subscriptions, onStockSelect }) {
//   return (
//     <div className="card">
//       <h2>Stock Prices</h2>
//       <p style={{ color: '#666', marginBottom: '20px' }}>
//         Click on any stock card to view detailed chart
//       </p>

//       <div className="stock-grid">
//         {SUPPORTED_STOCKS.map(symbol => {
//           const stockData = stockPrices[symbol];
//           const isSubscribed = subscriptions.includes(symbol);
          
//           return (
//             <div 
//               key={symbol}
//               onClick={() => onStockSelect && onStockSelect(symbol)}
//               style={{ cursor: 'pointer' }}
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
import { SUPPORTED_STOCKS, STOCK_NAMES } from '../utils/constants';

function StockList({ stockPrices, subscriptions, onStockSelect }) {
  return (
    <div className="card">
      <h2>Stock Prices</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        {onStockSelect
          ? 'Click on any stock card to view detailed chart'
          : 'Real-time updates for subscribed stocks'}
      </p>

      <div className="stock-grid">
        {SUPPORTED_STOCKS.map(symbol => {
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

      {Object.keys(stockPrices).length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Loading stock prices...</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            (First load may take up to 15 seconds)
          </p>
        </div>
      )}
    </div>
  );
}

export default StockList;
