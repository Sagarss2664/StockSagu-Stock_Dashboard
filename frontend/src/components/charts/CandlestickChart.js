// // // // import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
// // // // import {
// // // //   Chart as ChartJS,
// // // //   CategoryScale,
// // // //   LinearScale,
// // // //   TimeScale,
// // // //   LineController,
// // // //   LineElement,
// // // //   PointElement,
// // // //   BarController,
// // // //   BarElement,
// // // //   Title,
// // // //   Tooltip,
// // // //   Legend,
// // // //   Filler
// // // // } from 'chart.js';
// // // // import 'chartjs-adapter-date-fns';
// // // // import { Chart } from 'react-chartjs-2';
// // // // import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

// // // // // Register ChartJS components
// // // // ChartJS.register(
// // // //   CategoryScale,
// // // //   LinearScale,
// // // //   TimeScale,
// // // //   LineController,
// // // //   LineElement,
// // // //   PointElement,
// // // //   BarController,
// // // //   BarElement,
// // // //   Title,
// // // //   Tooltip,
// // // //   Legend,
// // // //   Filler,
// // // //   CandlestickController,
// // // //   CandlestickElement
// // // // );

// // // // // Helper function for time unit - moved outside component
// // // // const getTimeUnit = (tf) => {
// // // //   const unitMap = {
// // // //     '1m': 'minute',
// // // //     '5m': 'minute',
// // // //     '15m': 'minute',
// // // //     '30m': 'minute',
// // // //     '1h': 'hour',
// // // //     '4h': 'hour',
// // // //     '1d': 'day',
// // // //     '1w': 'week',
// // // //     '1M': 'month',
// // // //     '24h': 'hour'
// // // //   };
// // // //   return unitMap[tf] || 'hour';
// // // // };

// // // // const CandlestickChart = ({ data, symbol, timeframe }) => {
// // // //   const chartRef = useRef(null);
// // // //   const [currentValue, setCurrentValue] = useState(null);
// // // //   const [highlightedPoint, setHighlightedPoint] = useState(null);

// // // //   // Get the most recent data point - memoized
// // // //   const getLatestDataPoint = useCallback(() => {
// // // //     if (!data?.candles || data.candles.length === 0) return null;
    
// // // //     // Sort by timestamp to get the latest
// // // //     const sortedCandles = [...data.candles].sort((a, b) => b.x - a.x);
// // // //     return sortedCandles[0];
// // // //   }, [data?.candles]);

// // // //   // Prepare candlestick data - memoized to prevent re-renders
// // // //   const chartData = useMemo(() => {
// // // //     if (!data?.candles) return { datasets: [] };

// // // //     const candles = data.candles;
// // // //     const indicators = data.indicators;
    
// // // //     // Get the latest candle for highlighting
// // // //     const latestCandle = getLatestDataPoint();
    
// // // //     // Convert to financial chart format
// // // //     const candlestickData = candles.map(candle => ({
// // // //       x: new Date(candle.x).getTime(),
// // // //       o: candle.o,
// // // //       h: candle.h,
// // // //       l: candle.l,
// // // //       c: candle.c,
// // // //       v: candle.v,
// // // //       // Add custom property for highlighting
// // // //       isCurrent: latestCandle && candle.x === latestCandle.x
// // // //     }));

// // // //     // Calculate moving averages
// // // //     const sma20 = indicators?.movingAverages?.sma20 || 0;
// // // //     const sma50 = indicators?.movingAverages?.sma50 || 0;
    
// // // //     // Bollinger Bands
// // // //     const bb = indicators?.bollingerBands || { upper: 0, middle: 0, lower: 0 };

// // // //     return {
// // // //       datasets: [
// // // //         // Candlestick data with current value highlight
// // // //         {
// // // //           label: `${symbol} Price`,
// // // //           data: candlestickData,
// // // //           type: 'candlestick',
// // // //           borderColor: 'rgba(0, 0, 0, 0.3)',
// // // //           borderWidth: 1,
// // // //           color: {
// // // //             up: '#26a69a', // Green for bullish
// // // //             down: '#ef5350', // Red for bearish
// // // //             unchanged: '#999'
// // // //           },
// // // //           // Custom styling for current candle
// // // //           borderColor: (ctx) => {
// // // //             const point = candlestickData[ctx.dataIndex];
// // // //             return point.isCurrent ? '#007bff' : 'rgba(0, 0, 0, 0.3)';
// // // //           },
// // // //           borderWidth: (ctx) => {
// // // //             const point = candlestickData[ctx.dataIndex];
// // // //             return point.isCurrent ? 3 : 1;
// // // //           },
// // // //           yAxisID: 'y'
// // // //         },
// // // //         // Current price marker
// // // //         {
// // // //           label: 'Current Price',
// // // //           data: latestCandle ? [{
// // // //             x: new Date(latestCandle.x).getTime(),
// // // //             y: latestCandle.c
// // // //           }] : [],
// // // //           type: 'line',
// // // //           borderColor: '#007bff',
// // // //           borderWidth: 2,
// // // //           pointBackgroundColor: '#007bff',
// // // //           pointBorderColor: '#fff',
// // // //           pointBorderWidth: 2,
// // // //           pointRadius: 8,
// // // //           pointHoverRadius: 10,
// // // //           fill: false,
// // // //           tension: 0,
// // // //           pointStyle: 'circle'
// // // //         },
// // // //         // Volume bars with current highlight
// // // //         {
// // // //           label: 'Volume',
// // // //           data: candlestickData.map(d => ({ 
// // // //             x: d.x, 
// // // //             y: d.v,
// // // //             isCurrent: d.isCurrent
// // // //           })),
// // // //           type: 'bar',
// // // //           backgroundColor: (ctx) => {
// // // //             const point = candlestickData[ctx.dataIndex];
// // // //             if (point.isCurrent) {
// // // //               return point.c >= point.o ? 'rgba(0, 123, 255, 0.7)' : 'rgba(220, 53, 69, 0.7)';
// // // //             }
// // // //             return point.c >= point.o ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
// // // //           },
// // // //           borderColor: (ctx) => {
// // // //             const point = candlestickData[ctx.dataIndex];
// // // //             if (point.isCurrent) {
// // // //               return point.c >= point.o ? 'rgba(0, 123, 255, 1)' : 'rgba(220, 53, 69, 1)';
// // // //             }
// // // //             return point.c >= point.o ? 'rgba(38, 166, 154, 1)' : 'rgba(239, 83, 80, 1)';
// // // //           },
// // // //           borderWidth: (ctx) => {
// // // //             const point = candlestickData[ctx.dataIndex];
// // // //             return point.isCurrent ? 2 : 1;
// // // //           },
// // // //           yAxisID: 'y1',
// // // //           hidden: true
// // // //         },
// // // //         // Current price line (horizontal across chart)
// // // //         {
// // // //           label: 'Current Price Line',
// // // //           data: latestCandle ? candlestickData.map(d => ({ 
// // // //             x: d.x, 
// // // //             y: latestCandle.c 
// // // //           })) : [],
// // // //           type: 'line',
// // // //           borderColor: 'rgba(0, 123, 255, 0.5)',
// // // //           borderWidth: 1,
// // // //           borderDash: [5, 5],
// // // //           pointRadius: 0,
// // // //           fill: false,
// // // //           tension: 0
// // // //         },
// // // //         // SMA 20
// // // //         {
// // // //           label: 'SMA 20',
// // // //           data: candlestickData.map(d => ({ x: d.x, y: sma20 })),
// // // //           type: 'line',
// // // //           borderColor: 'rgba(255, 152, 0, 0.8)',
// // // //           borderWidth: 2,
// // // //           pointRadius: 0,
// // // //           fill: false,
// // // //           tension: 0.1
// // // //         },
// // // //         // SMA 50
// // // //         {
// // // //           label: 'SMA 50',
// // // //           data: candlestickData.map(d => ({ x: d.x, y: sma50 })),
// // // //           type: 'line',
// // // //           borderColor: 'rgba(156, 39, 176, 0.8)',
// // // //           borderWidth: 2,
// // // //           pointRadius: 0,
// // // //           fill: false,
// // // //           tension: 0.1
// // // //         },
// // // //         // Bollinger Bands Upper
// // // //         {
// // // //           label: 'BB Upper',
// // // //           data: candlestickData.map(d => ({ x: d.x, y: bb.upper })),
// // // //           type: 'line',
// // // //           borderColor: 'rgba(33, 150, 243, 0.5)',
// // // //           borderWidth: 1,
// // // //           pointRadius: 0,
// // // //           borderDash: [5, 5],
// // // //           fill: false
// // // //         },
// // // //         // Bollinger Bands Middle
// // // //         {
// // // //           label: 'BB Middle',
// // // //           data: candlestickData.map(d => ({ x: d.x, y: bb.middle })),
// // // //           type: 'line',
// // // //           borderColor: 'rgba(33, 150, 243, 0.8)',
// // // //           borderWidth: 1,
// // // //           pointRadius: 0,
// // // //           fill: false
// // // //         },
// // // //         // Bollinger Bands Lower
// // // //         {
// // // //           label: 'BB Lower',
// // // //           data: candlestickData.map(d => ({ x: d.x, y: bb.lower })),
// // // //           type: 'line',
// // // //           borderColor: 'rgba(33, 150, 243, 0.5)',
// // // //           borderWidth: 1,
// // // //           pointRadius: 0,
// // // //           borderDash: [5, 5],
// // // //           fill: false
// // // //         }
// // // //       ]
// // // //     };
// // // //   }, [data, symbol, getLatestDataPoint]);

// // // //   // Options memoized
// // // //   const options = useMemo(() => ({
// // // //     responsive: true,
// // // //     maintainAspectRatio: false,
// // // //     interaction: {
// // // //       mode: 'index',
// // // //       intersect: false
// // // //     },
// // // //     plugins: {
// // // //       legend: {
// // // //         position: 'top',
// // // //         labels: {
// // // //           usePointStyle: true,
// // // //           boxWidth: 10,
// // // //           font: {
// // // //             size: 11
// // // //           },
// // // //           filter: (legendItem) => {
// // // //             // Hide the current price line from legend
// // // //             return !legendItem.text.includes('Current Price Line');
// // // //           }
// // // //         }
// // // //       },
// // // //       title: {
// // // //         display: true,
// // // //         text: `${symbol} - ${timeframe} Candlestick Chart`,
// // // //         font: {
// // // //           size: 16,
// // // //           weight: 'bold'
// // // //         }
// // // //       },
// // // //       tooltip: {
// // // //         backgroundColor: 'rgba(0, 0, 0, 0.8)',
// // // //         titleColor: '#fff',
// // // //         bodyColor: '#fff',
// // // //         borderColor: 'rgba(255, 255, 255, 0.1)',
// // // //         borderWidth: 1,
// // // //         callbacks: {
// // // //           title: (context) => {
// // // //             const date = new Date(context[0].parsed.x);
// // // //             return date.toLocaleString();
// // // //           },
// // // //           label: (context) => {
// // // //             const dataset = context.dataset;
// // // //             const dataPoint = dataset.data[context.dataIndex];
            
// // // //             if (dataset.label === 'Current Price') {
// // // //               return `Current Price: $${dataPoint.y.toFixed(2)}`;
// // // //             } else if (dataset.type === 'candlestick') {
// // // //               return [
// // // //                 `Open: $${dataPoint.o.toFixed(2)}`,
// // // //                 `High: $${dataPoint.h.toFixed(2)}`,
// // // //                 `Low: $${dataPoint.l.toFixed(2)}`,
// // // //                 `Close: $${dataPoint.c.toFixed(2)}`,
// // // //                 `Volume: ${dataPoint.v.toLocaleString()}`,
// // // //                 dataPoint.isCurrent ? '🟢 LIVE' : ''
// // // //               ];
// // // //             } else if (dataset.type === 'bar') {
// // // //               return `Volume: ${dataPoint.y.toLocaleString()}`;
// // // //             } else {
// // // //               return `${dataset.label}: $${dataPoint.y.toFixed(2)}`;
// // // //             }
// // // //           },
// // // //           labelColor: (context) => {
// // // //             if (context.dataset.label === 'Current Price') {
// // // //               return {
// // // //                 borderColor: '#007bff',
// // // //                 backgroundColor: '#007bff'
// // // //               };
// // // //             }
// // // //             return {
// // // //               borderColor: context.dataset.borderColor,
// // // //               backgroundColor: context.dataset.borderColor
// // // //             };
// // // //           }
// // // //         }
// // // //       }
// // // //     },
// // // //     scales: {
// // // //       x: {
// // // //         type: 'time',
// // // //         time: {
// // // //           unit: getTimeUnit(timeframe),
// // // //           displayFormats: {
// // // //             minute: 'HH:mm',
// // // //             hour: 'MMM dd HH:mm',
// // // //             day: 'MMM dd',
// // // //             week: 'MMM dd',
// // // //             month: 'MMM yyyy'
// // // //           }
// // // //         },
// // // //         grid: {
// // // //           color: 'rgba(0, 0, 0, 0.05)'
// // // //         },
// // // //         ticks: {
// // // //           maxTicksLimit: 10,
// // // //           font: {
// // // //             size: 11
// // // //           }
// // // //         }
// // // //       },
// // // //       y: {
// // // //         position: 'right',
// // // //         grid: {
// // // //           color: 'rgba(0, 0, 0, 0.05)'
// // // //         },
// // // //         ticks: {
// // // //           callback: (value) => `$${value.toFixed(2)}`,
// // // //           font: {
// // // //             size: 11
// // // //           }
// // // //         },
// // // //         title: {
// // // //           display: true,
// // // //           text: 'Price ($)',
// // // //           font: {
// // // //             size: 12,
// // // //             weight: 'bold'
// // // //           }
// // // //         }
// // // //       },
// // // //       y1: {
// // // //         position: 'left',
// // // //         grid: {
// // // //           drawOnChartArea: false
// // // //         },
// // // //         title: {
// // // //           display: true,
// // // //           text: 'Volume',
// // // //           font: {
// // // //             size: 12,
// // // //             weight: 'bold'
// // // //           }
// // // //         }
// // // //       }
// // // //     },
// // // //     animation: {
// // // //       duration: 0
// // // //     }
// // // //   }), [symbol, timeframe]);

// // // //   // Separate function to draw custom lines (prevent infinite loops)
// // // //   const drawCustomLines = useCallback((chart) => {
// // // //     const ctx = chart.ctx;
    
// // // //     if (highlightedPoint && currentValue) {
// // // //       const xAxis = chart.scales.x;
// // // //       const yAxis = chart.scales.y;
      
// // // //       // Draw vertical line at current time
// // // //       const xPos = xAxis.getPixelForValue(highlightedPoint.x);
// // // //       ctx.save();
// // // //       ctx.beginPath();
// // // //       ctx.moveTo(xPos, yAxis.top);
// // // //       ctx.lineTo(xPos, yAxis.bottom);
// // // //       ctx.lineWidth = 1;
// // // //       ctx.strokeStyle = 'rgba(0, 123, 255, 0.3)';
// // // //       ctx.setLineDash([5, 5]);
// // // //       ctx.stroke();
// // // //       ctx.restore();
      
// // // //       // Draw horizontal line at current price
// // // //       const yPos = yAxis.getPixelForValue(currentValue);
// // // //       ctx.save();
// // // //       ctx.beginPath();
// // // //       ctx.moveTo(xAxis.left, yPos);
// // // //       ctx.lineTo(xAxis.right, yPos);
// // // //       ctx.lineWidth = 1;
// // // //       ctx.strokeStyle = 'rgba(0, 123, 255, 0.3)';
// // // //       ctx.setLineDash([5, 5]);
// // // //       ctx.stroke();
// // // //       ctx.restore();
// // // //     }
// // // //   }, [highlightedPoint, currentValue]);

// // // //   // Add plugin for custom drawing
// // // //   const plugins = useMemo(() => [{
// // // //     id: 'customLines',
// // // //     afterDraw: drawCustomLines
// // // //   }], [drawCustomLines]);

// // // //   // Effect to update current value when data changes
// // // //   useEffect(() => {
// // // //     const latest = getLatestDataPoint();
// // // //     if (latest) {
// // // //       setCurrentValue(latest.c);
// // // //       setHighlightedPoint({
// // // //         x: new Date(latest.x).getTime(),
// // // //         y: latest.c,
// // // //         price: latest.c,
// // // //         time: new Date(latest.x)
// // // //       });
// // // //     }
// // // //   }, [data, getLatestDataPoint]);

// // // //   return (
// // // //     <div style={{ height: '500px', position: 'relative' }}>
// // // //       <Chart
// // // //         ref={chartRef}
// // // //         type='candlestick'
// // // //         data={chartData}
// // // //         options={options}
// // // //         plugins={plugins}
// // // //       />
      
// // // //       {/* Current value display */}
// // // //       {currentValue && highlightedPoint && (
// // // //         <div style={{
// // // //           position: 'absolute',
// // // //           top: '10px',
// // // //           left: '10px',
// // // //           backgroundColor: 'rgba(255, 255, 255, 0.95)',
// // // //           padding: '15px',
// // // //           borderRadius: '8px',
// // // //           border: '2px solid #007bff',
// // // //           fontSize: '14px',
// // // //           minWidth: '250px',
// // // //           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
// // // //           zIndex: 100
// // // //         }}>
// // // //           <div style={{ 
// // // //             display: 'flex', 
// // // //             alignItems: 'center', 
// // // //             justifyContent: 'space-between',
// // // //             marginBottom: '8px'
// // // //           }}>
// // // //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
// // // //               Current Value
// // // //             </span>
// // // //             <span style={{
// // // //               padding: '2px 8px',
// // // //               backgroundColor: '#28a745',
// // // //               color: 'white',
// // // //               borderRadius: '4px',
// // // //               fontSize: '11px',
// // // //               fontWeight: 'bold'
// // // //             }}>
// // // //               LIVE
// // // //             </span>
// // // //           </div>
// // // //           <div style={{ 
// // // //             fontSize: '28px', 
// // // //             fontWeight: 'bold',
// // // //             color: '#007bff',
// // // //             marginBottom: '5px'
// // // //           }}>
// // // //             ${currentValue.toFixed(2)}
// // // //           </div>
// // // //           <div style={{ 
// // // //             display: 'flex', 
// // // //             justifyContent: 'space-between',
// // // //             fontSize: '12px',
// // // //             color: '#666'
// // // //           }}>
// // // //             <div>
// // // //               <div>Time:</div>
// // // //               <div style={{ fontWeight: '600' }}>
// // // //                 {highlightedPoint.time.toLocaleTimeString()}
// // // //               </div>
// // // //             </div>
// // // //             <div>
// // // //               <div>Date:</div>
// // // //               <div style={{ fontWeight: '600' }}>
// // // //                 {highlightedPoint.time.toLocaleDateString()}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //           <div style={{
// // // //             marginTop: '10px',
// // // //             paddingTop: '10px',
// // // //             borderTop: '1px solid #eee',
// // // //             fontSize: '12px',
// // // //             color: '#666'
// // // //           }}>
// // // //             Last update: {highlightedPoint.time.toLocaleString()}
// // // //           </div>
// // // //         </div>
// // // //       )}
      
// // // //       {/* Technical indicators overlay */}
// // // //       {data?.indicators && (
// // // //         <div style={{
// // // //           position: 'absolute',
// // // //           top: '10px',
// // // //           right: '10px',
// // // //           backgroundColor: 'rgba(255, 255, 255, 0.95)',
// // // //           padding: '15px',
// // // //           borderRadius: '8px',
// // // //           border: '1px solid #dee2e6',
// // // //           fontSize: '12px',
// // // //           maxWidth: '200px',
// // // //           zIndex: 100
// // // //         }}>
// // // //           <div style={{ 
// // // //             fontWeight: 'bold', 
// // // //             marginBottom: '8px',
// // // //             borderBottom: '1px solid #eee',
// // // //             paddingBottom: '5px'
// // // //           }}>
// // // //             Technical Indicators
// // // //           </div>
// // // //           <div style={{ marginBottom: '4px' }}>
// // // //             RSI: <span style={{
// // // //               color: data.indicators.rsi > 70 ? '#ef5350' : 
// // // //                      data.indicators.rsi < 30 ? '#26a69a' : '#666',
// // // //               fontWeight: '600'
// // // //             }}>
// // // //               {data.indicators.rsi?.toFixed(2)}
// // // //             </span>
// // // //           </div>
// // // //           <div style={{ marginBottom: '4px' }}>
// // // //             MACD: <span style={{ fontWeight: '600' }}>
// // // //               {data.indicators.macd?.macd?.toFixed(3)}
// // // //             </span>
// // // //           </div>
// // // //           <div style={{ marginBottom: '4px' }}>
// // // //             Signal: <span style={{ fontWeight: '600' }}>
// // // //               {data.indicators.macd?.signal?.toFixed(3)}
// // // //             </span>
// // // //           </div>
// // // //           <div style={{ marginTop: '8px', color: '#999', fontSize: '11px' }}>
// // // //             Based on {data.candles?.length || 0} data points
// // // //           </div>
// // // //         </div>
// // // //       )}
      
// // // //       {/* Highlight explanation */}
// // // //       <div style={{
// // // //         position: 'absolute',
// // // //         bottom: '20px',
// // // //         left: '10px',
// // // //         backgroundColor: 'rgba(255, 255, 255, 0.9)',
// // // //         padding: '10px',
// // // //         borderRadius: '6px',
// // // //         fontSize: '11px',
// // // //         border: '1px solid #dee2e6'
// // // //       }}>
// // // //         <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
// // // //           Chart Legend:
// // // //         </div>
// // // //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
// // // //           <div style={{
// // // //             width: '12px',
// // // //             height: '12px',
// // // //             backgroundColor: '#007bff',
// // // //             borderRadius: '50%',
// // // //             marginRight: '6px'
// // // //           }}></div>
// // // //           <span>Current/Latest Value</span>
// // // //         </div>
// // // //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
// // // //           <div style={{
// // // //             width: '12px',
// // // //             height: '12px',
// // // //             backgroundColor: '#26a69a',
// // // //             borderRadius: '50%',
// // // //             marginRight: '6px'
// // // //           }}></div>
// // // //           <span>Bullish (Price Up)</span>
// // // //         </div>
// // // //         <div style={{ display: 'flex', alignItems: 'center' }}>
// // // //           <div style={{
// // // //             width: '12px',
// // // //             height: '12px',
// // // //             backgroundColor: '#ef5350',
// // // //             borderRadius: '50%',
// // // //             marginRight: '6px'
// // // //           }}></div>
// // // //           <span>Bearish (Price Down)</span>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CandlestickChart;
// // // import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
// // // import {
// // //   Chart as ChartJS,
// // //   CategoryScale,
// // //   LinearScale,
// // //   TimeScale,
// // //   LineController,
// // //   LineElement,
// // //   PointElement,
// // //   BarController,
// // //   BarElement,
// // //   Title,
// // //   Tooltip,
// // //   Legend,
// // //   Filler
// // // } from 'chart.js';
// // // import 'chartjs-adapter-date-fns';
// // // import { Chart } from 'react-chartjs-2';
// // // import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

// // // // Register ChartJS components
// // // ChartJS.register(
// // //   CategoryScale,
// // //   LinearScale,
// // //   TimeScale,
// // //   LineController,
// // //   LineElement,
// // //   PointElement,
// // //   BarController,
// // //   BarElement,
// // //   Title,
// // //   Tooltip,
// // //   Legend,
// // //   Filler,
// // //   CandlestickController,
// // //   CandlestickElement
// // // );

// // // // Helper function for time unit - moved outside component
// // // const getTimeUnit = (tf) => {
// // //   const unitMap = {
// // //     '1m': 'minute',
// // //     '5m': 'minute',
// // //     '15m': 'minute',
// // //     '30m': 'minute',
// // //     '1h': 'hour',
// // //     '4h': 'hour',
// // //     '1d': 'day',
// // //     '1w': 'week',
// // //     '1M': 'month',
// // //     '24h': 'hour'
// // //   };
// // //   return unitMap[tf] || 'hour';
// // // };

// // // const CandlestickChart = ({ data, symbol, timeframe, isRefreshing = false }) => {
// // //   const chartRef = useRef(null);
// // //   const [currentValue, setCurrentValue] = useState(null);
// // //   const [highlightedPoint, setHighlightedPoint] = useState(null);
// // //   const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

// // //   // Get the most recent data point - memoized
// // //   const getLatestDataPoint = useCallback(() => {
// // //     if (!data?.candles || data.candles.length === 0) return null;
    
// // //     // Sort by timestamp to get the latest
// // //     const sortedCandles = [...data.candles].sort((a, b) => b.x - a.x);
// // //     return sortedCandles[0];
// // //   }, [data?.candles]);

// // //   // Update last update time when data changes
// // //   useEffect(() => {
// // //     if (data?.candles && data.candles.length > 0) {
// // //       setLastUpdateTime(new Date());
// // //     }
// // //   }, [data]);

// // //   // Prepare candlestick data - memoized to prevent re-renders
// // //   const chartData = useMemo(() => {
// // //     if (!data?.candles) return { datasets: [] };

// // //     const candles = data.candles;
// // //     const indicators = data.indicators;
    
// // //     // Get the latest candle for highlighting
// // //     const latestCandle = getLatestDataPoint();
    
// // //     // Convert to financial chart format
// // //     const candlestickData = candles.map(candle => ({
// // //       x: new Date(candle.x).getTime(),
// // //       o: candle.o,
// // //       h: candle.h,
// // //       l: candle.l,
// // //       c: candle.c,
// // //       v: candle.v,
// // //       // Add custom property for highlighting
// // //       isCurrent: latestCandle && candle.x === latestCandle.x
// // //     }));

// // //     // Update current value state
// // //     if (latestCandle) {
// // //       setCurrentValue(latestCandle.c);
// // //       setHighlightedPoint({
// // //         x: new Date(latestCandle.x).getTime(),
// // //         y: latestCandle.c,
// // //         price: latestCandle.c,
// // //         time: new Date(latestCandle.x)
// // //       });
// // //     }

// // //     // Calculate moving averages
// // //     const sma20 = indicators?.movingAverages?.sma20 || 0;
// // //     const sma50 = indicators?.movingAverages?.sma50 || 0;
    
// // //     // Bollinger Bands
// // //     const bb = indicators?.bollingerBands || { upper: 0, middle: 0, lower: 0 };

// // //     return {
// // //       datasets: [
// // //         // Candlestick data with current value highlight
// // //         {
// // //           label: `${symbol} Price`,
// // //           data: candlestickData,
// // //           type: 'candlestick',
// // //           borderColor: 'rgba(0, 0, 0, 0.3)',
// // //           borderWidth: 1,
// // //           color: {
// // //             up: '#26a69a', // Green for bullish
// // //             down: '#ef5350', // Red for bearish
// // //             unchanged: '#999'
// // //           },
// // //           // Custom styling for current candle
// // //           borderColor: (ctx) => {
// // //             const point = candlestickData[ctx.dataIndex];
// // //             return point.isCurrent ? '#007bff' : 'rgba(0, 0, 0, 0.3)';
// // //           },
// // //           borderWidth: (ctx) => {
// // //             const point = candlestickData[ctx.dataIndex];
// // //             return point.isCurrent ? 3 : 1;
// // //           },
// // //           yAxisID: 'y'
// // //         },
// // //         // Current price marker
// // //         {
// // //           label: 'Current Price',
// // //           data: latestCandle ? [{
// // //             x: new Date(latestCandle.x).getTime(),
// // //             y: latestCandle.c
// // //           }] : [],
// // //           type: 'line',
// // //           borderColor: '#007bff',
// // //           borderWidth: 2,
// // //           pointBackgroundColor: '#007bff',
// // //           pointBorderColor: '#fff',
// // //           pointBorderWidth: 2,
// // //           pointRadius: 8,
// // //           pointHoverRadius: 10,
// // //           fill: false,
// // //           tension: 0,
// // //           pointStyle: 'circle'
// // //         },
// // //         // Volume bars with current highlight
// // //         {
// // //           label: 'Volume',
// // //           data: candlestickData.map(d => ({ 
// // //             x: d.x, 
// // //             y: d.v,
// // //             isCurrent: d.isCurrent
// // //           })),
// // //           type: 'bar',
// // //           backgroundColor: (ctx) => {
// // //             const point = candlestickData[ctx.dataIndex];
// // //             if (point.isCurrent) {
// // //               return point.c >= point.o ? 'rgba(0, 123, 255, 0.7)' : 'rgba(220, 53, 69, 0.7)';
// // //             }
// // //             return point.c >= point.o ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
// // //           },
// // //           borderColor: (ctx) => {
// // //             const point = candlestickData[ctx.dataIndex];
// // //             if (point.isCurrent) {
// // //               return point.c >= point.o ? 'rgba(0, 123, 255, 1)' : 'rgba(220, 53, 69, 1)';
// // //             }
// // //             return point.c >= point.o ? 'rgba(38, 166, 154, 1)' : 'rgba(239, 83, 80, 1)';
// // //           },
// // //           borderWidth: (ctx) => {
// // //             const point = candlestickData[ctx.dataIndex];
// // //             return point.isCurrent ? 2 : 1;
// // //           },
// // //           yAxisID: 'y1',
// // //           hidden: true
// // //         },
// // //         // Current price line (horizontal across chart)
// // //         {
// // //           label: 'Current Price Line',
// // //           data: latestCandle ? candlestickData.map(d => ({ 
// // //             x: d.x, 
// // //             y: latestCandle.c 
// // //           })) : [],
// // //           type: 'line',
// // //           borderColor: 'rgba(0, 123, 255, 0.5)',
// // //           borderWidth: 1,
// // //           borderDash: [5, 5],
// // //           pointRadius: 0,
// // //           fill: false,
// // //           tension: 0
// // //         },
// // //         // SMA 20
// // //         {
// // //           label: 'SMA 20',
// // //           data: candlestickData.map(d => ({ x: d.x, y: sma20 })),
// // //           type: 'line',
// // //           borderColor: 'rgba(255, 152, 0, 0.8)',
// // //           borderWidth: 2,
// // //           pointRadius: 0,
// // //           fill: false,
// // //           tension: 0.1
// // //         },
// // //         // SMA 50
// // //         {
// // //           label: 'SMA 50',
// // //           data: candlestickData.map(d => ({ x: d.x, y: sma50 })),
// // //           type: 'line',
// // //           borderColor: 'rgba(156, 39, 176, 0.8)',
// // //           borderWidth: 2,
// // //           pointRadius: 0,
// // //           fill: false,
// // //           tension: 0.1
// // //         },
// // //         // Bollinger Bands Upper
// // //         {
// // //           label: 'BB Upper',
// // //           data: candlestickData.map(d => ({ x: d.x, y: bb.upper })),
// // //           type: 'line',
// // //           borderColor: 'rgba(33, 150, 243, 0.5)',
// // //           borderWidth: 1,
// // //           pointRadius: 0,
// // //           borderDash: [5, 5],
// // //           fill: false
// // //         },
// // //         // Bollinger Bands Middle
// // //         {
// // //           label: 'BB Middle',
// // //           data: candlestickData.map(d => ({ x: d.x, y: bb.middle })),
// // //           type: 'line',
// // //           borderColor: 'rgba(33, 150, 243, 0.8)',
// // //           borderWidth: 1,
// // //           pointRadius: 0,
// // //           fill: false
// // //         },
// // //         // Bollinger Bands Lower
// // //         {
// // //           label: 'BB Lower',
// // //           data: candlestickData.map(d => ({ x: d.x, y: bb.lower })),
// // //           type: 'line',
// // //           borderColor: 'rgba(33, 150, 243, 0.5)',
// // //           borderWidth: 1,
// // //           pointRadius: 0,
// // //           borderDash: [5, 5],
// // //           fill: false
// // //         }
// // //       ]
// // //     };
// // //   }, [data, symbol, getLatestDataPoint]);

// // //   // Options memoized
// // //   const options = useMemo(() => ({
// // //     responsive: true,
// // //     maintainAspectRatio: false,
// // //     interaction: {
// // //       mode: 'index',
// // //       intersect: false
// // //     },
// // //     plugins: {
// // //       legend: {
// // //         position: 'top',
// // //         labels: {
// // //           usePointStyle: true,
// // //           boxWidth: 10,
// // //           font: {
// // //             size: 11
// // //           },
// // //           filter: (legendItem) => {
// // //             // Hide the current price line from legend
// // //             return !legendItem.text.includes('Current Price Line');
// // //           }
// // //         }
// // //       },
// // //       title: {
// // //         display: true,
// // //         text: `${symbol} - ${timeframe} Candlestick Chart`,
// // //         font: {
// // //           size: 16,
// // //           weight: 'bold'
// // //         }
// // //       },
// // //       tooltip: {
// // //         backgroundColor: 'rgba(0, 0, 0, 0.8)',
// // //         titleColor: '#fff',
// // //         bodyColor: '#fff',
// // //         borderColor: 'rgba(255, 255, 255, 0.1)',
// // //         borderWidth: 1,
// // //         callbacks: {
// // //           title: (context) => {
// // //             const date = new Date(context[0].parsed.x);
// // //             return date.toLocaleString();
// // //           },
// // //           label: (context) => {
// // //             const dataset = context.dataset;
// // //             const dataPoint = dataset.data[context.dataIndex];
            
// // //             if (dataset.label === 'Current Price') {
// // //               return `Current Price: $${dataPoint.y.toFixed(2)}`;
// // //             } else if (dataset.type === 'candlestick') {
// // //               return [
// // //                 `Open: $${dataPoint.o.toFixed(2)}`,
// // //                 `High: $${dataPoint.h.toFixed(2)}`,
// // //                 `Low: $${dataPoint.l.toFixed(2)}`,
// // //                 `Close: $${dataPoint.c.toFixed(2)}`,
// // //                 `Volume: ${dataPoint.v.toLocaleString()}`,
// // //                 dataPoint.isCurrent ? '🟢 LIVE' : ''
// // //               ];
// // //             } else if (dataset.type === 'bar') {
// // //               return `Volume: ${dataPoint.y.toLocaleString()}`;
// // //             } else {
// // //               return `${dataset.label}: $${dataPoint.y.toFixed(2)}`;
// // //             }
// // //           },
// // //           labelColor: (context) => {
// // //             if (context.dataset.label === 'Current Price') {
// // //               return {
// // //                 borderColor: '#007bff',
// // //                 backgroundColor: '#007bff'
// // //               };
// // //             }
// // //             return {
// // //               borderColor: context.dataset.borderColor,
// // //               backgroundColor: context.dataset.borderColor
// // //             };
// // //           }
// // //         }
// // //       }
// // //     },
// // //     scales: {
// // //       x: {
// // //         type: 'time',
// // //         time: {
// // //           unit: getTimeUnit(timeframe),
// // //           displayFormats: {
// // //             minute: 'HH:mm',
// // //             hour: 'MMM dd HH:mm',
// // //             day: 'MMM dd',
// // //             week: 'MMM dd',
// // //             month: 'MMM yyyy'
// // //           }
// // //         },
// // //         grid: {
// // //           color: 'rgba(0, 0, 0, 0.05)'
// // //         },
// // //         ticks: {
// // //           maxTicksLimit: 10,
// // //           font: {
// // //             size: 11
// // //           }
// // //         }
// // //       },
// // //       y: {
// // //         position: 'right',
// // //         grid: {
// // //           color: 'rgba(0, 0, 0, 0.05)'
// // //         },
// // //         ticks: {
// // //           callback: (value) => `$${value.toFixed(2)}`,
// // //           font: {
// // //             size: 11
// // //           }
// // //         },
// // //         title: {
// // //           display: true,
// // //           text: 'Price ($)',
// // //           font: {
// // //             size: 12,
// // //             weight: 'bold'
// // //           }
// // //         }
// // //       },
// // //       y1: {
// // //         position: 'left',
// // //         grid: {
// // //           drawOnChartArea: false
// // //         },
// // //         title: {
// // //           display: true,
// // //           text: 'Volume',
// // //           font: {
// // //             size: 12,
// // //             weight: 'bold'
// // //           }
// // //         }
// // //       }
// // //     },
// // //     animation: {
// // //       duration: 0
// // //     }
// // //   }), [symbol, timeframe]);

// // //   // Separate function to draw custom lines (prevent infinite loops)
// // //   const drawCustomLines = useCallback((chart) => {
// // //     const ctx = chart.ctx;
    
// // //     if (highlightedPoint && currentValue) {
// // //       const xAxis = chart.scales.x;
// // //       const yAxis = chart.scales.y;
      
// // //       // Draw vertical line at current time
// // //       const xPos = xAxis.getPixelForValue(highlightedPoint.x);
// // //       ctx.save();
// // //       ctx.beginPath();
// // //       ctx.moveTo(xPos, yAxis.top);
// // //       ctx.lineTo(xPos, yAxis.bottom);
// // //       ctx.lineWidth = 1;
// // //       ctx.strokeStyle = 'rgba(0, 123, 255, 0.3)';
// // //       ctx.setLineDash([5, 5]);
// // //       ctx.stroke();
// // //       ctx.restore();
      
// // //       // Draw horizontal line at current price
// // //       const yPos = yAxis.getPixelForValue(currentValue);
// // //       ctx.save();
// // //       ctx.beginPath();
// // //       ctx.moveTo(xAxis.left, yPos);
// // //       ctx.lineTo(xAxis.right, yPos);
// // //       ctx.lineWidth = 1;
// // //       ctx.strokeStyle = 'rgba(0, 123, 255, 0.3)';
// // //       ctx.setLineDash([5, 5]);
// // //       ctx.stroke();
// // //       ctx.restore();
// // //     }
// // //   }, [highlightedPoint, currentValue]);

// // //   // Add plugin for custom drawing
// // //   const plugins = useMemo(() => [{
// // //     id: 'customLines',
// // //     afterDraw: drawCustomLines
// // //   }], [drawCustomLines]);

// // //   // Effect to update current value when data changes
// // //   useEffect(() => {
// // //     const latest = getLatestDataPoint();
// // //     if (latest) {
// // //       setCurrentValue(latest.c);
// // //       setHighlightedPoint({
// // //         x: new Date(latest.x).getTime(),
// // //         y: latest.c,
// // //         price: latest.c,
// // //         time: new Date(latest.x)
// // //       });
// // //     }
// // //   }, [data, getLatestDataPoint]);

// // //   return (
// // //     <div style={{ height: '500px', position: 'relative' }}>
// // //       <Chart
// // //         ref={chartRef}
// // //         type='candlestick'
// // //         data={chartData}
// // //         options={options}
// // //         plugins={plugins}
// // //       />
      
// // //       {/* Current value display */}
// // //       {currentValue && highlightedPoint && (
// // //         <div style={{
// // //           position: 'absolute',
// // //           top: '10px',
// // //           left: '10px',
// // //           backgroundColor: 'rgba(255, 255, 255, 0.95)',
// // //           padding: '15px',
// // //           borderRadius: '8px',
// // //           border: '2px solid #007bff',
// // //           fontSize: '14px',
// // //           minWidth: '250px',
// // //           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
// // //           zIndex: 100
// // //         }}>
// // //           <div style={{ 
// // //             display: 'flex', 
// // //             alignItems: 'center', 
// // //             justifyContent: 'space-between',
// // //             marginBottom: '8px'
// // //           }}>
// // //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
// // //               Current Value
// // //             </span>
// // //             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
// // //               {isRefreshing && (
// // //                 <div className="spinner-border spinner-border-sm text-warning" role="status" style={{ width: '0.8rem', height: '0.8rem' }}>
// // //                   <span className="visually-hidden">Refreshing...</span>
// // //                 </div>
// // //               )}
// // //               <span style={{
// // //                 padding: '2px 8px',
// // //                 backgroundColor: '#28a745',
// // //                 color: 'white',
// // //                 borderRadius: '4px',
// // //                 fontSize: '11px',
// // //                 fontWeight: 'bold'
// // //               }}>
// // //                 LIVE
// // //               </span>
// // //             </div>
// // //           </div>
// // //           <div style={{ 
// // //             fontSize: '28px', 
// // //             fontWeight: 'bold',
// // //             color: '#007bff',
// // //             marginBottom: '5px'
// // //           }}>
// // //             ${currentValue.toFixed(2)}
// // //           </div>
// // //           <div style={{ 
// // //             display: 'flex', 
// // //             justifyContent: 'space-between',
// // //             fontSize: '12px',
// // //             color: '#666'
// // //           }}>
// // //             <div>
// // //               <div>Time:</div>
// // //               <div style={{ fontWeight: '600' }}>
// // //                 {highlightedPoint.time.toLocaleTimeString()}
// // //               </div>
// // //             </div>
// // //             <div>
// // //               <div>Date:</div>
// // //               <div style={{ fontWeight: '600' }}>
// // //                 {highlightedPoint.time.toLocaleDateString()}
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div style={{
// // //             marginTop: '10px',
// // //             paddingTop: '10px',
// // //             borderTop: '1px solid #eee',
// // //             fontSize: '12px',
// // //             color: '#666'
// // //           }}>
// // //             Last update: {lastUpdateTime.toLocaleTimeString()}
// // //           </div>
// // //         </div>
// // //       )}
      
// // //       {/* Technical indicators overlay */}
// // //       {data?.indicators && (
// // //         <div style={{
// // //           position: 'absolute',
// // //           top: '10px',
// // //           right: '10px',
// // //           backgroundColor: 'rgba(255, 255, 255, 0.95)',
// // //           padding: '15px',
// // //           borderRadius: '8px',
// // //           border: '1px solid #dee2e6',
// // //           fontSize: '12px',
// // //           maxWidth: '200px',
// // //           zIndex: 100
// // //         }}>
// // //           <div style={{ 
// // //             fontWeight: 'bold', 
// // //             marginBottom: '8px',
// // //             borderBottom: '1px solid #eee',
// // //             paddingBottom: '5px'
// // //           }}>
// // //             Technical Indicators
// // //           </div>
// // //           <div style={{ marginBottom: '4px' }}>
// // //             RSI: <span style={{
// // //               color: data.indicators.rsi > 70 ? '#ef5350' : 
// // //                      data.indicators.rsi < 30 ? '#26a69a' : '#666',
// // //               fontWeight: '600'
// // //             }}>
// // //               {data.indicators.rsi?.toFixed(2)}
// // //             </span>
// // //           </div>
// // //           <div style={{ marginBottom: '4px' }}>
// // //             MACD: <span style={{ fontWeight: '600' }}>
// // //               {data.indicators.macd?.macd?.toFixed(3)}
// // //             </span>
// // //           </div>
// // //           <div style={{ marginBottom: '4px' }}>
// // //             Signal: <span style={{ fontWeight: '600' }}>
// // //               {data.indicators.macd?.signal?.toFixed(3)}
// // //             </span>
// // //           </div>
// // //           <div style={{ marginTop: '8px', color: '#999', fontSize: '11px' }}>
// // //             Based on {data.candles?.length || 0} data points
// // //           </div>
// // //         </div>
// // //       )}
      
// // //       {/* Highlight explanation */}
// // //       <div style={{
// // //         position: 'absolute',
// // //         bottom: '20px',
// // //         left: '10px',
// // //         backgroundColor: 'rgba(255, 255, 255, 0.9)',
// // //         padding: '10px',
// // //         borderRadius: '6px',
// // //         fontSize: '11px',
// // //         border: '1px solid #dee2e6'
// // //       }}>
// // //         <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
// // //           Chart Legend:
// // //         </div>
// // //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
// // //           <div style={{
// // //             width: '12px',
// // //             height: '12px',
// // //             backgroundColor: '#007bff',
// // //             borderRadius: '50%',
// // //             marginRight: '6px'
// // //           }}></div>
// // //           <span>Current/Latest Value</span>
// // //         </div>
// // //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
// // //           <div style={{
// // //             width: '12px',
// // //             height: '12px',
// // //             backgroundColor: '#26a69a',
// // //             borderRadius: '50%',
// // //             marginRight: '6px'
// // //           }}></div>
// // //           <span>Bullish (Price Up)</span>
// // //         </div>
// // //         <div style={{ display: 'flex', alignItems: 'center' }}>
// // //           <div style={{
// // //             width: '12px',
// // //             height: '12px',
// // //             backgroundColor: '#ef5350',
// // //             borderRadius: '50%',
// // //             marginRight: '6px'
// // //           }}></div>
// // //           <span>Bearish (Price Down)</span>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CandlestickChart;

// // import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   TimeScale,
// //   LineController,
// //   LineElement,
// //   PointElement,
// //   BarController,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   Filler
// // } from 'chart.js';
// // import 'chartjs-adapter-date-fns';
// // import { Chart } from 'react-chartjs-2';
// // import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

// // // Register ChartJS components
// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   TimeScale,
// //   LineController,
// //   LineElement,
// //   PointElement,
// //   BarController,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   Filler,
// //   CandlestickController,
// //   CandlestickElement
// // );

// // // Helper function for time unit - moved outside component
// // const getTimeUnit = (tf) => {
// //   const unitMap = {
// //     '1m': 'minute',
// //     '5m': 'minute',
// //     '15m': 'minute',
// //     '30m': 'minute',
// //     '1h': 'hour',
// //     '4h': 'hour',
// //     '1d': 'day',
// //     '1w': 'week',
// //     '1M': 'month',
// //     '24h': 'hour'
// //   };
// //   return unitMap[tf] || 'hour';
// // };

// // const CandlestickChart = ({ data, symbol, timeframe, isRefreshing = false, currentPrice }) => {
// //   const chartRef = useRef(null);
// //   const [currentValue, setCurrentValue] = useState(null);
// //   const [highlightedPoint, setHighlightedPoint] = useState(null);
// //   const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
// //   const [realTimeData, setRealTimeData] = useState(null);

// //   // Get the most recent data point from chart data - memoized
// //   const getLatestDataPoint = useCallback(() => {
// //     if (!data?.candles || data.candles.length === 0) return null;
    
// //     // Sort by timestamp to get the latest
// //     const sortedCandles = [...data.candles].sort((a, b) => b.x - a.x);
// //     return sortedCandles[0];
// //   }, [data?.candles]);

// //   // Update real-time data when currentPrice or data changes
// //   useEffect(() => {
// //     if (currentPrice !== undefined && currentPrice !== null) {
// //       console.log(`💰 Real-time price update for ${symbol}: $${currentPrice}`);
      
// //       // Create a new data point for the current time
// //       const now = new Date();
// //       const latestChartPoint = getLatestDataPoint();
      
// //       // Use the real current price from WebSocket
// //       const realTimeCandle = {
// //         x: now.getTime(),
// //         o: currentPrice,
// //         h: currentPrice,
// //         l: currentPrice,
// //         c: currentPrice,
// //         v: latestChartPoint?.v || Math.floor(1000000 + Math.random() * 5000000),
// //         isRealTime: true
// //       };
      
// //       setRealTimeData(realTimeCandle);
// //       setCurrentValue(currentPrice);
// //       setHighlightedPoint({
// //         x: now.getTime(),
// //         y: currentPrice,
// //         price: currentPrice,
// //         time: now
// //       });
// //       setLastUpdateTime(now);
// //     } else if (data?.candles && data.candles.length > 0) {
// //       // Fallback to the latest chart data
// //       const latest = getLatestDataPoint();
// //       if (latest) {
// //         console.log(`📊 Using chart data for ${symbol}: $${latest.c}`);
// //         setCurrentValue(latest.c);
// //         setHighlightedPoint({
// //           x: new Date(latest.x).getTime(),
// //           y: latest.c,
// //           price: latest.c,
// //           time: new Date(latest.x)
// //         });
// //         setLastUpdateTime(new Date(latest.x));
// //       }
// //     }
// //   }, [currentPrice, data, symbol, getLatestDataPoint]);

// //   // Update last update time when data changes
// //   useEffect(() => {
// //     if (data?.candles && data.candles.length > 0) {
// //       const latest = getLatestDataPoint();
// //       if (latest) {
// //         setLastUpdateTime(new Date(latest.x));
// //       }
// //     }
// //   }, [data, getLatestDataPoint]);

// //   // Prepare candlestick data with real-time updates - memoized to prevent re-renders
// //   const chartData = useMemo(() => {
// //     if (!data?.candles) return { datasets: [] };

// //     const candles = data.candles;
// //     const indicators = data.indicators;
    
// //     // Get the latest candle from historical data
// //     const latestChartCandle = getLatestDataPoint();
    
// //     // Combine historical data with real-time data
// //     let allCandles = [...candles];
    
// //     // If we have real-time data and it's newer than the last historical point, add it
// //     if (realTimeData && (!latestChartCandle || realTimeData.x > latestChartCandle.x)) {
// //       allCandles = [...candles, realTimeData];
// //     }
    
// //     // Sort all candles by timestamp
// //     const sortedCandles = allCandles.sort((a, b) => a.x - b.x);
    
// //     // Convert to financial chart format with highlighting
// //     const candlestickData = sortedCandles.map(candle => ({
// //       x: new Date(candle.x).getTime(),
// //       o: candle.o,
// //       h: candle.h,
// //       l: candle.l,
// //       c: candle.c,
// //       v: candle.v,
// //       // Add custom property for highlighting
// //       isCurrent: realTimeData ? candle.x === realTimeData.x : 
// //                  (latestChartCandle && candle.x === latestChartCandle.x),
// //       isRealTime: candle.isRealTime || false
// //     }));

// //     // Calculate moving averages based on real current price if available
// //     const latestPrice = currentValue || (latestChartCandle?.c || 0);
// //     const sma20 = indicators?.movingAverages?.sma20 || latestPrice;
// //     const sma50 = indicators?.movingAverages?.sma50 || latestPrice;
    
// //     // Bollinger Bands based on current price
// //     const bb = indicators?.bollingerBands || { 
// //       upper: latestPrice * 1.05, 
// //       middle: latestPrice, 
// //       lower: latestPrice * 0.95 
// //     };

// //     // For real-time display, create a line that follows the current price
// //     const currentPriceData = currentValue ? sortedCandles.map(candle => ({
// //       x: candle.x,
// //       y: currentValue
// //     })) : [];

// //     return {
// //       datasets: [
// //         // Candlestick data with current value highlight
// //         {
// //           label: `${symbol} Price`,
// //           data: candlestickData,
// //           type: 'candlestick',
// //           borderColor: 'rgba(0, 0, 0, 0.3)',
// //           borderWidth: 1,
// //           color: {
// //             up: '#26a69a', // Green for bullish
// //             down: '#ef5350', // Red for bearish
// //             unchanged: '#999'
// //           },
// //           // Custom styling for current candle
// //           borderColor: (ctx) => {
// //             const point = candlestickData[ctx.dataIndex];
// //             return point.isCurrent ? '#007bff' : 'rgba(0, 0, 0, 0.3)';
// //           },
// //           borderWidth: (ctx) => {
// //             const point = candlestickData[ctx.dataIndex];
// //             return point.isCurrent ? 3 : 1;
// //           },
// //           yAxisID: 'y'
// //         },
// //         // Real-time current price marker (only if we have real-time data)
// //         {
// //           label: 'Live Price',
// //           data: realTimeData ? [{
// //             x: realTimeData.x,
// //             y: realTimeData.c
// //           }] : [],
// //           type: 'line',
// //           borderColor: '#ff5722',
// //           borderWidth: 2,
// //           pointBackgroundColor: '#ff5722',
// //           pointBorderColor: '#fff',
// //           pointBorderWidth: 2,
// //           pointRadius: 8,
// //           pointHoverRadius: 12,
// //           fill: false,
// //           tension: 0,
// //           pointStyle: 'star',
// //           pointRotation: 45
// //         },
// //         // Current price level line (horizontal across chart)
// //         {
// //           label: 'Current Price Level',
// //           data: currentPriceData,
// //           type: 'line',
// //           borderColor: 'rgba(0, 123, 255, 0.5)',
// //           borderWidth: 1,
// //           borderDash: [5, 5],
// //           pointRadius: 0,
// //           fill: false,
// //           tension: 0
// //         },
// //         // Volume bars with current highlight
// //         {
// //           label: 'Volume',
// //           data: candlestickData.map(d => ({ 
// //             x: d.x, 
// //             y: d.v,
// //             isCurrent: d.isCurrent
// //           })),
// //           type: 'bar',
// //           backgroundColor: (ctx) => {
// //             const point = candlestickData[ctx.dataIndex];
// //             if (point.isCurrent) {
// //               return point.c >= point.o ? 'rgba(0, 123, 255, 0.7)' : 'rgba(220, 53, 69, 0.7)';
// //             }
// //             return point.c >= point.o ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
// //           },
// //           borderColor: (ctx) => {
// //             const point = candlestickData[ctx.dataIndex];
// //             if (point.isCurrent) {
// //               return point.c >= point.o ? 'rgba(0, 123, 255, 1)' : 'rgba(220, 53, 69, 1)';
// //             }
// //             return point.c >= point.o ? 'rgba(38, 166, 154, 1)' : 'rgba(239, 83, 80, 1)';
// //           },
// //           borderWidth: (ctx) => {
// //             const point = candlestickData[ctx.dataIndex];
// //             return point.isCurrent ? 2 : 1;
// //           },
// //           yAxisID: 'y1',
// //           hidden: true
// //         },
// //         // SMA 20
// //         {
// //           label: 'SMA 20',
// //           data: candlestickData.map(d => ({ x: d.x, y: sma20 })),
// //           type: 'line',
// //           borderColor: 'rgba(255, 152, 0, 0.8)',
// //           borderWidth: 2,
// //           pointRadius: 0,
// //           fill: false,
// //           tension: 0.1
// //         },
// //         // SMA 50
// //         {
// //           label: 'SMA 50',
// //           data: candlestickData.map(d => ({ x: d.x, y: sma50 })),
// //           type: 'line',
// //           borderColor: 'rgba(156, 39, 176, 0.8)',
// //           borderWidth: 2,
// //           pointRadius: 0,
// //           fill: false,
// //           tension: 0.1
// //         },
// //         // Bollinger Bands Upper
// //         {
// //           label: 'BB Upper',
// //           data: candlestickData.map(d => ({ x: d.x, y: bb.upper })),
// //           type: 'line',
// //           borderColor: 'rgba(33, 150, 243, 0.5)',
// //           borderWidth: 1,
// //           pointRadius: 0,
// //           borderDash: [5, 5],
// //           fill: false
// //         },
// //         // Bollinger Bands Middle
// //         {
// //           label: 'BB Middle',
// //           data: candlestickData.map(d => ({ x: d.x, y: bb.middle })),
// //           type: 'line',
// //           borderColor: 'rgba(33, 150, 243, 0.8)',
// //           borderWidth: 1,
// //           pointRadius: 0,
// //           fill: false
// //         },
// //         // Bollinger Bands Lower
// //         {
// //           label: 'BB Lower',
// //           data: candlestickData.map(d => ({ x: d.x, y: bb.lower })),
// //           type: 'line',
// //           borderColor: 'rgba(33, 150, 243, 0.5)',
// //           borderWidth: 1,
// //           pointRadius: 0,
// //           borderDash: [5, 5],
// //           fill: false
// //         }
// //       ]
// //     };
// //   }, [data, symbol, getLatestDataPoint, realTimeData, currentValue]);

// //   // Options memoized
// //   const options = useMemo(() => ({
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     interaction: {
// //       mode: 'index',
// //       intersect: false
// //     },
// //     plugins: {
// //       legend: {
// //         position: 'top',
// //         labels: {
// //           usePointStyle: true,
// //           boxWidth: 10,
// //           font: {
// //             size: 11
// //           },
// //           filter: (legendItem) => {
// //             // Hide the current price line from legend
// //             return !legendItem.text.includes('Current Price Level');
// //           }
// //         }
// //       },
// //       title: {
// //         display: true,
// //         text: `${symbol} - ${timeframe} Candlestick Chart`,
// //         font: {
// //           size: 16,
// //           weight: 'bold'
// //         }
// //       },
// //       tooltip: {
// //         backgroundColor: 'rgba(0, 0, 0, 0.8)',
// //         titleColor: '#fff',
// //         bodyColor: '#fff',
// //         borderColor: 'rgba(255, 255, 255, 0.1)',
// //         borderWidth: 1,
// //         callbacks: {
// //           title: (context) => {
// //             const date = new Date(context[0].parsed.x);
// //             return date.toLocaleString();
// //           },
// //           label: (context) => {
// //             const dataset = context.dataset;
// //             const dataPoint = dataset.data[context.dataIndex];
// //             const chartDataPoint = chartData.datasets[0]?.data[context.dataIndex];
            
// //             if (dataset.label === 'Live Price') {
// //               return `Real-time Price: $${dataPoint.y.toFixed(2)}`;
// //             } else if (dataset.type === 'candlestick') {
// //               const labels = [
// //                 `Open: $${dataPoint.o.toFixed(2)}`,
// //                 `High: $${dataPoint.h.toFixed(2)}`,
// //                 `Low: $${dataPoint.l.toFixed(2)}`,
// //                 `Close: $${dataPoint.c.toFixed(2)}`,
// //                 `Volume: ${dataPoint.v.toLocaleString()}`
// //               ];
              
// //               if (chartDataPoint?.isRealTime) {
// //                 labels.push('🔥 LIVE - Real-time Update');
// //               } else if (chartDataPoint?.isCurrent) {
// //                 labels.push('📊 Latest Chart Data');
// //               }
              
// //               return labels;
// //             } else if (dataset.type === 'bar') {
// //               return `Volume: ${dataPoint.y.toLocaleString()}`;
// //             } else {
// //               return `${dataset.label}: $${dataPoint.y.toFixed(2)}`;
// //             }
// //           },
// //           labelColor: (context) => {
// //             if (context.dataset.label === 'Live Price') {
// //               return {
// //                 borderColor: '#ff5722',
// //                 backgroundColor: '#ff5722'
// //               };
// //             }
// //             return {
// //               borderColor: context.dataset.borderColor,
// //               backgroundColor: context.dataset.borderColor
// //             };
// //           }
// //         }
// //       }
// //     },
// //     scales: {
// //       x: {
// //         type: 'time',
// //         time: {
// //           unit: getTimeUnit(timeframe),
// //           displayFormats: {
// //             minute: 'HH:mm',
// //             hour: 'MMM dd HH:mm',
// //             day: 'MMM dd',
// //             week: 'MMM dd',
// //             month: 'MMM yyyy'
// //           }
// //         },
// //         grid: {
// //           color: 'rgba(0, 0, 0, 0.05)'
// //         },
// //         ticks: {
// //           maxTicksLimit: 10,
// //           font: {
// //             size: 11
// //           }
// //         }
// //       },
// //       y: {
// //         position: 'right',
// //         grid: {
// //           color: 'rgba(0, 0, 0, 0.05)'
// //         },
// //         ticks: {
// //           callback: (value) => `$${value.toFixed(2)}`,
// //           font: {
// //             size: 11
// //           }
// //         },
// //         title: {
// //           display: true,
// //           text: 'Price ($)',
// //           font: {
// //             size: 12,
// //             weight: 'bold'
// //           }
// //         }
// //       },
// //       y1: {
// //         position: 'left',
// //         grid: {
// //           drawOnChartArea: false
// //         },
// //         title: {
// //           display: true,
// //           text: 'Volume',
// //           font: {
// //             size: 12,
// //             weight: 'bold'
// //           }
// //         }
// //       }
// //     },
// //     animation: {
// //       duration: 0
// //     }
// //   }), [symbol, timeframe]);

// //   // Separate function to draw custom lines (prevent infinite loops)
// //   const drawCustomLines = useCallback((chart) => {
// //     const ctx = chart.ctx;
    
// //     if (highlightedPoint && currentValue) {
// //       const xAxis = chart.scales.x;
// //       const yAxis = chart.scales.y;
      
// //       // Draw vertical line at current time (only if we have real-time data)
// //       if (realTimeData) {
// //         const xPos = xAxis.getPixelForValue(highlightedPoint.x);
// //         ctx.save();
// //         ctx.beginPath();
// //         ctx.moveTo(xPos, yAxis.top);
// //         ctx.lineTo(xPos, yAxis.bottom);
// //         ctx.lineWidth = 1;
// //         ctx.strokeStyle = 'rgba(255, 87, 34, 0.3)';
// //         ctx.setLineDash([5, 5]);
// //         ctx.stroke();
// //         ctx.restore();
// //       }
      
// //       // Draw horizontal line at current price
// //       const yPos = yAxis.getPixelForValue(currentValue);
// //       ctx.save();
// //       ctx.beginPath();
// //       ctx.moveTo(xAxis.left, yPos);
// //       ctx.lineTo(xAxis.right, yPos);
// //       ctx.lineWidth = 1;
// //       ctx.strokeStyle = realTimeData ? 'rgba(255, 87, 34, 0.3)' : 'rgba(0, 123, 255, 0.3)';
// //       ctx.setLineDash([5, 5]);
// //       ctx.stroke();
// //       ctx.restore();
// //     }
// //   }, [highlightedPoint, currentValue, realTimeData]);

// //   // Add plugin for custom drawing
// //   const plugins = useMemo(() => [{
// //     id: 'customLines',
// //     afterDraw: drawCustomLines
// //   }], [drawCustomLines]);

// //   return (
// //     <div style={{ height: '500px', position: 'relative' }}>
// //       <Chart
// //         ref={chartRef}
// //         type='candlestick'
// //         data={chartData}
// //         options={options}
// //         plugins={plugins}
// //       />
      
// //       {/* Current value display */}
// //       {currentValue !== null && highlightedPoint && (
// //         <div style={{
// //           position: 'absolute',
// //           top: '10px',
// //           left: '10px',
// //           backgroundColor: 'rgba(255, 255, 255, 0.95)',
// //           padding: '15px',
// //           borderRadius: '8px',
// //           border: `2px solid ${realTimeData ? '#ff5722' : '#007bff'}`,
// //           fontSize: '14px',
// //           minWidth: '250px',
// //           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
// //           zIndex: 100
// //         }}>
// //           <div style={{ 
// //             display: 'flex', 
// //             alignItems: 'center', 
// //             justifyContent: 'space-between',
// //             marginBottom: '8px'
// //           }}>
// //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
// //               {realTimeData ? 'Live Value' : 'Latest Value'}
// //             </span>
// //             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
// //               {isRefreshing && (
// //                 <div className="spinner-border spinner-border-sm text-warning" role="status" style={{ width: '0.8rem', height: '0.8rem' }}>
// //                   <span className="visually-hidden">Refreshing...</span>
// //                 </div>
// //               )}
// //               <span style={{
// //                 padding: '2px 8px',
// //                 backgroundColor: realTimeData ? '#ff5722' : '#28a745',
// //                 color: 'white',
// //                 borderRadius: '4px',
// //                 fontSize: '11px',
// //                 fontWeight: 'bold'
// //               }}>
// //                 {realTimeData ? '🔥 LIVE' : '📊 CHART'}
// //               </span>
// //             </div>
// //           </div>
// //           <div style={{ 
// //             fontSize: '28px', 
// //             fontWeight: 'bold',
// //             color: realTimeData ? '#ff5722' : '#007bff',
// //             marginBottom: '5px'
// //           }}>
// //             ${currentValue.toFixed(2)}
// //           </div>
// //           <div style={{ 
// //             display: 'flex', 
// //             justifyContent: 'space-between',
// //             fontSize: '12px',
// //             color: '#666'
// //           }}>
// //             <div>
// //               <div>Time:</div>
// //               <div style={{ fontWeight: '600' }}>
// //                 {highlightedPoint.time.toLocaleTimeString()}
// //               </div>
// //             </div>
// //             <div>
// //               <div>Date:</div>
// //               <div style={{ fontWeight: '600' }}>
// //                 {highlightedPoint.time.toLocaleDateString()}
// //               </div>
// //             </div>
// //           </div>
// //           <div style={{
// //             marginTop: '10px',
// //             paddingTop: '10px',
// //             borderTop: '1px solid #eee',
// //             fontSize: '12px',
// //             color: '#666'
// //           }}>
// //             {realTimeData ? 'Real-time WebSocket data' : 'Historical chart data'} • 
// //             Updated: {lastUpdateTime.toLocaleTimeString()}
// //           </div>
// //         </div>
// //       )}
      
// //       {/* Technical indicators overlay */}
// //       {data?.indicators && (
// //         <div style={{
// //           position: 'absolute',
// //           top: '10px',
// //           right: '10px',
// //           backgroundColor: 'rgba(255, 255, 255, 0.95)',
// //           padding: '15px',
// //           borderRadius: '8px',
// //           border: '1px solid #dee2e6',
// //           fontSize: '12px',
// //           maxWidth: '200px',
// //           zIndex: 100
// //         }}>
// //           <div style={{ 
// //             fontWeight: 'bold', 
// //             marginBottom: '8px',
// //             borderBottom: '1px solid #eee',
// //             paddingBottom: '5px'
// //           }}>
// //             Technical Indicators
// //           </div>
// //           <div style={{ marginBottom: '4px' }}>
// //             Current Price: <span style={{ fontWeight: '600', color: '#007bff' }}>
// //               ${currentValue?.toFixed(2) || 'N/A'}
// //             </span>
// //           </div>
// //           <div style={{ marginBottom: '4px' }}>
// //             RSI: <span style={{
// //               color: data.indicators.rsi > 70 ? '#ef5350' : 
// //                      data.indicators.rsi < 30 ? '#26a69a' : '#666',
// //               fontWeight: '600'
// //             }}>
// //               {data.indicators.rsi?.toFixed(2)}
// //             </span>
// //           </div>
// //           <div style={{ marginBottom: '4px' }}>
// //             MACD: <span style={{ fontWeight: '600' }}>
// //               {data.indicators.macd?.macd?.toFixed(3)}
// //             </span>
// //           </div>
// //           <div style={{ marginBottom: '4px' }}>
// //             Signal: <span style={{ fontWeight: '600' }}>
// //               {data.indicators.macd?.signal?.toFixed(3)}
// //             </span>
// //           </div>
// //           <div style={{ marginTop: '8px', color: '#999', fontSize: '11px' }}>
// //             {data.candles?.length || 0} data points • 
// //             {realTimeData ? ' Live updates' : ' Historical'}
// //           </div>
// //         </div>
// //       )}
      
// //       {/* Highlight explanation */}
// //       <div style={{
// //         position: 'absolute',
// //         bottom: '20px',
// //         left: '10px',
// //         backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //         padding: '10px',
// //         borderRadius: '6px',
// //         fontSize: '11px',
// //         border: '1px solid #dee2e6'
// //       }}>
// //         <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
// //           Chart Legend:
// //         </div>
// //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
// //           <div style={{
// //             width: '12px',
// //             height: '12px',
// //             backgroundColor: '#ff5722',
// //             borderRadius: '50%',
// //             marginRight: '6px'
// //           }}></div>
// //           <span>Real-time Price</span>
// //         </div>
// //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
// //           <div style={{
// //             width: '12px',
// //             height: '12px',
// //             backgroundColor: '#007bff',
// //             borderRadius: '50%',
// //             marginRight: '6px'
// //           }}></div>
// //           <span>Latest Chart Value</span>
// //         </div>
// //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
// //           <div style={{
// //             width: '12px',
// //             height: '12px',
// //             backgroundColor: '#26a69a',
// //             borderRadius: '50%',
// //             marginRight: '6px'
// //           }}></div>
// //           <span>Bullish (Price Up)</span>
// //         </div>
// //         <div style={{ display: 'flex', alignItems: 'center' }}>
// //           <div style={{
// //             width: '12px',
// //             height: '12px',
// //             backgroundColor: '#ef5350',
// //             borderRadius: '50%',
// //             marginRight: '6px'
// //           }}></div>
// //           <span>Bearish (Price Down)</span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CandlestickChart;
// import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   TimeScale,
//   LineController,
//   LineElement,
//   PointElement,
//   BarController,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';
// import 'chartjs-adapter-date-fns';
// import { Chart } from 'react-chartjs-2';
// import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
// import { ZoomIn, ZoomOut, Maximize2, TrendingUp, TrendingDown, Activity, BarChart3, Settings } from 'lucide-react';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   TimeScale,
//   LineController,
//   LineElement,
//   PointElement,
//   BarController,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   CandlestickController,
//   CandlestickElement
// );

// const getTimeUnit = (tf) => {
//   const unitMap = {
//     '1m': 'minute',
//     '5m': 'minute',
//     '15m': 'minute',
//     '30m': 'minute',
//     '1h': 'hour',
//     '4h': 'hour',
//     '1d': 'day',
//     '1w': 'week',
//     '1M': 'month',
//     '24h': 'hour'
//   };
//   return unitMap[tf] || 'hour';
// };

// const CandlestickChart = ({ data, symbol = 'BTC/USD', timeframe = '1h', isRefreshing = false, currentPrice }) => {
//   const chartRef = useRef(null);
//   const containerRef = useRef(null);
//   const [currentValue, setCurrentValue] = useState(null);
//   const [highlightedPoint, setHighlightedPoint] = useState(null);
//   const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
//   const [realTimeData, setRealTimeData] = useState(null);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [chartLimits, setChartLimits] = useState({ minX: null, maxX: null, minY: null, maxY: null });
//   const [showVolume, setShowVolume] = useState(true);
//   const [showIndicators, setShowIndicators] = useState(true);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [priceChange, setPriceChange] = useState({ value: 0, percentage: 0 });

//   const getLatestDataPoint = useCallback(() => {
//     if (!data?.candles || data.candles.length === 0) return null;
//     const sortedCandles = [...data.candles].sort((a, b) => b.x - a.x);
//     return sortedCandles[0];
//   }, [data?.candles]);

//   useEffect(() => {
//     if (currentPrice !== undefined && currentPrice !== null) {
//       const now = new Date();
//       const latestChartPoint = getLatestDataPoint();
      
//       const realTimeCandle = {
//         x: now.getTime(),
//         o: currentPrice,
//         h: currentPrice,
//         l: currentPrice,
//         c: currentPrice,
//         v: latestChartPoint?.v || Math.floor(1000000 + Math.random() * 5000000),
//         isRealTime: true
//       };
      
//       if (latestChartPoint) {
//         const change = currentPrice - latestChartPoint.c;
//         const changePercent = (change / latestChartPoint.c) * 100;
//         setPriceChange({ value: change, percentage: changePercent });
//       }
      
//       setRealTimeData(realTimeCandle);
//       setCurrentValue(currentPrice);
//       setHighlightedPoint({
//         x: now.getTime(),
//         y: currentPrice,
//         price: currentPrice,
//         time: now
//       });
//       setLastUpdateTime(now);
//     } else if (data?.candles && data.candles.length > 0) {
//       const latest = getLatestDataPoint();
//       if (latest) {
//         setCurrentValue(latest.c);
//         setHighlightedPoint({
//           x: new Date(latest.x).getTime(),
//           y: latest.c,
//           price: latest.c,
//           time: new Date(latest.x)
//         });
//         setLastUpdateTime(new Date(latest.x));
//       }
//     }
//   }, [currentPrice, data, getLatestDataPoint]);

//   const chartData = useMemo(() => {
//     if (!data?.candles) return { datasets: [] };

//     const candles = data.candles;
//     const indicators = data.indicators;
//     const latestChartCandle = getLatestDataPoint();
    
//     let allCandles = [...candles];
//     if (realTimeData && (!latestChartCandle || realTimeData.x > latestChartCandle.x)) {
//       allCandles = [...candles, realTimeData];
//     }
    
//     const sortedCandles = allCandles.sort((a, b) => a.x - b.x);
//     const candlestickData = sortedCandles.map(candle => ({
//       x: new Date(candle.x).getTime(),
//       o: candle.o,
//       h: candle.h,
//       l: candle.l,
//       c: candle.c,
//       v: candle.v,
//       isCurrent: realTimeData ? candle.x === realTimeData.x : 
//                  (latestChartCandle && candle.x === latestChartCandle.x),
//       isRealTime: candle.isRealTime || false
//     }));

//     const latestPrice = currentValue || (latestChartCandle?.c || 0);
//     const sma20 = indicators?.movingAverages?.sma20 || latestPrice;
//     const sma50 = indicators?.movingAverages?.sma50 || latestPrice;
//     const bb = indicators?.bollingerBands || { 
//       upper: latestPrice * 1.05, 
//       middle: latestPrice, 
//       lower: latestPrice * 0.95 
//     };

//     const datasets = [
//       {
//         label: `${symbol} Price`,
//         data: candlestickData,
//         type: 'candlestick',
//         borderColor: 'rgba(0, 0, 0, 0.3)',
//         borderWidth: 1,
//         color: {
//           up: '#00C853',
//           down: '#FF1744',
//           unchanged: '#999'
//         },
//         borderColor: (ctx) => {
//           const point = candlestickData[ctx.dataIndex];
//           return point.isCurrent ? '#2196F3' : 'rgba(0, 0, 0, 0.3)';
//         },
//         borderWidth: (ctx) => {
//           const point = candlestickData[ctx.dataIndex];
//           return point.isCurrent ? 3 : 1;
//         },
//         yAxisID: 'y'
//       },
//       {
//         label: 'Live Price',
//         data: realTimeData ? [{
//           x: realTimeData.x,
//           y: realTimeData.c
//         }] : [],
//         type: 'line',
//         borderColor: '#FF6B35',
//         borderWidth: 3,
//         pointBackgroundColor: '#FF6B35',
//         pointBorderColor: '#fff',
//         pointBorderWidth: 3,
//         pointRadius: 10,
//         pointHoverRadius: 14,
//         fill: false,
//         tension: 0,
//         pointStyle: 'circle'
//       }
//     ];

//     if (showVolume) {
//       datasets.push({
//         label: 'Volume',
//         data: candlestickData.map(d => ({ 
//           x: d.x, 
//           y: d.v,
//           isCurrent: d.isCurrent
//         })),
//         type: 'bar',
//         backgroundColor: (ctx) => {
//           const point = candlestickData[ctx.dataIndex];
//           if (point.isCurrent) {
//             return point.c >= point.o ? 'rgba(33, 150, 243, 0.7)' : 'rgba(244, 67, 54, 0.7)';
//           }
//           return point.c >= point.o ? 'rgba(0, 200, 83, 0.25)' : 'rgba(255, 23, 68, 0.25)';
//         },
//         borderColor: (ctx) => {
//           const point = candlestickData[ctx.dataIndex];
//           if (point.isCurrent) {
//             return point.c >= point.o ? 'rgba(33, 150, 243, 1)' : 'rgba(244, 67, 54, 1)';
//           }
//           return point.c >= point.o ? 'rgba(0, 200, 83, 0.8)' : 'rgba(255, 23, 68, 0.8)';
//         },
//         borderWidth: 1,
//         yAxisID: 'y1'
//       });
//     }

//     if (showIndicators) {
//       datasets.push(
//         {
//           label: 'SMA 20',
//           data: candlestickData.map(d => ({ x: d.x, y: sma20 })),
//           type: 'line',
//           borderColor: 'rgba(255, 152, 0, 0.9)',
//           borderWidth: 2,
//           pointRadius: 0,
//           fill: false,
//           tension: 0.4
//         },
//         {
//           label: 'SMA 50',
//           data: candlestickData.map(d => ({ x: d.x, y: sma50 })),
//           type: 'line',
//           borderColor: 'rgba(156, 39, 176, 0.9)',
//           borderWidth: 2,
//           pointRadius: 0,
//           fill: false,
//           tension: 0.4
//         },
//         {
//           label: 'BB Upper',
//           data: candlestickData.map(d => ({ x: d.x, y: bb.upper })),
//           type: 'line',
//           borderColor: 'rgba(33, 150, 243, 0.5)',
//           borderWidth: 1,
//           pointRadius: 0,
//           borderDash: [5, 5],
//           fill: '+1'
//         },
//         {
//           label: 'BB Middle',
//           data: candlestickData.map(d => ({ x: d.x, y: bb.middle })),
//           type: 'line',
//           borderColor: 'rgba(33, 150, 243, 0.8)',
//           borderWidth: 1,
//           pointRadius: 0,
//           fill: false
//         },
//         {
//           label: 'BB Lower',
//           data: candlestickData.map(d => ({ x: d.x, y: bb.lower })),
//           type: 'line',
//           borderColor: 'rgba(33, 150, 243, 0.5)',
//           borderWidth: 1,
//           pointRadius: 0,
//           borderDash: [5, 5],
//           fill: false,
//           backgroundColor: 'rgba(33, 150, 243, 0.05)'
//         }
//       );
//     }

//     return { datasets };
//   }, [data, symbol, getLatestDataPoint, realTimeData, currentValue, showVolume, showIndicators]);

//   const handleZoomIn = () => {
//     setZoomLevel(prev => Math.min(prev * 1.2, 5));
//   };

//   const handleZoomOut = () => {
//     setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
//   };

//   const handleResetZoom = () => {
//     setZoomLevel(1);
//     setChartLimits({ minX: null, maxX: null, minY: null, maxY: null });
//     if (chartRef.current) {
//       chartRef.current.resetZoom();
//     }
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       containerRef.current?.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   const options = useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//       mode: 'index',
//       intersect: false
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           usePointStyle: true,
//           boxWidth: 8,
//           padding: 15,
//           font: {
//             size: 11,
//             family: "'Inter', 'Segoe UI', sans-serif"
//           },
//           filter: (legendItem) => {
//             return !legendItem.text.includes('Current Price Level') && 
//                    !legendItem.text.includes('Live Price');
//           }
//         }
//       },
//       title: {
//         display: false
//       },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(17, 24, 39, 0.95)',
//         titleColor: '#fff',
//         bodyColor: '#E5E7EB',
//         borderColor: 'rgba(255, 255, 255, 0.1)',
//         borderWidth: 1,
//         padding: 12,
//         cornerRadius: 8,
//         titleFont: {
//           size: 13,
//           weight: '600'
//         },
//         bodyFont: {
//           size: 12
//         },
//         callbacks: {
//           title: (context) => {
//             const date = new Date(context[0].parsed.x);
//             return date.toLocaleString();
//           },
//           label: (context) => {
//             const dataset = context.dataset;
//             const dataPoint = dataset.data[context.dataIndex];
//             const chartDataPoint = chartData.datasets[0]?.data[context.dataIndex];
            
//             if (dataset.label === 'Live Price') {
//               return `🔴 Real-time: $${dataPoint.y.toFixed(2)}`;
//             } else if (dataset.type === 'candlestick') {
//               const labels = [
//                 `Open: $${dataPoint.o.toFixed(2)}`,
//                 `High: $${dataPoint.h.toFixed(2)}`,
//                 `Low: $${dataPoint.l.toFixed(2)}`,
//                 `Close: $${dataPoint.c.toFixed(2)}`,
//                 `Volume: ${dataPoint.v.toLocaleString()}`
//               ];
              
//               if (chartDataPoint?.isRealTime) {
//                 labels.push('🔥 LIVE UPDATE');
//               }
              
//               return labels;
//             } else if (dataset.type === 'bar') {
//               return `Volume: ${dataPoint.y.toLocaleString()}`;
//             } else {
//               return `${dataset.label}: $${dataPoint.y.toFixed(2)}`;
//             }
//           }
//         }
//       },
//       zoom: {
//         pan: {
//           enabled: true,
//           mode: 'xy',
//           modifierKey: 'ctrl'
//         },
//         zoom: {
//           wheel: {
//             enabled: true,
//             speed: 0.1
//           },
//           pinch: {
//             enabled: true
//           },
//           mode: 'xy'
//         },
//         limits: chartLimits.minX ? {
//           x: { min: chartLimits.minX, max: chartLimits.maxX },
//           y: { min: chartLimits.minY, max: chartLimits.maxY }
//         } : undefined
//       }
//     },
//     scales: {
//       x: {
//         type: 'time',
//         time: {
//           unit: getTimeUnit(timeframe),
//           displayFormats: {
//             minute: 'HH:mm',
//             hour: 'MMM dd HH:mm',
//             day: 'MMM dd',
//             week: 'MMM dd',
//             month: 'MMM yyyy'
//           }
//         },
//         grid: {
//           color: 'rgba(0, 0, 0, 0.04)',
//           drawBorder: false
//         },
//         ticks: {
//           maxTicksLimit: 12,
//           font: {
//             size: 11,
//             family: "'Inter', sans-serif"
//           },
//           color: '#6B7280'
//         }
//       },
//       y: {
//         position: 'right',
//         grid: {
//           color: 'rgba(0, 0, 0, 0.04)',
//           drawBorder: false
//         },
//         ticks: {
//           callback: (value) => `$${value.toFixed(2)}`,
//           font: {
//             size: 11,
//             family: "'Inter', sans-serif"
//           },
//           color: '#6B7280'
//         },
//         title: {
//           display: false
//         }
//       },
//       y1: {
//         position: 'left',
//         grid: {
//           drawOnChartArea: false
//         },
//         ticks: {
//           font: {
//             size: 10
//           },
//           color: '#9CA3AF'
//         },
//         title: {
//           display: false
//         },
//         display: showVolume
//       }
//     },
//     animation: {
//       duration: 300
//     }
//   }), [timeframe, chartData, chartLimits, showVolume]);

//   const drawCustomLines = useCallback((chart) => {
//     const ctx = chart.ctx;
    
//     if (highlightedPoint && currentValue) {
//       const xAxis = chart.scales.x;
//       const yAxis = chart.scales.y;
      
//       if (realTimeData) {
//         const xPos = xAxis.getPixelForValue(highlightedPoint.x);
//         ctx.save();
//         ctx.beginPath();
//         ctx.moveTo(xPos, yAxis.top);
//         ctx.lineTo(xPos, yAxis.bottom);
//         ctx.lineWidth = 2;
//         ctx.strokeStyle = 'rgba(255, 107, 53, 0.4)';
//         ctx.setLineDash([5, 5]);
//         ctx.stroke();
//         ctx.restore();
//       }
      
//       const yPos = yAxis.getPixelForValue(currentValue);
//       ctx.save();
//       ctx.beginPath();
//       ctx.moveTo(xAxis.left, yPos);
//       ctx.lineTo(xAxis.right, yPos);
//       ctx.lineWidth = 2;
//       ctx.strokeStyle = realTimeData ? 'rgba(255, 107, 53, 0.4)' : 'rgba(33, 150, 243, 0.4)';
//       ctx.setLineDash([8, 4]);
//       ctx.stroke();
//       ctx.restore();
//     }
//   }, [highlightedPoint, currentValue, realTimeData]);

//   const plugins = useMemo(() => [{
//     id: 'customLines',
//     afterDraw: drawCustomLines
//   }], [drawCustomLines]);

//   return (
//     <div 
//       ref={containerRef}
//       style={{ 
//         height: isFullscreen ? '100vh' : '600px',
//         background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
//         borderRadius: isFullscreen ? '0' : '16px',
//         boxShadow: isFullscreen ? 'none' : '0 4px 20px rgba(0,0,0,0.08)',
//         padding: '20px',
//         position: 'relative',
//         fontFamily: "'Inter', 'Segoe UI', sans-serif"
//       }}
//     >
//       {/* Header Section */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'flex-start',
//         marginBottom: '20px',
//         flexWrap: 'wrap',
//         gap: '15px'
//       }}>
//         {/* Symbol & Price Info */}
//         <div style={{ flex: '1', minWidth: '250px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
//             <h2 style={{
//               margin: 0,
//               fontSize: '24px',
//               fontWeight: '700',
//               color: '#111827',
//               letterSpacing: '-0.5px'
//             }}>
//               {symbol}
//             </h2>
//             <span style={{
//               padding: '4px 10px',
//               backgroundColor: realTimeData ? '#FEE2E2' : '#E0F2FE',
//               color: realTimeData ? '#DC2626' : '#0369A1',
//               borderRadius: '6px',
//               fontSize: '11px',
//               fontWeight: '600',
//               textTransform: 'uppercase',
//               letterSpacing: '0.5px'
//             }}>
//               {realTimeData ? '● LIVE' : timeframe}
//             </span>
//           </div>
          
//           {currentValue !== null && (
//             <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
//               <span style={{
//                 fontSize: '36px',
//                 fontWeight: '700',
//                 color: realTimeData ? '#FF6B35' : '#111827',
//                 lineHeight: '1'
//               }}>
//                 ${currentValue.toFixed(2)}
//               </span>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '6px',
//                 padding: '6px 10px',
//                 backgroundColor: priceChange.value >= 0 ? '#DCFCE7' : '#FEE2E2',
//                 borderRadius: '8px'
//               }}>
//                 {priceChange.value >= 0 ? (
//                   <TrendingUp size={16} color="#16A34A" />
//                 ) : (
//                   <TrendingDown size={16} color="#DC2626" />
//                 )}
//                 <span style={{
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: priceChange.value >= 0 ? '#16A34A' : '#DC2626'
//                 }}>
//                   {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(2)} ({priceChange.percentage.toFixed(2)}%)
//                 </span>
//               </div>
//             </div>
//           )}
          
//           <div style={{
//             marginTop: '8px',
//             fontSize: '12px',
//             color: '#6B7280',
//             fontWeight: '500'
//           }}>
//             Last updated: {lastUpdateTime.toLocaleString()}
//           </div>
//         </div>

//         {/* Control Buttons */}
//         <div style={{
//           display: 'flex',
//           gap: '8px',
//           flexWrap: 'wrap'
//         }}>
//           <button
//             onClick={handleZoomIn}
//             style={{
//               padding: '10px 14px',
//               backgroundColor: '#fff',
//               border: '1px solid #E5E7EB',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '6px',
//               fontSize: '13px',
//               fontWeight: '500',
//               color: '#374151',
//               transition: 'all 0.2s',
//               boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#F3F4F6';
//               e.currentTarget.style.borderColor = '#D1D5DB';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#fff';
//               e.currentTarget.style.borderColor = '#E5E7EB';
//             }}
//           >
//             <ZoomIn size={16} />
//             Zoom In
//           </button>
          
//           <button
//             onClick={handleZoomOut}
//             style={{
//               padding: '10px 14px',
//               backgroundColor: '#fff',
//               border: '1px solid #E5E7EB',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '6px',
//               fontSize: '13px',
//               fontWeight: '500',
//               color: '#374151',
//               transition: 'all 0.2s',
//               boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#F3F4F6';
//               e.currentTarget.style.borderColor = '#D1D5DB';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#fff';
//               e.currentTarget.style.borderColor = '#E5E7EB';
//             }}
//           >
//             <ZoomOut size={16} />
//             Zoom Out
//           </button>
          
//           <button
//             onClick={handleResetZoom}
//             style={{
//               padding: '10px 14px',
//               backgroundColor: '#fff',
//               border: '1px solid #E5E7EB',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '6px',
//               fontSize: '13px',
//               fontWeight: '500',
//               color: '#374151',
//               transition: 'all 0.2s',
//               boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#F3F4F6';
//               e.currentTarget.style.borderColor = '#D1D5DB';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#fff';
//               e.currentTarget.style.borderColor = '#E5E7EB';
//             }}
//           >
//             <Activity size={16} />
//             Reset
//           </button>
          
//           <button
//             onClick={() => setShowVolume(!showVolume)}
//             style={{
//               padding: '10px 14px',
//               backgroundColor: showVolume ? '#3B82F6' : '#fff',
//               border: '1px solid',
//               borderColor: showVolume ? '#3B82F6' : '#E5E7EB',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '6px',
//               fontSize: '13px',
//               fontWeight: '500',
//               color: showVolume ? '#fff' : '#374151',
//               transition: 'all 0.2s',
//               boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//             }}
//           >
//             <BarChart3 size={16} />
//             Volume
//           </button>
          
//           <button
//             onClick={() => setShowIndicators(!showIndicators)}
//             style={{
//               padding: '10px 14px',
//               backgroundColor: showIndicators ? '#3B82F6' : '#fff',
//               border: '1px solid',
//               borderColor: showIndicators ? '#3B82F6' : '#E5E7EB',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '6px',
//               fontSize: '13px',
//               fontWeight: '500',
//               color: showIndicators ? '#fff' : '#374151',
//               transition: 'all 0.2s',
//               boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//             }}
//           >
//             <Settings size={16} />
//             Indicators
//           </button>
          
//           <button
//             onClick={toggleFullscreen}
//             style={{
//               padding: '10px 14px',
//               backgroundColor: '#fff',
//               border: '1px solid #E5E7EB',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '6px',
//               fontSize: '13px',
//               fontWeight: '500',
//               color: '#374151',
//               transition: 'all 0.2s',
//               boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#F3F4F6';
//               e.currentTarget.style.borderColor = '#D1D5DB';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#fff';
//               e.currentTarget.style.borderColor = '#E5E7EB';
//             }}
//           >
//             <Maximize2 size={16} />
//             {isFullscreen ? 'Exit' : 'Fullscreen'}
//           </button>
//         </div>
//       </div>

//       {/* Chart */}
//       <div style={{ 
//         height: isFullscreen ? 'calc(100vh - 180px)' : '450px',
//         position: 'relative',
//         backgroundColor: '#fff',
//         borderRadius: '12px',
//         padding: '15px',
//         border: '1px solid #E5E7EB'
//       }}>
//         <Chart
//           ref={chartRef}
//           type='candlestick'
//           data={chartData}
//           options={options}
//           plugins={plugins}
//         />
        
//         {/* Technical Indicators Overlay */}
//         {data?.indicators && (
//           <div style={{
//             position: 'absolute',
//             top: '20px',
//             right: '20px',
//             backgroundColor: 'rgba(255, 255, 255, 0.98)',
//             padding: '16px',
//             borderRadius: '12px',
//             border: '1px solid #E5E7EB',
//             fontSize: '12px',
//             minWidth: '180px',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
//             backdropFilter: 'blur(10px)'
//           }}>
//             <div style={{ 
//               fontWeight: '700',
//               marginBottom: '12px',
//               color: '#111827',
//               fontSize: '13px',
//               textTransform: 'uppercase',
//               letterSpacing: '0.5px',
//               borderBottom: '2px solid #E5E7EB',
//               paddingBottom: '8px'
//             }}>
//               Indicators
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ color: '#6B7280' }}>RSI:</span>
//                 <span style={{
//                   color: data.indicators.rsi > 70 ? '#DC2626' : 
//                          data.indicators.rsi < 30 ? '#16A34A' : '#374151',
//                   fontWeight: '600'
//                 }}>
//                   {data.indicators.rsi?.toFixed(2)}
//                 </span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ color: '#6B7280' }}>MACD:</span>
//                 <span style={{ fontWeight: '600', color: '#374151' }}>
//                   {data.indicators.macd?.macd?.toFixed(3)}
//                 </span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ color: '#6B7280' }}>Signal:</span>
//                 <span style={{ fontWeight: '600', color: '#374151' }}>
//                   {data.indicators.macd?.signal?.toFixed(3)}
//                 </span>
//               </div>
//               <div style={{ 
//                 marginTop: '8px', 
//                 paddingTop: '8px',
//                 borderTop: '1px solid #E5E7EB',
//                 color: '#9CA3AF', 
//                 fontSize: '10px',
//                 fontWeight: '500'
//               }}>
//                 {data.candles?.length || 0} candles
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Interactive Tooltip Info */}
//         <div style={{
//           position: 'absolute',
//           bottom: '20px',
//           left: '20px',
//           backgroundColor: 'rgba(17, 24, 39, 0.95)',
//           color: '#fff',
//           padding: '12px 16px',
//           borderRadius: '10px',
//           fontSize: '11px',
//           fontWeight: '500',
//           backdropFilter: 'blur(10px)',
//           border: '1px solid rgba(255, 255, 255, 0.1)',
//           maxWidth: '300px'
//         }}>
//           <div style={{ marginBottom: '6px', color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//             Navigation
//           </div>
//           <div style={{ lineHeight: '1.6' }}>
//             • <strong>Scroll:</strong> Zoom in/out<br />
//             • <strong>Drag:</strong> Pan chart<br />
//             • <strong>Ctrl+Drag:</strong> Precise panning<br />
//             • <strong>Hover:</strong> View details
//           </div>
//         </div>
        
//         {/* Status Indicator */}
//         {isRefreshing && (
//           <div style={{
//             position: 'absolute',
//             top: '20px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             backgroundColor: 'rgba(251, 191, 36, 0.95)',
//             color: '#78350F',
//             padding: '8px 16px',
//             borderRadius: '20px',
//             fontSize: '12px',
//             fontWeight: '600',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
//           }}>
//             <div style={{
//               width: '8px',
//               height: '8px',
//               backgroundColor: '#78350F',
//               borderRadius: '50%',
//               animation: 'pulse 1.5s ease-in-out infinite'
//             }} />
//             Refreshing data...
//           </div>
//         )}
//       </div>
      
//       {/* Chart Legend */}
//       <div style={{
//         marginTop: '16px',
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: '20px',
//         justifyContent: 'center',
//         padding: '12px',
//         backgroundColor: '#F9FAFB',
//         borderRadius: '10px',
//         border: '1px solid #E5E7EB'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <div style={{
//             width: '16px',
//             height: '16px',
//             backgroundColor: '#00C853',
//             borderRadius: '4px',
//             border: '1px solid rgba(0,0,0,0.1)'
//           }} />
//           <span style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>Bullish</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <div style={{
//             width: '16px',
//             height: '16px',
//             backgroundColor: '#FF1744',
//             borderRadius: '4px',
//             border: '1px solid rgba(0,0,0,0.1)'
//           }} />
//           <span style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>Bearish</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <div style={{
//             width: '16px',
//             height: '16px',
//             backgroundColor: '#FF6B35',
//             borderRadius: '50%',
//             border: '2px solid #fff',
//             boxShadow: '0 0 8px rgba(255, 107, 53, 0.5)'
//           }} />
//           <span style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>Live Price</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <div style={{
//             width: '16px',
//             height: '2px',
//             backgroundColor: '#FF9800',
//             borderRadius: '1px'
//           }} />
//           <span style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>SMA 20</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <div style={{
//             width: '16px',
//             height: '2px',
//             backgroundColor: '#9C27B0',
//             borderRadius: '1px'
//           }} />
//           <span style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>SMA 50</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <div style={{
//             width: '16px',
//             height: '2px',
//             backgroundColor: '#2196F3',
//             borderRadius: '1px',
//             borderTop: '2px dashed #2196F3'
//           }} />
//           <span style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>Bollinger Bands</span>
//         </div>
//       </div>

//       {/* Pulse Animation Keyframes */}
//       <style>{`
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//             transform: scale(1);
//           }
//           50% {
//             opacity: 0.5;
//             transform: scale(1.2);
//           }
//         }
        
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
//       `}</style>
//     </div>
//   );
// };

// // Demo component with sample data
// const DemoApp = () => {
//   const [currentPrice, setCurrentPrice] = useState(45230.50);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Simulate real-time price updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentPrice(prev => {
//         const change = (Math.random() - 0.5) * 100;
//         return prev + change;
//       });
//     }, 2000);

//     return () => clearInterval(interval);
//   }, []);

//   // Generate sample candlestick data
//   const generateSampleData = () => {
//     const candles = [];
//     const now = Date.now();
//     let price = 45000;

//     for (let i = 100; i >= 0; i--) {
//       const time = now - i * 3600000; // 1 hour intervals
//       const open = price;
//       const change = (Math.random() - 0.5) * 500;
//       const close = open + change;
//       const high = Math.max(open, close) + Math.random() * 200;
//       const low = Math.min(open, close) - Math.random() * 200;
//       const volume = Math.floor(1000000 + Math.random() * 5000000);

//       candles.push({
//         x: time,
//         o: open,
//         h: high,
//         l: low,
//         c: close,
//         v: volume
//       });

//       price = close;
//     }

//     return {
//       candles,
//       indicators: {
//         rsi: 45 + Math.random() * 30,
//         macd: {
//           macd: (Math.random() - 0.5) * 100,
//           signal: (Math.random() - 0.5) * 80
//         },
//         movingAverages: {
//           sma20: price * (0.98 + Math.random() * 0.04),
//           sma50: price * (0.96 + Math.random() * 0.08)
//         },
//         bollingerBands: {
//           upper: price * 1.05,
//           middle: price,
//           lower: price * 0.95
//         }
//       }
//     };
//   };

//   const sampleData = generateSampleData();

//   return (
//     <div style={{ 
//       padding: '20px',
//       backgroundColor: '#F3F4F6',
//       minHeight: '100vh'
//     }}>
//       <div style={{
//         maxWidth: '1400px',
//         margin: '0 auto'
//       }}>
//         <CandlestickChart
//           data={sampleData}
//           symbol="BTC/USD"
//           timeframe="1h"
//           isRefreshing={isRefreshing}
//           currentPrice={currentPrice}
//         />
//       </div>
//     </div>
//   );
// };

// export default CandlestickChart;
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Decimation,
  SubTitle
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Chart } from 'react-chartjs-2';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Decimation,
  SubTitle,
  CandlestickController,
  CandlestickElement
);

// Helper function for time unit
const getTimeUnit = (tf) => {
  const unitMap = {
    '1m': 'minute',
    '5m': 'minute',
    '15m': 'minute',
    '30m': 'minute',
    '1h': 'hour',
    '4h': 'hour',
    '1d': 'day',
    '1w': 'week',
    '1M': 'month',
    '24h': 'hour'
  };
  return unitMap[tf] || 'hour';
};

// Helper functions for calculations - MOVED BEFORE COMPONENT
const calculateSMA = (data, period) => {
  if (!data || data.length < period) return new Array(data?.length || 0).fill(null);
  
  const sma = new Array(data.length).fill(null);
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma[i] = sum / period;
  }
  return sma;
};

const calculateBollingerBands = (data, period, multiplier) => {
  if (!data || data.length < period) {
    return {
      upper: new Array(data?.length || 0).fill(null),
      lower: new Array(data?.length || 0).fill(null),
      middle: new Array(data?.length || 0).fill(null)
    };
  }
  
  const upper = new Array(data.length).fill(null);
  const lower = new Array(data.length).fill(null);
  const middle = new Array(data.length).fill(null);
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    middle[i] = mean;
    upper[i] = mean + (multiplier * stdDev);
    lower[i] = mean - (multiplier * stdDev);
  }
  
  return { upper, lower, middle };
};

// CSS styles for the component
const styles = {
  container: {
    height: '600px',
    position: 'relative',
    backgroundColor: '#0a1929',
    borderRadius: '12px',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  controlPanel: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  controlButton: {
    backgroundColor: 'rgba(26, 35, 53, 0.9)',
    border: '1px solid rgba(64, 150, 255, 0.3)',
    color: '#e0e0e0',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backdropFilter: 'blur(10px)',
    minWidth: '80px'
  },
  timeControl: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    zIndex: 100,
    backgroundColor: 'rgba(26, 35, 53, 0.9)',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(64, 150, 255, 0.3)',
    backdropFilter: 'blur(10px)'
  },
  timeButton: {
    backgroundColor: 'rgba(64, 150, 255, 0.1)',
    border: '1px solid rgba(64, 150, 255, 0.3)',
    color: '#e0e0e0',
    padding: '4px 8px',
    margin: '2px',
    borderRadius: '4px',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  infoPanel: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    zIndex: 100,
    backgroundColor: 'rgba(26, 35, 53, 0.9)',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid rgba(64, 150, 255, 0.3)',
    minWidth: '280px',
    backdropFilter: 'blur(10px)'
  },
  priceChange: (change) => ({
    color: change >= 0 ? '#00c853' : '#ff5252',
    fontWeight: '600',
    fontSize: '24px'
  }),
  legendPanel: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    zIndex: 100,
    backgroundColor: 'rgba(26, 35, 53, 0.9)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(64, 150, 255, 0.3)',
    fontSize: '11px',
    backdropFilter: 'blur(10px)'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 25, 41, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    borderRadius: '12px'
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '12px',
    padding: '2px',
    background: 'linear-gradient(45deg, #4096ff, #6f42c1, #4096ff)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none'
  }
};

const CandlestickChart = ({ 
  data, 
  symbol, 
  timeframe, 
  isRefreshing = false, 
  currentPrice,
  stockPrices = {}
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(null);
  const [highlightedPoint, setHighlightedPoint] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [realTimeData, setRealTimeData] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showIndicators, setShowIndicators] = useState(true);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });
  const [chartLoaded, setChartLoaded] = useState(false);

  // Get stock change data
  const stockData = stockPrices[symbol] || {};

  // Get the most recent data point from chart data
  const getLatestDataPoint = useCallback(() => {
    if (!data?.candles || data.candles.length === 0) return null;
    
    const sortedCandles = [...data.candles].sort((a, b) => b.x - a.x);
    return sortedCandles[0];
  }, [data?.candles]);

  // Update real-time data
  useEffect(() => {
    if (currentPrice !== undefined && currentPrice !== null) {
      const now = new Date();
      const latestChartPoint = getLatestDataPoint();
      
      const realTimeCandle = {
        x: now.getTime(),
        o: currentPrice,
        h: Math.max(currentPrice, latestChartPoint?.h || currentPrice),
        l: Math.min(currentPrice, latestChartPoint?.l || currentPrice),
        c: currentPrice,
        v: latestChartPoint?.v || Math.floor(1000000 + Math.random() * 5000000),
        isRealTime: true
      };
      
      setRealTimeData(realTimeCandle);
      setCurrentValue(currentPrice);
      setHighlightedPoint({
        x: now.getTime(),
        y: currentPrice,
        price: currentPrice,
        time: now
      });
      setLastUpdateTime(now);
      
      // Calculate price change
      if (latestChartPoint) {
        const change = currentPrice - latestChartPoint.c;
        const percent = (change / latestChartPoint.c) * 100;
        setPriceChange({ value: change, percent });
      }
    } else if (data?.candles && data.candles.length > 0) {
      const latest = getLatestDataPoint();
      if (latest) {
        setCurrentValue(latest.c);
        setHighlightedPoint({
          x: new Date(latest.x).getTime(),
          y: latest.c,
          price: latest.c,
          time: new Date(latest.x)
        });
        setLastUpdateTime(new Date(latest.x));
      }
    }
  }, [currentPrice, data, symbol, getLatestDataPoint]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data?.candles || data.candles.length === 0) {
      return { 
        datasets: [],
        labels: []
      };
    }

    const candles = data.candles;
    const indicators = data.indicators;
    
    const latestChartCandle = getLatestDataPoint();
    
    // Combine data
    let allCandles = [...candles];
    if (realTimeData && (!latestChartCandle || realTimeData.x > latestChartCandle.x)) {
      allCandles = [...candles, realTimeData];
    }
    
    // Sort by time
    const sortedCandles = allCandles.sort((a, b) => a.x - b.x);
    
    // Create candlestick data with proper structure
    const candlestickData = sortedCandles.map(candle => ({
      x: new Date(candle.x).getTime(),
      o: candle.o || 0,
      h: candle.h || 0,
      l: candle.l || 0,
      c: candle.c || 0,
      v: candle.v || 0,
      isCurrent: realTimeData ? candle.x === realTimeData.x : 
                 (latestChartCandle && candle.x === latestChartCandle.x),
      isRealTime: candle.isRealTime || false
    }));

    const latestPrice = currentValue || (latestChartCandle?.c || 0);
    
    // Calculate moving averages
    const prices = candlestickData.map(d => d.c);
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);
    
    // Bollinger Bands
    const bb = calculateBollingerBands(prices, 20, 2);

    // Prepare datasets
    const datasets = [];

    // 1. Candlestick data
    datasets.push({
      label: `${symbol} Price`,
      data: candlestickData,
      type: 'candlestick',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      color: {
        up: '#00c853',
        down: '#ff5252',
        unchanged: '#78909c'
      },
      yAxisID: 'y'
    });

    // 2. Volume bars (conditionally shown) - FIXED: Proper data structure
    if (showVolume) {
      datasets.push({
        label: 'Volume',
        data: candlestickData.map(d => ({ 
          x: d.x, 
          y: d.v 
        })),
        type: 'bar',
        backgroundColor: candlestickData.map(d => 
          d.c >= d.o ? 'rgba(0, 200, 83, 0.3)' : 'rgba(255, 82, 82, 0.3)'
        ),
        borderColor: candlestickData.map(d => 
          d.c >= d.o ? 'rgba(0, 200, 83, 0.6)' : 'rgba(255, 82, 82, 0.6)'
        ),
        borderWidth: 1,
        yAxisID: 'y1'
      });
    }

    // 3. Add indicators if enabled
    if (showIndicators) {
      // SMA 20
      datasets.push({
        label: 'SMA 20',
        data: candlestickData.map((d, i) => ({ 
          x: d.x, 
          y: sma20[i] 
        })),
        type: 'line',
        borderColor: 'rgba(255, 152, 0, 0.8)',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        tension: 0.1
      });

      // SMA 50
      datasets.push({
        label: 'SMA 50',
        data: candlestickData.map((d, i) => ({ 
          x: d.x, 
          y: sma50[i] 
        })),
        type: 'line',
        borderColor: 'rgba(156, 39, 176, 0.8)',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        tension: 0.1
      });

      // Bollinger Bands Upper
      datasets.push({
        label: 'BB Upper',
        data: candlestickData.map((d, i) => ({ 
          x: d.x, 
          y: bb.upper[i] 
        })),
        type: 'line',
        borderColor: 'rgba(33, 150, 243, 0.6)',
        borderWidth: 1,
        pointRadius: 0,
        borderDash: [5, 5],
        fill: false
      });

      // Bollinger Bands Lower
      datasets.push({
        label: 'BB Lower',
        data: candlestickData.map((d, i) => ({ 
          x: d.x, 
          y: bb.lower[i] 
        })),
        type: 'line',
        borderColor: 'rgba(33, 150, 243, 0.6)',
        borderWidth: 1,
        pointRadius: 0,
        borderDash: [5, 5],
        fill: false
      });
    }

    // 4. Add real-time marker
    if (realTimeData) {
      datasets.push({
        label: 'Live Price',
        data: [{ x: realTimeData.x, y: realTimeData.c }],
        type: 'line',
        borderColor: '#ff9800',
        borderWidth: 2,
        pointBackgroundColor: '#ff9800',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
        fill: false,
        tension: 0,
        pointStyle: 'rectRot'
      });
    }

    return { 
      datasets,
      labels: candlestickData.map(d => new Date(d.x).toISOString())
    };
  }, [data, symbol, realTimeData, currentValue, showVolume, showIndicators, getLatestDataPoint]);

  // Chart options
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#b0bec5',
          usePointStyle: true,
          boxWidth: 8,
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          padding: 15
        }
      },
      title: {
        display: true,
        text: `${symbol} • ${timeframe} • ${new Date().toLocaleDateString()}`,
        color: '#e0e0e0',
        font: {
          size: 14,
          weight: '600',
          family: "'Inter', sans-serif"
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 35, 53, 0.95)',
        titleColor: '#e0e0e0',
        bodyColor: '#e0e0e0',
        borderColor: 'rgba(64, 150, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          },
          label: (context) => {
            const dataset = context.dataset;
            const dataPoint = dataset.data[context.dataIndex];
            
            if (!dataPoint) return '';
            
            if (dataset.type === 'candlestick') {
              return [
                `Open: $${(dataPoint.o || 0).toFixed(2)}`,
                `High: $${(dataPoint.h || 0).toFixed(2)}`,
                `Low: $${(dataPoint.l || 0).toFixed(2)}`,
                `Close: $${(dataPoint.c || 0).toFixed(2)}`,
                `Volume: ${(dataPoint.v || 0).toLocaleString()}`
              ];
            } else if (dataset.type === 'bar') {
              return `Volume: ${(dataPoint.y || 0).toLocaleString()}`;
            }
            return `${dataset.label}: $${(dataPoint.y || 0).toFixed(2)}`;
          }
        }
      },
      decimation: {
        enabled: true,
        algorithm: 'lttb',
        samples: 100
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: getTimeUnit(timeframe),
          displayFormats: {
            minute: 'HH:mm',
            hour: 'MMM dd HH:mm',
            day: 'MMM dd',
            week: 'MMM dd',
            month: 'MMM yyyy'
          },
          tooltipFormat: 'MMM dd, yyyy HH:mm'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#b0bec5',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          maxTicksLimit: 10,
          maxRotation: 0
        },
        border: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#b0bec5',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          callback: (value) => `$${value.toFixed(2)}`,
          padding: 8
        },
        border: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        title: {
          display: true,
          text: 'Price ($)',
          color: '#b0bec5',
          font: {
            size: 12,
            weight: '600',
            family: "'Inter', sans-serif"
          }
        }
      },
      y1: {
        position: 'left',
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          color: '#b0bec5',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          callback: (value) => `${(value / 1000000).toFixed(1)}M`
        },
        title: {
          display: true,
          text: 'Volume',
          color: '#b0bec5',
          font: {
            size: 12,
            weight: '600',
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4
      },
      line: {
        tension: 0
      }
    },
    animation: {
      duration: 0
    }
  }), [symbol, timeframe]);

  // Chart control functions
  const handleResetZoom = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.reset();
      setIsZoomed(false);
    }
  };

  const handleZoomIn = () => {
    if (chartInstanceRef.current && data?.candles?.length > 0) {
      const chart = chartInstanceRef.current;
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      
      if (!xScale || !yScale) return;
      
      // Get current ranges
      const currentXRange = xScale.max - xScale.min;
      const currentYRange = yScale.max - yScale.min;
      
      // Zoom in by 20%
      const newXRange = currentXRange * 0.8;
      const newYRange = currentYRange * 0.8;
      
      const xCenter = (xScale.max + xScale.min) / 2;
      const yCenter = (yScale.max + yScale.min) / 2;
      
      chart.options.scales.x.min = xCenter - newXRange / 2;
      chart.options.scales.x.max = xCenter + newXRange / 2;
      chart.options.scales.y.min = yCenter - newYRange / 2;
      chart.options.scales.y.max = yCenter + newYRange / 2;
      chart.update();
      setIsZoomed(true);
    }
  };

  const handleZoomOut = () => {
    if (chartInstanceRef.current && data?.candles?.length > 0) {
      const chart = chartInstanceRef.current;
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      
      if (!xScale || !yScale) return;
      
      // Get current ranges
      const currentXRange = xScale.max - xScale.min;
      const currentYRange = yScale.max - yScale.min;
      
      // Zoom out by 20%
      const newXRange = currentXRange * 1.2;
      const newYRange = currentYRange * 1.2;
      
      const xCenter = (xScale.max + xScale.min) / 2;
      const yCenter = (yScale.max + yScale.min) / 2;
      
      chart.options.scales.x.min = Math.max(0, xCenter - newXRange / 2);
      chart.options.scales.x.max = xCenter + newXRange / 2;
      chart.options.scales.y.min = Math.max(0, yCenter - newYRange / 2);
      chart.options.scales.y.max = yCenter + newYRange / 2;
      chart.update();
      setIsZoomed(true);
    }
  };

  const handleFitToData = () => {
    if (chartInstanceRef.current && data?.candles?.length > 0) {
      const chart = chartInstanceRef.current;
      const candles = data.candles;
      
      if (candles.length === 0) return;
      
      // Calculate price range
      const prices = candles.map(c => c.c || 0).filter(p => !isNaN(p));
      if (prices.length === 0) return;
      
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      // Calculate time range
      const times = candles.map(c => new Date(c.x || Date.now()).getTime());
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      
      // Add padding
      const pricePadding = (maxPrice - minPrice) * 0.1;
      const timePadding = (maxTime - minTime) * 0.05;
      
      chart.options.scales.x.min = minTime - timePadding;
      chart.options.scales.x.max = maxTime + timePadding;
      chart.options.scales.y.min = Math.max(0, minPrice - pricePadding);
      chart.options.scales.y.max = maxPrice + pricePadding;
      chart.update();
      setIsZoomed(false);
    }
  };

  // Pan functions
  const handlePanLeft = () => {
    if (chartInstanceRef.current) {
      const chart = chartInstanceRef.current;
      const xScale = chart.scales.x;
      
      if (!xScale) return;
      
      const xRange = xScale.max - xScale.min;
      const panAmount = xRange * 0.2;
      
      chart.options.scales.x.min -= panAmount;
      chart.options.scales.x.max -= panAmount;
      chart.update();
      setIsZoomed(true);
    }
  };

  const handlePanRight = () => {
    if (chartInstanceRef.current) {
      const chart = chartInstanceRef.current;
      const xScale = chart.scales.x;
      
      if (!xScale) return;
      
      const xRange = xScale.max - xScale.min;
      const panAmount = xRange * 0.2;
      
      chart.options.scales.x.min += panAmount;
      chart.options.scales.x.max += panAmount;
      chart.update();
      setIsZoomed(true);
    }
  };

  // Timeframe quick buttons
  const timeframes = [
    { label: '1D', value: '24h' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1y' }
  ];

  // Chart load handler
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Initial fit to data
  useEffect(() => {
    if (chartLoaded && data?.candles?.length > 0) {
      // Fit to data after a short delay to ensure chart is rendered
      setTimeout(() => {
        handleFitToData();
      }, 100);
    }
  }, [chartLoaded, data]);

  // Handle chart instance reference
  const handleChartRef = useCallback((chartInstance) => {
    if (chartInstance) {
      chartInstanceRef.current = chartInstance;
    }
  }, []);

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Gradient border effect */}
      <div style={styles.gradientBorder} />
      
      {/* Loading overlay */}
      {!chartLoaded && (
        <div style={styles.loadingOverlay}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#b0bec5', marginTop: '20px', fontSize: '14px' }}>
            Loading market data for {symbol}...
          </p>
        </div>
      )}

      {/* Control panel */}
      <div style={styles.controlPanel}>
        <button 
          style={{...styles.controlButton, ...(isZoomed ? { backgroundColor: 'rgba(64, 150, 255, 0.2)' } : {})}}
          onClick={handleResetZoom}
          title="Reset Zoom"
        >
          <span style={{ fontSize: '16px' }}>⟲</span> Reset
        </button>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <button 
            style={styles.controlButton}
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <span style={{ fontSize: '16px' }}>⊕</span> In
          </button>
          
          <button 
            style={styles.controlButton}
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <span style={{ fontSize: '16px' }}>⊖</span> Out
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <button 
            style={styles.controlButton}
            onClick={handlePanLeft}
            title="Pan Left"
          >
            <span style={{ fontSize: '16px' }}>←</span>
          </button>
          
          <button 
            style={styles.controlButton}
            onClick={handlePanRight}
            title="Pan Right"
          >
            <span style={{ fontSize: '16px' }}>→</span>
          </button>
        </div>
        
        <button 
          style={{...styles.controlButton, ...(showVolume ? { backgroundColor: 'rgba(64, 150, 255, 0.2)' } : {})}}
          onClick={() => setShowVolume(!showVolume)}
          title="Toggle Volume"
        >
          <span style={{ fontSize: '16px' }}>📊</span> Volume
        </button>
        
        <button 
          style={{...styles.controlButton, ...(showIndicators ? { backgroundColor: 'rgba(64, 150, 255, 0.2)' } : {})}}
          onClick={() => setShowIndicators(!showIndicators)}
          title="Toggle Indicators"
        >
          <span style={{ fontSize: '16px' }}>📈</span> Indicators
        </button>
        
        <button 
          style={styles.controlButton}
          onClick={handleFitToData}
          title="Fit to Data"
        >
          <span style={{ fontSize: '16px' }}>⇆</span> Fit Data
        </button>
      </div>

      {/* Time control */}
      <div style={styles.timeControl}>
        <div style={{ color: '#b0bec5', fontSize: '11px', marginBottom: '6px', fontWeight: '600' }}>
          TIME FRAME
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {timeframes.map(tf => (
            <button
              key={tf.value}
              style={{
                ...styles.timeButton,
                ...(timeframe === tf.value ? { 
                  backgroundColor: 'rgba(64, 150, 255, 0.3)',
                  borderColor: '#4096ff',
                  color: '#fff'
                } : {})
              }}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main chart */}
      <div style={{ height: '100%', padding: '20px 20px 60px 20px' }}>
        {chartLoaded && (
          <Chart
            ref={handleChartRef}
            type='candlestick'
            data={chartData}
            options={options}
            key={`${symbol}-${timeframe}-${showVolume}-${showIndicators}`}
          />
        )}
      </div>

      {/* Info panel */}
      {currentValue !== null && highlightedPoint && (
        <div style={styles.infoPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                {symbol}
              </div>
              <div style={{ fontSize: '12px', color: '#b0bec5' }}>
                {realTimeData ? 'Live Trading' : 'Market Data'}
              </div>
            </div>
            <div style={{
              padding: '4px 8px',
              backgroundColor: realTimeData ? 'rgba(255, 152, 0, 0.2)' : 'rgba(64, 150, 255, 0.2)',
              border: `1px solid ${realTimeData ? '#ff9800' : '#4096ff'}`,
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '600',
              color: realTimeData ? '#ff9800' : '#4096ff',
              textTransform: 'uppercase'
            }}>
              {realTimeData ? 'Live' : 'Historical'}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
              ${(currentValue || 0).toFixed(2)}
            </div>
            <div style={styles.priceChange(priceChange.value)}>
              {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(2)} 
              ({priceChange.value >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '8px',
            fontSize: '12px',
            color: '#b0bec5'
          }}>
            <div>
              <div style={{ opacity: 0.7 }}>Open</div>
              <div style={{ color: '#fff', fontWeight: '600' }}>
                ${(data?.summary?.open || 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.7 }}>High</div>
              <div style={{ color: '#00c853', fontWeight: '600' }}>
                ${(data?.summary?.high || 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.7 }}>Low</div>
              <div style={{ color: '#ff5252', fontWeight: '600' }}>
                ${(data?.summary?.low || 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.7 }}>Volume</div>
              <div style={{ color: '#fff', fontWeight: '600' }}>
                {(data?.summary?.volume || 0).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '12px', 
            paddingTop: '12px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '10px',
            color: '#78909c',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Last update: {lastUpdateTime.toLocaleTimeString()}</span>
            {isRefreshing && (
              <span style={{ color: '#ff9800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className="spinner-border spinner-border-sm" role="status" style={{ width: '0.6rem', height: '0.6rem' }}>
                  <span className="visually-hidden">Updating...</span>
                </div>
                Updating...
              </span>
            )}
          </div>
        </div>
      )}

      {/* Legend panel */}
      <div style={styles.legendPanel}>
        <div style={{ fontWeight: '600', marginBottom: '6px', color: '#e0e0e0' }}>LEGEND</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '4px', backgroundColor: '#00c853' }}></div>
            <span style={{ color: '#b0bec5' }}>Bullish</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '4px', backgroundColor: '#ff5252' }}></div>
            <span style={{ color: '#b0bec5' }}>Bearish</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '2px', backgroundColor: '#ff9800', border: '1px solid #fff' }}></div>
            <span style={{ color: '#b0bec5' }}>Live Price</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '2px', backgroundColor: '#ff9800', borderDash: '5 5' }}></div>
            <span style={{ color: '#b0bec5' }}>SMA 20</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '2px', backgroundColor: '#9c27b0', borderDash: '5 5' }}></div>
            <span style={{ color: '#b0bec5' }}>SMA 50</span>
          </div>
        </div>
        <div style={{ marginTop: '8px', fontSize: '9px', color: '#78909c', opacity: 0.7 }}>
          Use buttons to zoom & pan
        </div>
      </div>

      {/* Chart tips overlay */}
      {chartLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(26, 35, 53, 0.8)',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '10px',
          color: '#b0bec5',
          zIndex: 50,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(64, 150, 255, 0.2)'
        }}>
          <span>Use control buttons to zoom, pan, and adjust the chart</span>
        </div>
      )}
    </div>
  );
};

export default CandlestickChart;
