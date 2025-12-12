// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import CandlestickChart from './charts/CandlestickChart';
// // import TechnicalChart from './charts/TechnicalChart';
// // import MarketDepthChart from './charts/MarketDepthChart';
// // import PerformanceChart from './charts/PerformanceChart';
// // import { useWebSocket } from '../hooks/useWebSocket';

// // const AdvancedChartDashboard = ({ symbol, stockPrices, userId }) => {
// //   const [activeChart, setActiveChart] = useState('candlestick');
// //   const [timeframe, setTimeframe] = useState('1h');
// //   const [technicalIndicator, setTechnicalIndicator] = useState('rsi');
// //   const [chartData, setChartData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [isConnected, setIsConnected] = useState(false);
  
// //   const chartDataRef = useRef(null);
  
// //   // Use WebSocket hook
// //   const { getChartData, socket, isConnected: wsConnected } = useWebSocket(
// //     userId,
// //     null
// //   );

// //   // Chart types available
// //   const chartTypes = [
// //     { id: 'candlestick', name: 'Candlestick', icon: '📊' },
// //     { id: 'technical', name: 'Technical', icon: '⚙️' },
// //     { id: 'depth', name: 'Market Depth', icon: '📉' },
// //     { id: 'performance', name: 'Performance', icon: '📈' }
// //   ];

// //   // Timeframes
// //   const timeframes = [
// //     { value: '1m', label: '1 Min' },
// //     { value: '5m', label: '5 Min' },
// //     { value: '15m', label: '15 Min' },
// //     { value: '30m', label: '30 Min' },
// //     { value: '1h', label: '1 Hour' },
// //     { value: '4h', label: '4 Hours' },
// //     { value: '1d', label: '1 Day' },
// //     { value: '24h', label: '24 Hours' }
// //   ];

// //   // Technical indicators
// //   const indicators = [
// //     { value: 'rsi', label: 'RSI' },
// //     { value: 'macd', label: 'MACD' },
// //     { value: 'volume', label: 'Volume' }
// //   ];

// //   // Format data for charts from WebSocket response
// //   const formatChartData = useCallback((rawData) => {
// //     if (!rawData || !rawData.data) {
// //       console.error('Invalid chart data:', rawData);
// //       return null;
// //     }

// //     console.log(`📊 Formatting ${rawData.data.length} data points for ${rawData.symbol}`);
    
// //     // Convert backend data to chart format
// //     const candles = rawData.data.map(item => ({
// //       x: new Date(item.timestamp).getTime(),
// //       o: item.open || item.price,
// //       h: item.high || item.price,
// //       l: item.low || item.price,
// //       c: item.close || item.price,
// //       v: item.volume || Math.floor(1000000 + Math.random() * 5000000)
// //     }));

// //     // Calculate simple indicators
// //     const prices = rawData.data.map(item => item.price);
// //     const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
// //     return {
// //       candles: candles.slice(-50), // Last 50 points
// //       indicators: {
// //         rsi: Math.min(70, Math.max(30, 50 + Math.sin(Date.now() / 1000000) * 20)),
// //         macd: { macd: 0.5, signal: 0.3, histogram: 0.2 },
// //         movingAverages: { 
// //           sma20: avgPrice * 0.98, 
// //           sma50: avgPrice * 1.02 
// //         },
// //         bollingerBands: { 
// //           upper: avgPrice * 1.05, 
// //           middle: avgPrice, 
// //           lower: avgPrice * 0.95 
// //         }
// //       },
// //       summary: {
// //         open: rawData.data[0]?.price || 0,
// //         high: Math.max(...prices),
// //         low: Math.min(...prices),
// //         close: rawData.data[rawData.data.length - 1]?.price || 0,
// //         volume: rawData.data.reduce((sum, item) => sum + (item.volume || 0), 0)
// //       }
// //     };
// //   }, []);

// //   // Generate sample data for fallback
// //   const generateSampleData = useCallback((sym) => {
// //     const basePrice = stockPrices[sym]?.price || {
// //       'GOOG': 317.75,
// //       'TSLA': 445.17,
// //       'AMZN': 227.92,
// //       'META': 656.96,
// //       'NVDA': 184.97
// //     }[sym] || 100;

// //     const candles = [];
// //     for (let i = 0; i < 50; i++) {
// //       const timeOffset = (50 - i - 1) * 60 * 60 * 1000;
// //       const timestamp = new Date(Date.now() - timeOffset);
// //       const variation = Math.sin(i / 10) * 10 + (Math.random() - 0.5) * 5;
// //       const price = basePrice + variation;
      
// //       candles.push({
// //         x: timestamp.getTime(),
// //         o: price + (Math.random() - 0.5) * 2,
// //         h: price + Math.random() * 3,
// //         l: price - Math.random() * 3,
// //         c: price + (Math.random() - 0.5) * 2,
// //         v: Math.floor(500000 + Math.random() * 1500000)
// //       });
// //     }

// //     return {
// //       candles,
// //       indicators: {
// //         rsi: 50 + Math.sin(Date.now() / 1000000) * 20,
// //         macd: { macd: 0.5, signal: 0.3, histogram: 0.2 },
// //         movingAverages: { sma20: basePrice, sma50: basePrice + 2 },
// //         bollingerBands: { upper: basePrice + 5, middle: basePrice, lower: basePrice - 5 }
// //       },
// //       summary: {
// //         open: candles[0].o,
// //         high: Math.max(...candles.map(c => c.h)),
// //         low: Math.min(...candles.map(c => c.l)),
// //         close: candles[candles.length - 1].c,
// //         volume: candles.reduce((sum, c) => sum + c.v, 0)
// //       }
// //     };
// //   }, [stockPrices]);

// //   // Fetch chart data via WebSocket
// //   const fetchChartData = useCallback(() => {
// //     if (!symbol) return;
    
// //     setLoading(true);
// //     setError('');
    
// //     console.log(`🔄 Fetching chart for ${symbol}, timeframe: ${timeframe}`);
    
// //     getChartData(symbol, timeframe, (response) => {
// //       console.log('📨 Chart data callback received:', response);
      
// //       if (response && response.data) {
// //         const formattedData = formatChartData(response);
// //         if (formattedData) {
// //           chartDataRef.current = formattedData;
// //           setChartData(formattedData);
// //           setError('');
// //         } else {
// //           setError('Failed to format chart data');
// //           // Fallback to sample data
// //           const sampleData = generateSampleData(symbol);
// //           chartDataRef.current = sampleData;
// //           setChartData(sampleData);
// //         }
// //       } else {
// //         setError('No chart data received from server');
// //         // Fallback to sample data
// //         const sampleData = generateSampleData(symbol);
// //         chartDataRef.current = sampleData;
// //         setChartData(sampleData);
// //       }
// //       setLoading(false);
// //     });
// //   }, [symbol, timeframe, getChartData, formatChartData, generateSampleData]);

// //   useEffect(() => {
// //     setIsConnected(wsConnected);
// //   }, [wsConnected]);

// //   useEffect(() => {
// //     if (symbol && activeChart !== 'performance' && isConnected) {
// //       fetchChartData();
// //     } else if (symbol && !isConnected) {
// //       setError('⚠️ WebSocket not connected. Using sample data.');
// //       // Use sample data while connecting
// //       const sampleData = generateSampleData(symbol);
// //       chartDataRef.current = sampleData;
// //       setChartData(sampleData);
// //     }
// //   }, [symbol, timeframe, activeChart, isConnected, fetchChartData, generateSampleData]);

// //   useEffect(() => {
// //     // Auto-refresh chart data every 30 seconds
// //     if (symbol && isConnected && activeChart !== 'performance') {
// //       const interval = setInterval(() => {
// //         console.log(`🔄 Auto-refreshing chart for ${symbol}`);
// //         fetchChartData();
// //       }, 30000);

// //       return () => clearInterval(interval);
// //     }
// //   }, [symbol, isConnected, activeChart, fetchChartData]);

// //   const currentPrice = stockPrices[symbol]?.price || 0;

// //   // Render active chart
// //   const renderActiveChart = useCallback(() => {
// //     if (loading) {
// //       return (
// //         <div style={{
// //           height: '500px',
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'center',
// //           flexDirection: 'column'
// //         }}>
// //           <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
// //             <span className="visually-hidden">Loading...</span>
// //           </div>
// //           <p style={{ marginTop: '20px', color: '#666' }}>
// //             Loading {symbol} chart data...
// //           </p>
// //         </div>
// //       );
// //     }

// //     if (error && !chartData) {
// //       return (
// //         <div style={{
// //           height: '500px',
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'center',
// //           flexDirection: 'column'
// //         }}>
// //           <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
// //           <div style={{ color: '#666', marginBottom: '10px', textAlign: 'center' }}>{error}</div>
// //           <button 
// //             onClick={fetchChartData}
// //             className="btn btn-primary"
// //             disabled={!isConnected}
// //           >
// //             {isConnected ? 'Retry' : 'Connecting...'}
// //           </button>
// //         </div>
// //       );
// //     }

// //     if (!chartData) {
// //       return (
// //         <div style={{
// //           height: '500px',
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'center',
// //           color: '#666'
// //         }}>
// //           No chart data available
// //         </div>
// //       );
// //     }

// //     switch(activeChart) {
// //       case 'candlestick':
// //         return (
// //           <CandlestickChart
// //             data={chartData}
// //             symbol={symbol}
// //             timeframe={timeframe}
// //           />
// //         );
        
// //       case 'technical':
// //         return (
// //           <div style={{ height: '500px' }}>
// //             <TechnicalChart
// //               data={chartData}
// //               symbol={symbol}
// //               timeframe={timeframe}
// //               indicator={technicalIndicator}
// //             />
// //           </div>
// //         );
        
// //       case 'depth':
// //         return (
// //           <MarketDepthChart
// //             symbol={symbol}
// //             currentPrice={currentPrice}
// //           />
// //         );
        
// //       case 'performance':
// //         return <PerformanceChart symbol={symbol} />;
        
// //       default:
// //         return (
// //           <div style={{
// //             height: '500px',
// //             display: 'flex',
// //             alignItems: 'center',
// //             justifyContent: 'center',
// //             color: '#666'
// //           }}>
// //             Select a chart type to begin
// //           </div>
// //         );
// //     }
// //   }, [loading, error, chartData, symbol, timeframe, activeChart, technicalIndicator, currentPrice, isConnected, fetchChartData]);

// //   return (
// //     <div className="card" style={{ padding: '20px' }}>
// //       {/* Header */}
// //       <div style={{
// //         display: 'flex',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         marginBottom: '20px',
// //         flexWrap: 'wrap',
// //         gap: '10px'
// //       }}>
// //         <div style={{ flex: 1 }}>
// //           <h3 style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
// //             <span>{symbol} Advanced Charts</span>
// //             <span style={{
// //               fontSize: '12px',
// //               padding: '2px 8px',
// //               borderRadius: '10px',
// //               backgroundColor: isConnected ? '#28a745' : '#dc3545',
// //               color: 'white'
// //             }}>
// //               {isConnected ? '🟢 Live' : '🔴 Offline'}
// //             </span>
// //           </h3>
// //           <p style={{ color: '#666', fontSize: '14px' }}>
// //             {isConnected ? 'Real-time WebSocket connection active' : 'Connecting to WebSocket server...'}
// //             {currentPrice > 0 && (
// //               <span style={{
// //                 marginLeft: '10px',
// //                 color: stockPrices[symbol]?.change >= 0 ? '#26a69a' : '#ef5350',
// //                 fontWeight: '600'
// //               }}>
// //                 ${currentPrice.toFixed(2)}
// //                 {stockPrices[symbol]?.change >= 0 ? ' ↗' : ' ↘'}
// //               </span>
// //             )}
// //           </p>
// //         </div>

// //         {/* Timeframe selector */}
// //         <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
// //           {timeframes.map(tf => (
// //             <button
// //               key={tf.value}
// //               onClick={() => setTimeframe(tf.value)}
// //               style={{
// //                 padding: '5px 10px',
// //                 fontSize: '12px',
// //                 backgroundColor: timeframe === tf.value ? '#007bff' : '#f8f9fa',
// //                 color: timeframe === tf.value ? 'white' : '#333',
// //                 border: `1px solid ${timeframe === tf.value ? '#007bff' : '#dee2e6'}`,
// //                 borderRadius: '4px',
// //                 cursor: 'pointer',
// //                 transition: 'all 0.2s'
// //               }}
// //             >
// //               {tf.label}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Chart type selector */}
// //       <div style={{
// //         display: 'flex',
// //         gap: '10px',
// //         marginBottom: '20px',
// //         overflowX: 'auto',
// //         paddingBottom: '10px'
// //       }}>
// //         {chartTypes.map(chart => (
// //           <button
// //             key={chart.id}
// //             onClick={() => setActiveChart(chart.id)}
// //             style={{
// //               display: 'flex',
// //               flexDirection: 'column',
// //               alignItems: 'center',
// //               padding: '15px',
// //               minWidth: '100px',
// //               backgroundColor: activeChart === chart.id ? '#007bff' : '#f8f9fa',
// //               color: activeChart === chart.id ? 'white' : '#333',
// //               border: `1px solid ${activeChart === chart.id ? '#007bff' : '#dee2e6'}`,
// //               borderRadius: '8px',
// //               cursor: 'pointer',
// //               transition: 'all 0.3s'
// //             }}
// //           >
// //             <span style={{ fontSize: '24px', marginBottom: '5px' }}>
// //               {chart.icon}
// //             </span>
// //             <span style={{ fontSize: '12px', fontWeight: '600' }}>
// //               {chart.name}
// //             </span>
// //           </button>
// //         ))}
// //       </div>

// //       {/* Technical indicator selector */}
// //       {activeChart === 'technical' && (
// //         <div style={{ marginBottom: '20px' }}>
// //           <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
// //             Select Indicator:
// //           </div>
// //           <div style={{ display: 'flex', gap: '5px' }}>
// //             {indicators.map(ind => (
// //               <button
// //                 key={ind.value}
// //                 onClick={() => setTechnicalIndicator(ind.value)}
// //                 style={{
// //                   padding: '5px 15px',
// //                   fontSize: '12px',
// //                   backgroundColor: technicalIndicator === ind.value ? '#28a745' : '#f8f9fa',
// //                   color: technicalIndicator === ind.value ? 'white' : '#333',
// //                   border: `1px solid ${technicalIndicator === ind.value ? '#28a745' : '#dee2e6'}`,
// //                   borderRadius: '4px',
// //                   cursor: 'pointer'
// //                 }}
// //               >
// //                 {ind.label}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* Chart container */}
// //       <div style={{
// //         border: '1px solid #dee2e6',
// //         borderRadius: '8px',
// //         padding: '20px',
// //         backgroundColor: 'white',
// //         minHeight: '500px'
// //       }}>
// //         {renderActiveChart()}
// //       </div>

// //       {/* Chart statistics */}
// //       {chartData && chartData.summary && (
// //         <div style={{
// //           display: 'grid',
// //           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
// //           gap: '15px',
// //           marginTop: '20px',
// //           paddingTop: '20px',
// //           borderTop: '1px solid #eee'
// //         }}>
// //           <div>
// //             <div style={{ fontSize: '12px', color: '#666' }}>Open</div>
// //             <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
// //               ${chartData.summary.open?.toFixed(2) || '0.00'}
// //             </div>
// //           </div>
// //           <div>
// //             <div style={{ fontSize: '12px', color: '#666' }}>High</div>
// //             <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#26a69a' }}>
// //               ${chartData.summary.high?.toFixed(2) || '0.00'}
// //             </div>
// //           </div>
// //           <div>
// //             <div style={{ fontSize: '12px', color: '#666' }}>Low</div>
// //             <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef5350' }}>
// //               ${chartData.summary.low?.toFixed(2) || '0.00'}
// //             </div>
// //           </div>
// //           <div>
// //             <div style={{ fontSize: '12px', color: '#666' }}>Close</div>
// //             <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
// //               ${chartData.summary.close?.toFixed(2) || '0.00'}
// //             </div>
// //           </div>
// //           <div>
// //             <div style={{ fontSize: '12px', color: '#666' }}>Volume</div>
// //             <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
// //               {chartData.summary.volume?.toLocaleString() || '0'}
// //             </div>
// //           </div>
// //           <div>
// //             <div style={{ fontSize: '12px', color: '#666' }}>RSI</div>
// //             <div style={{ 
// //               fontSize: '16px', 
// //               fontWeight: 'bold',
// //               color: chartData.indicators?.rsi > 70 ? '#ef5350' :
// //                      chartData.indicators?.rsi < 30 ? '#26a69a' : '#666'
// //             }}>
// //               {chartData.indicators?.rsi?.toFixed(2) || '50.00'}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdvancedChartDashboard;
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import CandlestickChart from './charts/CandlestickChart';
// import TechnicalChart from './charts/TechnicalChart';
// import MarketDepthChart from './charts/MarketDepthChart';
// import PerformanceChart from './charts/PerformanceChart';
// import { useWebSocket } from '../hooks/useWebSocket';

// const AdvancedChartDashboard = ({ symbol, stockPrices, userId }) => {
//   const [activeChart, setActiveChart] = useState('candlestick');
//   const [timeframe, setTimeframe] = useState('1h');
//   const [technicalIndicator, setTechnicalIndicator] = useState('rsi');
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const [debugInfo, setDebugInfo] = useState('');
  
//   const chartDataRef = useRef(null);
//   const chartRequestCountRef = useRef(0);
  
//   // Use WebSocket hook
//   const { getChartData, socket, isConnected: wsConnected } = useWebSocket(
//     userId,
//     null
//   );

//   // Chart types available
//   const chartTypes = [
//     { id: 'candlestick', name: 'Candlestick', icon: '📊' },
//     { id: 'technical', name: 'Technical', icon: '⚙️' },
//     { id: 'depth', name: 'Market Depth', icon: '📉' },
//     { id: 'performance', name: 'Performance', icon: '📈' }
//   ];

//   // Timeframes
//   const timeframes = [
//     { value: '1m', label: '1 Min' },
//     { value: '5m', label: '5 Min' },
//     { value: '15m', label: '15 Min' },
//     { value: '30m', label: '30 Min' },
//     { value: '1h', label: '1 Hour' },
//     { value: '4h', label: '4 Hours' },
//     { value: '1d', label: '1 Day' },
//     { value: '24h', label: '24 Hours' }
//   ];

//   // Technical indicators
//   const indicators = [
//     { value: 'rsi', label: 'RSI' },
//     { value: 'macd', label: 'MACD' },
//     { value: 'volume', label: 'Volume' }
//   ];

//   // Format data for charts from WebSocket response
//   const formatChartData = useCallback((rawData) => {
//     if (!rawData || !rawData.data) {
//       console.error('Invalid chart data:', rawData);
//       setDebugInfo(`Invalid chart data received: ${JSON.stringify(rawData)}`);
//       return null;
//     }

//     console.log(`📊 Formatting ${rawData.data.length} data points for ${rawData.symbol}`);
//     setDebugInfo(`Received ${rawData.data.length} data points for ${rawData.symbol}`);
    
//     // Convert backend data to chart format
//     const candles = rawData.data.map(item => ({
//       x: new Date(item.timestamp).getTime(),
//       o: item.open || item.price,
//       h: item.high || item.price,
//       l: item.low || item.price,
//       c: item.close || item.price,
//       v: item.volume || Math.floor(1000000 + Math.random() * 5000000)
//     }));

//     // Calculate simple indicators
//     const prices = rawData.data.map(item => item.price);
//     const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
//     return {
//       candles: candles.slice(-50), // Last 50 points
//       indicators: {
//         rsi: Math.min(70, Math.max(30, 50 + Math.sin(Date.now() / 1000000) * 20)),
//         macd: { macd: 0.5, signal: 0.3, histogram: 0.2 },
//         movingAverages: { 
//           sma20: avgPrice * 0.98, 
//           sma50: avgPrice * 1.02 
//         },
//         bollingerBands: { 
//           upper: avgPrice * 1.05, 
//           middle: avgPrice, 
//           lower: avgPrice * 0.95 
//         }
//       },
//       summary: {
//         open: rawData.data[0]?.price || 0,
//         high: Math.max(...prices),
//         low: Math.min(...prices),
//         close: rawData.data[rawData.data.length - 1]?.price || 0,
//         volume: rawData.data.reduce((sum, item) => sum + (item.volume || 0), 0)
//       }
//     };
//   }, []);

//   // Generate sample data for fallback
//   const generateSampleData = useCallback((sym) => {
//     console.log(`🎨 Generating sample data for ${sym}`);
//     const basePrice = stockPrices[sym]?.price || {
//       'GOOG': 321,
//       'TSLA': 451.45,
//       'AMZN': 231.78,
//       'META': 650.13,
//       'NVDA': 183.78
//     }[sym] || 100;

//     const candles = [];
//     for (let i = 0; i < 50; i++) {
//       const timeOffset = (50 - i - 1) * 60 * 60 * 1000;
//       const timestamp = new Date(Date.now() - timeOffset);
//       const variation = Math.sin(i / 10) * 10 + (Math.random() - 0.5) * 5;
//       const price = basePrice + variation;
      
//       candles.push({
//         x: timestamp.getTime(),
//         o: price + (Math.random() - 0.5) * 2,
//         h: price + Math.random() * 3,
//         l: price - Math.random() * 3,
//         c: price + (Math.random() - 0.5) * 2,
//         v: Math.floor(500000 + Math.random() * 1500000)
//       });
//     }

//     return {
//       candles,
//       indicators: {
//         rsi: 50 + Math.sin(Date.now() / 1000000) * 20,
//         macd: { macd: 0.5, signal: 0.3, histogram: 0.2 },
//         movingAverages: { sma20: basePrice, sma50: basePrice + 2 },
//         bollingerBands: { upper: basePrice + 5, middle: basePrice, lower: basePrice - 5 }
//       },
//       summary: {
//         open: candles[0].o,
//         high: Math.max(...candles.map(c => c.h)),
//         low: Math.min(...candles.map(c => c.l)),
//         close: candles[candles.length - 1].c,
//         volume: candles.reduce((sum, c) => sum + c.v, 0)
//       }
//     };
//   }, [stockPrices]);

//   // Fetch chart data via WebSocket
//   const fetchChartData = useCallback(() => {
//     if (!symbol) {
//       console.warn('⚠️ No symbol selected for chart');
//       setDebugInfo('No symbol selected');
//       return;
//     }
    
//     chartRequestCountRef.current += 1;
//     const requestId = chartRequestCountRef.current;
    
//     setLoading(true);
//     setError('');
//     setDebugInfo(`Request #${requestId}: Fetching ${symbol} (${timeframe})...`);
    
//     console.log(`🔄 [${requestId}] Fetching chart for ${symbol}, timeframe: ${timeframe}`);
    
//     getChartData(symbol, timeframe, (response) => {
//       console.log(`📨 [${requestId}] Chart data callback received:`, response);
      
//       if (response && response.data && Array.isArray(response.data)) {
//         setDebugInfo(`✅ [${requestId}] Received ${response.data.length} data points`);
//         const formattedData = formatChartData(response);
//         if (formattedData) {
//           chartDataRef.current = formattedData;
//           setChartData(formattedData);
//           setError('');
//         } else {
//           setError('Failed to format chart data');
//           setDebugInfo(`❌ [${requestId}] Formatting failed`);
//           // Fallback to sample data
//           const sampleData = generateSampleData(symbol);
//           chartDataRef.current = sampleData;
//           setChartData(sampleData);
//         }
//       } else {
//         const errorMsg = response?.error || 'No valid chart data received from server';
//         setError(errorMsg);
//         setDebugInfo(`❌ [${requestId}] ${errorMsg}`);
//         console.warn(`⚠️ [${requestId}] Invalid response:`, response);
        
//         // Fallback to sample data
//         const sampleData = generateSampleData(symbol);
//         chartDataRef.current = sampleData;
//         setChartData(sampleData);
//       }
//       setLoading(false);
//     });
//   }, [symbol, timeframe, getChartData, formatChartData, generateSampleData]);

//   useEffect(() => {
//     console.log('🔄 WebSocket connection status changed:', wsConnected);
//     setIsConnected(wsConnected);
//     if (wsConnected) {
//       setDebugInfo('✅ WebSocket connected');
//     } else {
//       setDebugInfo('🔴 WebSocket disconnected');
//     }
//   }, [wsConnected]);

//   useEffect(() => {
//     if (symbol && activeChart !== 'performance' && isConnected) {
//       console.log(`📈 Fetching chart for ${symbol} (connected: ${isConnected})`);
//       fetchChartData();
//     } else if (symbol && !isConnected) {
//       console.warn(`⚠️ WebSocket not connected for ${symbol}`);
//       setError('⚠️ WebSocket not connected. Using sample data.');
//       setDebugInfo('🔴 Using sample data (no WebSocket)');
//       // Use sample data while connecting
//       const sampleData = generateSampleData(symbol);
//       chartDataRef.current = sampleData;
//       setChartData(sampleData);
//     }
//   }, [symbol, timeframe, activeChart, isConnected, fetchChartData, generateSampleData]);

//   useEffect(() => {
//     // Auto-refresh chart data every 30 seconds only when connected
//     if (symbol && isConnected && activeChart !== 'performance') {
//       console.log(`⏰ Setting up auto-refresh for ${symbol}`);
//       const interval = setInterval(() => {
//         console.log(`🔄 Auto-refreshing chart for ${symbol}`);
//         fetchChartData();
//       }, 30000);

//       return () => {
//         console.log(`🧹 Cleaning up auto-refresh for ${symbol}`);
//         clearInterval(interval);
//       };
//     }
//   }, [symbol, isConnected, activeChart, fetchChartData]);

//   const currentPrice = stockPrices[symbol]?.price || 0;

//   // Render active chart
//   const renderActiveChart = useCallback(() => {
//     if (loading) {
//       return (
//         <div style={{
//           height: '500px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flexDirection: 'column'
//         }}>
//           <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p style={{ marginTop: '20px', color: '#666' }}>
//             Loading {symbol} chart data...
//           </p>
//           <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
//             {debugInfo}
//           </p>
//         </div>
//       );
//     }

//     if (error && !chartData) {
//       return (
//         <div style={{
//           height: '500px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flexDirection: 'column'
//         }}>
//           <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
//           <div style={{ color: '#666', marginBottom: '10px', textAlign: 'center' }}>{error}</div>
//           <p style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>
//             {debugInfo}
//           </p>
//           <button 
//             onClick={fetchChartData}
//             className="btn btn-primary"
//             disabled={!isConnected}
//           >
//             {isConnected ? 'Retry' : 'Connecting...'}
//           </button>
//         </div>
//       );
//     }

//     if (!chartData) {
//       return (
//         <div style={{
//           height: '500px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flexDirection: 'column',
//           color: '#666'
//         }}>
//           <div>No chart data available</div>
//           <div style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
//             {debugInfo}
//           </div>
//         </div>
//       );
//     }

//     switch(activeChart) {
//       case 'candlestick':
//         return (
//           <>
//             <CandlestickChart
//               data={chartData}
//               symbol={symbol}
//               timeframe={timeframe}
//             />
//             <div style={{ fontSize: '11px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
//               {debugInfo}
//             </div>
//           </>
//         );
        
//       case 'technical':
//         return (
//           <div style={{ height: '500px' }}>
//             <TechnicalChart
//               data={chartData}
//               symbol={symbol}
//               timeframe={timeframe}
//               indicator={technicalIndicator}
//             />
//           </div>
//         );
        
//       case 'depth':
//         return (
//           <MarketDepthChart
//             symbol={symbol}
//             currentPrice={currentPrice}
//           />
//         );
        
//       case 'performance':
//         return <PerformanceChart symbol={symbol} />;
        
//       default:
//         return (
//           <div style={{
//             height: '500px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: '#666'
//           }}>
//             Select a chart type to begin
//           </div>
//         );
//     }
//   }, [loading, error, chartData, symbol, timeframe, activeChart, technicalIndicator, currentPrice, isConnected, fetchChartData, debugInfo]);

//   return (
//     <div className="card" style={{ padding: '20px' }}>
//       {/* Header */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '20px',
//         flexWrap: 'wrap',
//         gap: '10px'
//       }}>
//         <div style={{ flex: 1 }}>
//           <h3 style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <span>{symbol} Advanced Charts</span>
//             <span style={{
//               fontSize: '12px',
//               padding: '2px 8px',
//               borderRadius: '10px',
//               backgroundColor: isConnected ? '#28a745' : '#dc3545',
//               color: 'white'
//             }}>
//               {isConnected ? '🟢 Live' : '🔴 Offline'}
//             </span>
//           </h3>
//           <p style={{ color: '#666', fontSize: '14px' }}>
//             {isConnected ? 'Real-time WebSocket connection active' : 'Connecting to WebSocket server...'}
//             {currentPrice > 0 && (
//               <span style={{
//                 marginLeft: '10px',
//                 color: stockPrices[symbol]?.change >= 0 ? '#26a69a' : '#ef5350',
//                 fontWeight: '600'
//               }}>
//                 ${currentPrice.toFixed(2)}
//                 {stockPrices[symbol]?.change >= 0 ? ' ↗' : ' ↘'}
//               </span>
//             )}
//           </p>
//         </div>

//         {/* Timeframe selector */}
//         <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
//           {timeframes.map(tf => (
//             <button
//               key={tf.value}
//               onClick={() => {
//                 console.log(`🔄 Changing timeframe from ${timeframe} to ${tf.value}`);
//                 setTimeframe(tf.value);
//               }}
//               style={{
//                 padding: '5px 10px',
//                 fontSize: '12px',
//                 backgroundColor: timeframe === tf.value ? '#007bff' : '#f8f9fa',
//                 color: timeframe === tf.value ? 'white' : '#333',
//                 border: `1px solid ${timeframe === tf.value ? '#007bff' : '#dee2e6'}`,
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s'
//               }}
//             >
//               {tf.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chart type selector */}
//       <div style={{
//         display: 'flex',
//         gap: '10px',
//         marginBottom: '20px',
//         overflowX: 'auto',
//         paddingBottom: '10px'
//       }}>
//         {chartTypes.map(chart => (
//           <button
//             key={chart.id}
//             onClick={() => {
//               console.log(`🔄 Changing chart type from ${activeChart} to ${chart.id}`);
//               setActiveChart(chart.id);
//             }}
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               padding: '15px',
//               minWidth: '100px',
//               backgroundColor: activeChart === chart.id ? '#007bff' : '#f8f9fa',
//               color: activeChart === chart.id ? 'white' : '#333',
//               border: `1px solid ${activeChart === chart.id ? '#007bff' : '#dee2e6'}`,
//               borderRadius: '8px',
//               cursor: 'pointer',
//               transition: 'all 0.3s'
//             }}
//           >
//             <span style={{ fontSize: '24px', marginBottom: '5px' }}>
//               {chart.icon}
//             </span>
//             <span style={{ fontSize: '12px', fontWeight: '600' }}>
//               {chart.name}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Technical indicator selector */}
//       {activeChart === 'technical' && (
//         <div style={{ marginBottom: '20px' }}>
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
//             Select Indicator:
//           </div>
//           <div style={{ display: 'flex', gap: '5px' }}>
//             {indicators.map(ind => (
//               <button
//                 key={ind.value}
//                 onClick={() => setTechnicalIndicator(ind.value)}
//                 style={{
//                   padding: '5px 15px',
//                   fontSize: '12px',
//                   backgroundColor: technicalIndicator === ind.value ? '#28a745' : '#f8f9fa',
//                   color: technicalIndicator === ind.value ? 'white' : '#333',
//                   border: `1px solid ${technicalIndicator === ind.value ? '#28a745' : '#dee2e6'}`,
//                   borderRadius: '4px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {ind.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Chart container */}
//       <div style={{
//         border: '1px solid #dee2e6',
//         borderRadius: '8px',
//         padding: '20px',
//         backgroundColor: 'white',
//         minHeight: '500px'
//       }}>
//         {renderActiveChart()}
//       </div>

//       {/* Chart statistics */}
//       {chartData && chartData.summary && (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//           gap: '15px',
//           marginTop: '20px',
//           paddingTop: '20px',
//           borderTop: '1px solid #eee'
//         }}>
//           <div>
//             <div style={{ fontSize: '12px', color: '#666' }}>Open</div>
//             <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
//               ${chartData.summary.open?.toFixed(2) || '0.00'}
//             </div>
//           </div>
//           <div>
//             <div style={{ fontSize: '12px', color: '#666' }}>High</div>
//             <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#26a69a' }}>
//               ${chartData.summary.high?.toFixed(2) || '0.00'}
//             </div>
//           </div>
//           <div>
//             <div style={{ fontSize: '12px', color: '#666' }}>Low</div>
//             <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef5350' }}>
//               ${chartData.summary.low?.toFixed(2) || '0.00'}
//             </div>
//           </div>
//           <div>
//             <div style={{ fontSize: '12px', color: '#666' }}>Close</div>
//             <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
//               ${chartData.summary.close?.toFixed(2) || '0.00'}
//             </div>
//           </div>
//           <div>
//             <div style={{ fontSize: '12px', color: '#666' }}>Volume</div>
//             <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
//               {chartData.summary.volume?.toLocaleString() || '0'}
//             </div>
//           </div>
//           <div>
//             <div style={{ fontSize: '12px', color: '#666' }}>RSI</div>
//             <div style={{ 
//               fontSize: '16px', 
//               fontWeight: 'bold',
//               color: chartData.indicators?.rsi > 70 ? '#ef5350' :
//                      chartData.indicators?.rsi < 30 ? '#26a69a' : '#666'
//             }}>
//               {chartData.indicators?.rsi?.toFixed(2) || '50.00'}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdvancedChartDashboard;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import CandlestickChart from './charts/CandlestickChart';
import TechnicalChart from './charts/TechnicalChart';
import MarketDepthChart from './charts/MarketDepthChart';
import PerformanceChart from './charts/PerformanceChart';
import { useWebSocket } from '../hooks/useWebSocket';

const AdvancedChartDashboard = ({ symbol, stockPrices, userId }) => {
  const [activeChart, setActiveChart] = useState('candlestick');
  const [timeframe, setTimeframe] = useState('1h');
  const [technicalIndicator, setTechnicalIndicator] = useState('rsi');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const chartDataRef = useRef(null);
  const chartRequestCountRef = useRef(0);
  const autoRefreshIntervalRef = useRef(null);
  
  // Use WebSocket hook
  const { getChartData, socket, isConnected: wsConnected } = useWebSocket(
    userId,
    null
  );

  // Chart types available
  const chartTypes = [
    { id: 'candlestick', name: 'Candlestick', icon: '📊' },
    { id: 'technical', name: 'Technical', icon: '⚙️' },
    { id: 'depth', name: 'Market Depth', icon: '📉' },
    { id: 'performance', name: 'Performance', icon: '📈' }
  ];

  // Timeframes
  const timeframes = [
    { value: '1m', label: '1 Min' },
    { value: '5m', label: '5 Min' },
    { value: '15m', label: '15 Min' },
    { value: '30m', label: '30 Min' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' },
    { value: '24h', label: '24 Hours' }
  ];

  // Technical indicators
  const indicators = [
    { value: 'rsi', label: 'RSI' },
    { value: 'macd', label: 'MACD' },
    { value: 'volume', label: 'Volume' }
  ];

  // Format data for charts from WebSocket response
  const formatChartData = useCallback((rawData) => {
    if (!rawData || !rawData.data) {
      console.error('Invalid chart data:', rawData);
      return null;
    }

    console.log(`📊 Formatting ${rawData.data.length} data points for ${rawData.symbol}`);
    
    // Convert backend data to chart format
    const candles = rawData.data.map(item => ({
      x: new Date(item.timestamp).getTime(),
      o: item.open || item.price,
      h: item.high || item.price,
      l: item.low || item.price,
      c: item.close || item.price,
      v: item.volume || Math.floor(1000000 + Math.random() * 5000000)
    }));

    // Calculate simple indicators
    const prices = rawData.data.map(item => item.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    return {
      candles: candles.slice(-50), // Last 50 points
      indicators: {
        rsi: Math.min(70, Math.max(30, 50 + Math.sin(Date.now() / 1000000) * 20)),
        macd: { macd: 0.5, signal: 0.3, histogram: 0.2 },
        movingAverages: { 
          sma20: avgPrice * 0.98, 
          sma50: avgPrice * 1.02 
        },
        bollingerBands: { 
          upper: avgPrice * 1.05, 
          middle: avgPrice, 
          lower: avgPrice * 0.95 
        }
      },
      summary: {
        open: rawData.data[0]?.price || 0,
        high: Math.max(...prices),
        low: Math.min(...prices),
        close: rawData.data[rawData.data.length - 1]?.price || 0,
        volume: rawData.data.reduce((sum, item) => sum + (item.volume || 0), 0)
      }
    };
  }, []);

  // Generate sample data for fallback
  const generateSampleData = useCallback((sym) => {
    const basePrice = stockPrices[sym]?.price || {
      'GOOG': 321,
      'TSLA': 451.45,
      'AMZN': 231.78,
      'META': 650.13,
      'NVDA': 183.78
    }[sym] || 100;

    const candles = [];
    for (let i = 0; i < 50; i++) {
      const timeOffset = (50 - i - 1) * 60 * 60 * 1000;
      const timestamp = new Date(Date.now() - timeOffset);
      const variation = Math.sin(i / 10) * 10 + (Math.random() - 0.5) * 5;
      const price = basePrice + variation;
      
      candles.push({
        x: timestamp.getTime(),
        o: price + (Math.random() - 0.5) * 2,
        h: price + Math.random() * 3,
        l: price - Math.random() * 3,
        c: price + (Math.random() - 0.5) * 2,
        v: Math.floor(500000 + Math.random() * 1500000)
      });
    }

    return {
      candles,
      indicators: {
        rsi: 50 + Math.sin(Date.now() / 1000000) * 20,
        macd: { macd: 0.5, signal: 0.3, histogram: 0.2 },
        movingAverages: { sma20: basePrice, sma50: basePrice + 2 },
        bollingerBands: { upper: basePrice + 5, middle: basePrice, lower: basePrice - 5 }
      },
      summary: {
        open: candles[0].o,
        high: Math.max(...candles.map(c => c.h)),
        low: Math.min(...candles.map(c => c.l)),
        close: candles[candles.length - 1].c,
        volume: candles.reduce((sum, c) => sum + c.v, 0)
      }
    };
  }, [stockPrices]);

  // Fetch chart data via WebSocket - UPDATED to not show loading for auto-refresh
  const fetchChartData = useCallback((isAutoRefresh = false) => {
    if (!symbol) return;
    
    // Only show loading for initial load or manual refresh
    if (!isAutoRefresh) {
      setLoading(true);
    }
    
    setError('');
    setIsRefreshing(isAutoRefresh);
    
    chartRequestCountRef.current += 1;
    const requestId = chartRequestCountRef.current;
    
    console.log(`🔄 [${requestId}] ${isAutoRefresh ? 'Auto-refreshing' : 'Fetching'} chart for ${symbol}, timeframe: ${timeframe}`);
    
    getChartData(symbol, timeframe, (response) => {
      console.log(`📨 [${requestId}] Chart data callback received:`, response);
      
      if (response && response.data && Array.isArray(response.data)) {
        const formattedData = formatChartData(response);
        if (formattedData) {
          chartDataRef.current = formattedData;
          setChartData(formattedData);
          setError('');
        } else {
          if (!isAutoRefresh) {
            setError('Failed to format chart data');
          }
          // Keep existing data if auto-refresh fails
          if (!chartDataRef.current) {
            const sampleData = generateSampleData(symbol);
            chartDataRef.current = sampleData;
            setChartData(sampleData);
          }
        }
      } else {
        if (!isAutoRefresh) {
          const errorMsg = response?.error || 'No valid chart data received from server';
          setError(errorMsg);
        }
        console.warn(`⚠️ [${requestId}] Invalid response:`, response);
        
        // Keep existing data if auto-refresh fails
        if (!chartDataRef.current) {
          const sampleData = generateSampleData(symbol);
          chartDataRef.current = sampleData;
          setChartData(sampleData);
        }
      }
      
      // Only reset loading if it was an initial load
      if (!isAutoRefresh) {
        setLoading(false);
      }
      setIsRefreshing(false);
    });
  }, [symbol, timeframe, getChartData, formatChartData, generateSampleData]);

  // Handle manual refresh
  const handleManualRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    fetchChartData(false);
  }, [fetchChartData]);

  useEffect(() => {
    console.log('🔄 WebSocket connection status changed:', wsConnected);
    setIsConnected(wsConnected);
  }, [wsConnected]);

  // Initial data load
  useEffect(() => {
    if (symbol && activeChart !== 'performance' && isConnected) {
      console.log(`📈 Initial chart load for ${symbol} (connected: ${isConnected})`);
      fetchChartData(false);
    } else if (symbol && !isConnected) {
      console.warn(`⚠️ WebSocket not connected for ${symbol}`);
      setError('⚠️ WebSocket not connected. Using sample data.');
      // Use sample data while connecting
      const sampleData = generateSampleData(symbol);
      chartDataRef.current = sampleData;
      setChartData(sampleData);
      setLoading(false);
    }
  }, [symbol, activeChart, isConnected, fetchChartData, generateSampleData]);

  // Auto-refresh setup - UPDATED to use separate state
  useEffect(() => {
    // Clear any existing interval
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = null;
    }
    
    // Set up new interval for auto-refresh
    if (symbol && isConnected && activeChart !== 'performance') {
      console.log(`⏰ Setting up auto-refresh for ${symbol} (every 30s)`);
      
      autoRefreshIntervalRef.current = setInterval(() => {
        console.log(`🔄 Auto-refreshing chart for ${symbol}`);
        fetchChartData(true); // Pass true to indicate auto-refresh
      }, 30000);
    }
    
    // Cleanup
    return () => {
      if (autoRefreshIntervalRef.current) {
        console.log(`🧹 Cleaning up auto-refresh interval for ${symbol}`);
        clearInterval(autoRefreshIntervalRef.current);
        autoRefreshIntervalRef.current = null;
      }
    };
  }, [symbol, isConnected, activeChart, fetchChartData]);

  // Clear data when symbol changes
  useEffect(() => {
    return () => {
      // Clean up when component unmounts or symbol changes
      chartDataRef.current = null;
      setChartData(null);
      setLoading(true);
      setError('');
    };
  }, [symbol]);

  const currentPrice = stockPrices[symbol]?.price || 0;

  // Render active chart
  const renderActiveChart = useCallback(() => {
    // Show loading only for initial load (not for auto-refresh)
    if (loading && !chartData) {
      return (
        <div style={{
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: '20px', color: '#666' }}>
            Loading {symbol} chart data...
          </p>
        </div>
      );
    }

    if (error && !chartData) {
      return (
        <div style={{
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <div style={{ color: '#666', marginBottom: '10px', textAlign: 'center' }}>{error}</div>
          <button 
            onClick={handleManualRefresh}
            className="btn btn-primary"
            disabled={!isConnected}
          >
            {isConnected ? 'Retry' : 'Connecting...'}
          </button>
        </div>
      );
    }

    if (!chartData) {
      return (
        <div style={{
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}>
          No chart data available
        </div>
      );
    }

    switch(activeChart) {
    case 'candlestick':
  return (
    <div style={{ position: 'relative' }}>
      <CandlestickChart
        data={chartData}
        symbol={symbol}
        timeframe={timeframe}
        isRefreshing={isRefreshing}
        currentPrice={currentPrice} // Pass the real current price here
      />
    </div>
  ); 
      case 'technical':
        return (
          <div style={{ height: '500px', position: 'relative' }}>
            {isRefreshing && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 100,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                border: '1px solid #dee2e6',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Refreshing...</span>
                </div>
                <span>Updating...</span>
              </div>
            )}
            <TechnicalChart
              data={chartData}
              symbol={symbol}
              timeframe={timeframe}
              indicator={technicalIndicator}
            />
          </div>
        );
        
      case 'depth':
        return (
          <MarketDepthChart
            symbol={symbol}
            currentPrice={currentPrice}
          />
        );
        
      case 'performance':
        return <PerformanceChart symbol={symbol} />;
        
      default:
        return (
          <div style={{
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            Select a chart type to begin
          </div>
        );
    }
  }, [loading, error, chartData, symbol, timeframe, activeChart, technicalIndicator, currentPrice, isConnected, isRefreshing, handleManualRefresh]);

  return (
    <div className="card" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <h3 style={{ margin: 0 }}>
              {symbol} Advanced Charts
            </h3>
            <span style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: isConnected ? '#28a745' : '#dc3545',
              color: 'white'
            }}>
              {isConnected ? '🟢 Live' : '🔴 Offline'}
            </span>
            {isRefreshing && (
              <span style={{
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '10px',
                backgroundColor: '#ffc107',
                color: '#212529',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <div className="spinner-border spinner-border-sm" role="status" style={{ width: '0.8rem', height: '0.8rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                Updating...
              </span>
            )}
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {isConnected ? 'Real-time WebSocket connection active' : 'Connecting to WebSocket server...'}
            {currentPrice > 0 && (
              <span style={{
                marginLeft: '10px',
                color: stockPrices[symbol]?.change >= 0 ? '#26a69a' : '#ef5350',
                fontWeight: '600'
              }}>
                ${currentPrice.toFixed(2)}
                {stockPrices[symbol]?.change >= 0 ? ' ↗' : ' ↘'}
              </span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Timeframe selector */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {timeframes.map(tf => (
              <button
                key={tf.value}
                onClick={() => {
                  console.log(`🔄 Changing timeframe from ${timeframe} to ${tf.value}`);
                  setTimeframe(tf.value);
                }}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: timeframe === tf.value ? '#007bff' : '#f8f9fa',
                  color: timeframe === tf.value ? 'white' : '#333',
                  border: `1px solid ${timeframe === tf.value ? '#007bff' : '#dee2e6'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Manual refresh button */}
          <button
            onClick={handleManualRefresh}
            disabled={!isConnected || loading}
            style={{
              padding: '5px 15px',
              fontSize: '12px',
              backgroundColor: isConnected ? '#6c757d' : '#e9ecef',
              color: isConnected ? 'white' : '#adb5bd',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected && !loading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Refresh chart data"
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Loading...
              </>
            ) : (
              '⟳ Refresh'
            )}
          </button>
        </div>
      </div>

      {/* Chart type selector */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '10px'
      }}>
        {chartTypes.map(chart => (
          <button
            key={chart.id}
            onClick={() => {
              console.log(`🔄 Changing chart type from ${activeChart} to ${chart.id}`);
              setActiveChart(chart.id);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '15px',
              minWidth: '100px',
              backgroundColor: activeChart === chart.id ? '#007bff' : '#f8f9fa',
              color: activeChart === chart.id ? 'white' : '#333',
              border: `1px solid ${activeChart === chart.id ? '#007bff' : '#dee2e6'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <span style={{ fontSize: '24px', marginBottom: '5px' }}>
              {chart.icon}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>
              {chart.name}
            </span>
          </button>
        ))}
      </div>

      {/* Technical indicator selector */}
      {activeChart === 'technical' && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Select Indicator:
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {indicators.map(ind => (
              <button
                key={ind.value}
                onClick={() => setTechnicalIndicator(ind.value)}
                style={{
                  padding: '5px 15px',
                  fontSize: '12px',
                  backgroundColor: technicalIndicator === ind.value ? '#28a745' : '#f8f9fa',
                  color: technicalIndicator === ind.value ? 'white' : '#333',
                  border: `1px solid ${technicalIndicator === ind.value ? '#28a745' : '#dee2e6'}`,
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chart container */}
      <div style={{
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: 'white',
        minHeight: '500px',
        position: 'relative'
      }}>
        {renderActiveChart()}
      </div>

      {/* Chart statistics */}
      {chartData && chartData.summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #eee'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Open</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              ${chartData.summary.open?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>High</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#26a69a' }}>
              ${chartData.summary.high?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Low</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef5350' }}>
              ${chartData.summary.low?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Close</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              ${chartData.summary.close?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Volume</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {chartData.summary.volume?.toLocaleString() || '0'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>RSI</div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: chartData.indicators?.rsi > 70 ? '#ef5350' :
                     chartData.indicators?.rsi < 30 ? '#26a69a' : '#666'
            }}>
              {chartData.indicators?.rsi?.toFixed(2) || '50.00'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedChartDashboard;