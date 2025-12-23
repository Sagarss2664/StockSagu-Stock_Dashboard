// // Stock logos mapping - assuming you have logos named as GOOGL.png, TSLA.png, etc.
// import GOOGL from '../components/assests/Logos/Google.png';
// import TSLA from '../components/assests/Logos/Google.png';
// import AMZN from '../components/assests/Logos/Google.png';
// import META from '../components/assests/Logos/Google.png';
// import NVDA from '../components/assests/Logos/Google.png';

// // import AAPL from '../assets/Logos/AAPL.png';
// // import MSFT from '../assets/Logos/MSFT.png';
// // import NFLX from '../assets/Logos/NFLX.png';
// // import INTC from '../assets/Logos/INTC.png';
// // import AMD from '../assets/Logos/AMD.png';
// // import defaultLogo from '../assets/Logos/default-logo.png';

// // Stock information mapping
// export const stockInfo = {
//   'GOOGL': {
//     name: 'Alphabet Inc. (Google)',
//     logo: GOOGL,
//     color: '#4285F4'
//   },
//   'TSLA': {
//     name: 'Tesla Inc.',
//     logo: TSLA,
//     color: '#CC0000'
//   },
// //   'AAPL': {
// //     name: 'Apple Inc.',
// //     logo: AAPL,
// //     color: '#000000'
// //   },
// //   'MSFT': {
// //     name: 'Microsoft Corporation',
// //     logo: MSFT,
// //     color: '#7EBA00'
// //   },
//   'AMZN': {
//     name: 'Amazon.com Inc.',
//     logo: AMZN,
//     color: '#FF9900'
//   },
//   'META': {
//     name: 'Meta Platforms Inc.',
//     logo: META,
//     color: '#0081FB'
//   },
//   'NVDA': {
//     name: 'NVIDIA Corporation',
//     logo: NVDA,
//     color: '#76B900'
//   }
// //   'NFLX': {
// //     name: 'Netflix Inc.',
// //     logo: NFLX,
// //     color: '#E50914'
// //   },
// //   'INTC': {
// //     name: 'Intel Corporation',
// //     logo: INTC,
// //     color: '#0071C5'
// //   },
// //   'AMD': {
// //     name: 'Advanced Micro Devices',
// //     logo: AMD,
// //     color: '#ED1C24'
// //   }
// };

// // Get stock info with fallback
// export const getStockInfo = (symbol) => {
//   return stockInfo[symbol] || {
//     name: symbol,
//     logo: defaultLogo,
//     color: '#6B7280'
//   };
// };

// // All available stocks for subscription

// export const availableStocks = Object.keys(stockInfo);

// Stock logos mapping - Only 5 stocks
import GOOG from '../components/assets/Logos/Google.png';
import META from '../components/assets/Logos/Meta.png';
import NVDA from '../components/assets/Logos/Nvidia.png';
import TSLA from '../components/assets/Logos/Tesla.png';
import AMZN from '../components/assets/Logos/Amazon.png';

// Stock information mapping for 5 stocks only
export const stockInfo = {
  'GOOG': {
    name: 'Alphabet Inc. (Google)',
    logo: GOOG,
    color: '#4285F4'
  },
  'TSLA': {
    name: 'Tesla Inc.',
    logo: TSLA,
    color: '#CC0000'
  },
  'NVDA': {
    name: 'NVIDIA Corporation',
    logo: NVDA,
    color: '#76B900'
  },
  'AMZN': {
    name: 'Amazon.com Inc.',
    logo: AMZN,
    color: '#FF9900'
  },
    'META': {
    name: 'Meta Platforms Inc.',
    logo: META,
    color: '#0081FB'
  }
};

// Get stock info with fallback
export const getStockInfo = (symbol) => {
  const info = stockInfo[symbol];
  if (info) {
    return info;
  }
  // Return default info for unknown symbols
  return {
    name: symbol,
    logo: null,
    color: '#6B7280'
  };
};

// All available stocks for subscription (only 5)
export const availableStocks = Object.keys(stockInfo);