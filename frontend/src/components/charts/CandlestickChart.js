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
// // //   Filler,
// // //   Decimation,
// // //   SubTitle
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
// // //   Decimation,
// // //   SubTitle,
// // //   CandlestickController,
// // //   CandlestickElement
// // // );

// // // // Helper function for time unit
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

// // // // Helper functions for calculations - MOVED BEFORE COMPONENT
// // // const calculateSMA = (data, period) => {
// // //   if (!data || data.length < period) return new Array(data?.length || 0).fill(null);
  
// // //   const sma = new Array(data.length).fill(null);
// // //   for (let i = period - 1; i < data.length; i++) {
// // //     const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
// // //     sma[i] = sum / period;
// // //   }
// // //   return sma;
// // // };

// // // const calculateBollingerBands = (data, period, multiplier) => {
// // //   if (!data || data.length < period) {
// // //     return {
// // //       upper: new Array(data?.length || 0).fill(null),
// // //       lower: new Array(data?.length || 0).fill(null),
// // //       middle: new Array(data?.length || 0).fill(null)
// // //     };
// // //   }
  
// // //   const upper = new Array(data.length).fill(null);
// // //   const lower = new Array(data.length).fill(null);
// // //   const middle = new Array(data.length).fill(null);
  
// // //   for (let i = period - 1; i < data.length; i++) {
// // //     const slice = data.slice(i - period + 1, i + 1);
// // //     const mean = slice.reduce((a, b) => a + b, 0) / period;
// // //     const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
// // //     const stdDev = Math.sqrt(variance);
    
// // //     middle[i] = mean;
// // //     upper[i] = mean + (multiplier * stdDev);
// // //     lower[i] = mean - (multiplier * stdDev);
// // //   }
  
// // //   return { upper, lower, middle };
// // // };

// // // // CSS styles for the component
// // // const styles = {
// // //   container: {
// // //     height: '600px',
// // //     position: 'relative',
// // //     backgroundColor: '#0a1929',
// // //     borderRadius: '12px',
// // //     overflow: 'hidden',
// // //     fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
// // //   },
// // //   controlPanel: {
// // //     position: 'absolute',
// // //     top: '15px',
// // //     right: '15px',
// // //     zIndex: 100,
// // //     display: 'flex',
// // //     flexDirection: 'column',
// // //     gap: '10px'
// // //   },
// // //   controlButton: {
// // //     backgroundColor: 'rgba(26, 35, 53, 0.9)',
// // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // //     color: '#e0e0e0',
// // //     padding: '8px 12px',
// // //     borderRadius: '6px',
// // //     fontSize: '12px',
// // //     fontWeight: '500',
// // //     cursor: 'pointer',
// // //     transition: 'all 0.2s ease',
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //     gap: '6px',
// // //     backdropFilter: 'blur(10px)',
// // //     minWidth: '80px'
// // //   },
// // //   timeControl: {
// // //     position: 'absolute',
// // //     top: '15px',
// // //     left: '15px',
// // //     zIndex: 100,
// // //     backgroundColor: 'rgba(26, 35, 53, 0.9)',
// // //     padding: '8px',
// // //     borderRadius: '6px',
// // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // //     backdropFilter: 'blur(10px)'
// // //   },
// // //   timeButton: {
// // //     backgroundColor: 'rgba(64, 150, 255, 0.1)',
// // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // //     color: '#e0e0e0',
// // //     padding: '4px 8px',
// // //     margin: '2px',
// // //     borderRadius: '4px',
// // //     fontSize: '11px',
// // //     cursor: 'pointer',
// // //     transition: 'all 0.2s ease'
// // //   },
// // //   infoPanel: {
// // //     position: 'absolute',
// // //     bottom: '20px',
// // //     left: '20px',
// // //     zIndex: 100,
// // //     backgroundColor: 'rgba(26, 35, 53, 0.9)',
// // //     padding: '15px',
// // //     borderRadius: '8px',
// // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // //     minWidth: '280px',
// // //     backdropFilter: 'blur(10px)'
// // //   },
// // //   priceChange: (change) => ({
// // //     color: change >= 0 ? '#00c853' : '#ff5252',
// // //     fontWeight: '600',
// // //     fontSize: '24px'
// // //   }),
// // //   legendPanel: {
// // //     position: 'absolute',
// // //     bottom: '20px',
// // //     right: '20px',
// // //     zIndex: 100,
// // //     backgroundColor: 'rgba(26, 35, 53, 0.9)',
// // //     padding: '12px',
// // //     borderRadius: '8px',
// // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // //     fontSize: '11px',
// // //     backdropFilter: 'blur(10px)'
// // //   },
// // //   loadingOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     backgroundColor: 'rgba(10, 25, 41, 0.9)',
// // //     display: 'flex',
// // //     flexDirection: 'column',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     zIndex: 1000,
// // //     borderRadius: '12px'
// // //   },
// // //   gradientBorder: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     borderRadius: '12px',
// // //     padding: '2px',
// // //     background: 'linear-gradient(45deg, #4096ff, #6f42c1, #4096ff)',
// // //     WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
// // //     WebkitMaskComposite: 'xor',
// // //     maskComposite: 'exclude',
// // //     pointerEvents: 'none'
// // //   }
// // // };

// // // const CandlestickChart = ({ 
// // //   data, 
// // //   symbol, 
// // //   timeframe, 
// // //   isRefreshing = false, 
// // //   currentPrice,
// // //   stockPrices = {}
// // // }) => {
// // //   const chartRef = useRef(null);
// // //   const chartInstanceRef = useRef(null);
// // //   const [currentValue, setCurrentValue] = useState(null);
// // //   const [highlightedPoint, setHighlightedPoint] = useState(null);
// // //   const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
// // //   const [realTimeData, setRealTimeData] = useState(null);
// // //   const [isZoomed, setIsZoomed] = useState(false);
// // //   const [showVolume, setShowVolume] = useState(false);
// // //   const [showIndicators, setShowIndicators] = useState(true);
// // //   const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });
// // //   const [chartLoaded, setChartLoaded] = useState(false);

// // //   // Get stock change data
// // //   const stockData = stockPrices[symbol] || {};

// // //   // Get the most recent data point from chart data
// // //   const getLatestDataPoint = useCallback(() => {
// // //     if (!data?.candles || data.candles.length === 0) return null;
    
// // //     const sortedCandles = [...data.candles].sort((a, b) => b.x - a.x);
// // //     return sortedCandles[0];
// // //   }, [data?.candles]);

// // //   // Update real-time data
// // //   useEffect(() => {
// // //     if (currentPrice !== undefined && currentPrice !== null) {
// // //       const now = new Date();
// // //       const latestChartPoint = getLatestDataPoint();
      
// // //       const realTimeCandle = {
// // //         x: now.getTime(),
// // //         o: currentPrice,
// // //         h: Math.max(currentPrice, latestChartPoint?.h || currentPrice),
// // //         l: Math.min(currentPrice, latestChartPoint?.l || currentPrice),
// // //         c: currentPrice,
// // //         v: latestChartPoint?.v || Math.floor(1000000 + Math.random() * 5000000),
// // //         isRealTime: true
// // //       };
      
// // //       setRealTimeData(realTimeCandle);
// // //       setCurrentValue(currentPrice);
// // //       setHighlightedPoint({
// // //         x: now.getTime(),
// // //         y: currentPrice,
// // //         price: currentPrice,
// // //         time: now
// // //       });
// // //       setLastUpdateTime(now);
      
// // //       // Calculate price change
// // //       if (latestChartPoint) {
// // //         const change = currentPrice - latestChartPoint.c;
// // //         const percent = (change / latestChartPoint.c) * 100;
// // //         setPriceChange({ value: change, percent });
// // //       }
// // //     } else if (data?.candles && data.candles.length > 0) {
// // //       const latest = getLatestDataPoint();
// // //       if (latest) {
// // //         setCurrentValue(latest.c);
// // //         setHighlightedPoint({
// // //           x: new Date(latest.x).getTime(),
// // //           y: latest.c,
// // //           price: latest.c,
// // //           time: new Date(latest.x)
// // //         });
// // //         setLastUpdateTime(new Date(latest.x));
// // //       }
// // //     }
// // //   }, [currentPrice, data, symbol, getLatestDataPoint]);

// // //   // Prepare chart data
// // //   const chartData = useMemo(() => {
// // //     if (!data?.candles || data.candles.length === 0) {
// // //       return { 
// // //         datasets: [],
// // //         labels: []
// // //       };
// // //     }

// // //     const candles = data.candles;
// // //     const indicators = data.indicators;
    
// // //     const latestChartCandle = getLatestDataPoint();
    
// // //     // Combine data
// // //     let allCandles = [...candles];
// // //     if (realTimeData && (!latestChartCandle || realTimeData.x > latestChartCandle.x)) {
// // //       allCandles = [...candles, realTimeData];
// // //     }
    
// // //     // Sort by time
// // //     const sortedCandles = allCandles.sort((a, b) => a.x - b.x);
    
// // //     // Create candlestick data with proper structure
// // //     const candlestickData = sortedCandles.map(candle => ({
// // //       x: new Date(candle.x).getTime(),
// // //       o: candle.o || 0,
// // //       h: candle.h || 0,
// // //       l: candle.l || 0,
// // //       c: candle.c || 0,
// // //       v: candle.v || 0,
// // //       isCurrent: realTimeData ? candle.x === realTimeData.x : 
// // //                  (latestChartCandle && candle.x === latestChartCandle.x),
// // //       isRealTime: candle.isRealTime || false
// // //     }));

// // //     const latestPrice = currentValue || (latestChartCandle?.c || 0);
    
// // //     // Calculate moving averages
// // //     const prices = candlestickData.map(d => d.c);
// // //     const sma20 = calculateSMA(prices, 20);
// // //     const sma50 = calculateSMA(prices, 50);
    
// // //     // Bollinger Bands
// // //     const bb = calculateBollingerBands(prices, 20, 2);

// // //     // Prepare datasets
// // //     const datasets = [];

// // //     // 1. Candlestick data
// // //     datasets.push({
// // //       label: `${symbol} Price`,
// // //       data: candlestickData,
// // //       type: 'candlestick',
// // //       borderColor: 'rgba(255, 255, 255, 0.1)',
// // //       borderWidth: 1,
// // //       color: {
// // //         up: '#00c853',
// // //         down: '#ff5252',
// // //         unchanged: '#78909c'
// // //       },
// // //       yAxisID: 'y'
// // //     });

// // //     // 2. Volume bars (conditionally shown) - FIXED: Proper data structure
// // //     if (showVolume) {
// // //       datasets.push({
// // //         label: 'Volume',
// // //         data: candlestickData.map(d => ({ 
// // //           x: d.x, 
// // //           y: d.v 
// // //         })),
// // //         type: 'bar',
// // //         backgroundColor: candlestickData.map(d => 
// // //           d.c >= d.o ? 'rgba(0, 200, 83, 0.3)' : 'rgba(255, 82, 82, 0.3)'
// // //         ),
// // //         borderColor: candlestickData.map(d => 
// // //           d.c >= d.o ? 'rgba(0, 200, 83, 0.6)' : 'rgba(255, 82, 82, 0.6)'
// // //         ),
// // //         borderWidth: 1,
// // //         yAxisID: 'y1'
// // //       });
// // //     }

// // //     // 3. Add indicators if enabled
// // //     if (showIndicators) {
// // //       // SMA 20
// // //       datasets.push({
// // //         label: 'SMA 20',
// // //         data: candlestickData.map((d, i) => ({ 
// // //           x: d.x, 
// // //           y: sma20[i] 
// // //         })),
// // //         type: 'line',
// // //         borderColor: 'rgba(255, 152, 0, 0.8)',
// // //         borderWidth: 1.5,
// // //         pointRadius: 0,
// // //         fill: false,
// // //         tension: 0.1
// // //       });

// // //       // SMA 50
// // //       datasets.push({
// // //         label: 'SMA 50',
// // //         data: candlestickData.map((d, i) => ({ 
// // //           x: d.x, 
// // //           y: sma50[i] 
// // //         })),
// // //         type: 'line',
// // //         borderColor: 'rgba(156, 39, 176, 0.8)',
// // //         borderWidth: 1.5,
// // //         pointRadius: 0,
// // //         fill: false,
// // //         tension: 0.1
// // //       });

// // //       // Bollinger Bands Upper
// // //       datasets.push({
// // //         label: 'BB Upper',
// // //         data: candlestickData.map((d, i) => ({ 
// // //           x: d.x, 
// // //           y: bb.upper[i] 
// // //         })),
// // //         type: 'line',
// // //         borderColor: 'rgba(33, 150, 243, 0.6)',
// // //         borderWidth: 1,
// // //         pointRadius: 0,
// // //         borderDash: [5, 5],
// // //         fill: false
// // //       });

// // //       // Bollinger Bands Lower
// // //       datasets.push({
// // //         label: 'BB Lower',
// // //         data: candlestickData.map((d, i) => ({ 
// // //           x: d.x, 
// // //           y: bb.lower[i] 
// // //         })),
// // //         type: 'line',
// // //         borderColor: 'rgba(33, 150, 243, 0.6)',
// // //         borderWidth: 1,
// // //         pointRadius: 0,
// // //         borderDash: [5, 5],
// // //         fill: false
// // //       });
// // //     }

// // //     // 4. Add real-time marker
// // //     if (realTimeData) {
// // //       datasets.push({
// // //         label: 'Live Price',
// // //         data: [{ x: realTimeData.x, y: realTimeData.c }],
// // //         type: 'line',
// // //         borderColor: '#ff9800',
// // //         borderWidth: 2,
// // //         pointBackgroundColor: '#ff9800',
// // //         pointBorderColor: '#fff',
// // //         pointBorderWidth: 2,
// // //         pointRadius: 6,
// // //         pointHoverRadius: 10,
// // //         fill: false,
// // //         tension: 0,
// // //         pointStyle: 'rectRot'
// // //       });
// // //     }

// // //     return { 
// // //       datasets,
// // //       labels: candlestickData.map(d => new Date(d.x).toISOString())
// // //     };
// // //   }, [data, symbol, realTimeData, currentValue, showVolume, showIndicators, getLatestDataPoint]);

// // //   // Chart options
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
// // //           color: '#b0bec5',
// // //           usePointStyle: true,
// // //           boxWidth: 8,
// // //           font: {
// // //             size: 11,
// // //             family: "'Inter', sans-serif"
// // //           },
// // //           padding: 15
// // //         }
// // //       },
// // //       title: {
// // //         display: true,
// // //         text: `${symbol} • ${timeframe} • ${new Date().toLocaleDateString()}`,
// // //         color: '#e0e0e0',
// // //         font: {
// // //           size: 14,
// // //           weight: '600',
// // //           family: "'Inter', sans-serif"
// // //         },
// // //         padding: {
// // //           top: 10,
// // //           bottom: 20
// // //         }
// // //       },
// // //       tooltip: {
// // //         backgroundColor: 'rgba(26, 35, 53, 0.95)',
// // //         titleColor: '#e0e0e0',
// // //         bodyColor: '#e0e0e0',
// // //         borderColor: 'rgba(64, 150, 255, 0.3)',
// // //         borderWidth: 1,
// // //         cornerRadius: 6,
// // //         padding: 12,
// // //         displayColors: false,
// // //         callbacks: {
// // //           title: (context) => {
// // //             const date = new Date(context[0].parsed.x);
// // //             return date.toLocaleString('en-US', {
// // //               weekday: 'short',
// // //               month: 'short',
// // //               day: 'numeric',
// // //               hour: '2-digit',
// // //               minute: '2-digit'
// // //             });
// // //           },
// // //           label: (context) => {
// // //             const dataset = context.dataset;
// // //             const dataPoint = dataset.data[context.dataIndex];
            
// // //             if (!dataPoint) return '';
            
// // //             if (dataset.type === 'candlestick') {
// // //               return [
// // //                 `Open: $${(dataPoint.o || 0).toFixed(2)}`,
// // //                 `High: $${(dataPoint.h || 0).toFixed(2)}`,
// // //                 `Low: $${(dataPoint.l || 0).toFixed(2)}`,
// // //                 `Close: $${(dataPoint.c || 0).toFixed(2)}`,
// // //                 `Volume: ${(dataPoint.v || 0).toLocaleString()}`
// // //               ];
// // //             } else if (dataset.type === 'bar') {
// // //               return `Volume: ${(dataPoint.y || 0).toLocaleString()}`;
// // //             }
// // //             return `${dataset.label}: $${(dataPoint.y || 0).toFixed(2)}`;
// // //           }
// // //         }
// // //       },
// // //       decimation: {
// // //         enabled: true,
// // //         algorithm: 'lttb',
// // //         samples: 100
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
// // //           },
// // //           tooltipFormat: 'MMM dd, yyyy HH:mm'
// // //         },
// // //         grid: {
// // //           color: 'rgba(255, 255, 255, 0.05)',
// // //           drawBorder: false
// // //         },
// // //         ticks: {
// // //           color: '#b0bec5',
// // //           font: {
// // //             size: 11,
// // //             family: "'Inter', sans-serif"
// // //           },
// // //           maxTicksLimit: 10,
// // //           maxRotation: 0
// // //         },
// // //         border: {
// // //           color: 'rgba(255, 255, 255, 0.1)'
// // //         }
// // //       },
// // //       y: {
// // //         position: 'right',
// // //         grid: {
// // //           color: 'rgba(255, 255, 255, 0.05)',
// // //           drawBorder: false
// // //         },
// // //         ticks: {
// // //           color: '#b0bec5',
// // //           font: {
// // //             size: 11,
// // //             family: "'Inter', sans-serif"
// // //           },
// // //           callback: (value) => `$${value.toFixed(2)}`,
// // //           padding: 8
// // //         },
// // //         border: {
// // //           color: 'rgba(255, 255, 255, 0.1)'
// // //         },
// // //         title: {
// // //           display: true,
// // //           text: 'Price ($)',
// // //           color: '#b0bec5',
// // //           font: {
// // //             size: 12,
// // //             weight: '600',
// // //             family: "'Inter', sans-serif"
// // //           }
// // //         }
// // //       },
// // //       y1: {
// // //         position: 'left',
// // //         grid: {
// // //           drawOnChartArea: false
// // //         },
// // //         ticks: {
// // //           color: '#b0bec5',
// // //           font: {
// // //             size: 11,
// // //             family: "'Inter', sans-serif"
// // //           },
// // //           callback: (value) => `${(value / 1000000).toFixed(1)}M`
// // //         },
// // //         title: {
// // //           display: true,
// // //           text: 'Volume',
// // //           color: '#b0bec5',
// // //           font: {
// // //             size: 12,
// // //             weight: '600',
// // //             family: "'Inter', sans-serif"
// // //           }
// // //         }
// // //       }
// // //     },
// // //     elements: {
// // //       point: {
// // //         radius: 0,
// // //         hoverRadius: 4
// // //       },
// // //       line: {
// // //         tension: 0
// // //       }
// // //     },
// // //     animation: {
// // //       duration: 0
// // //     }
// // //   }), [symbol, timeframe]);

// // //   // Chart control functions
// // //   const handleResetZoom = () => {
// // //     if (chartInstanceRef.current) {
// // //       chartInstanceRef.current.reset();
// // //       setIsZoomed(false);
// // //     }
// // //   };

// // //   const handleZoomIn = () => {
// // //     if (chartInstanceRef.current && data?.candles?.length > 0) {
// // //       const chart = chartInstanceRef.current;
// // //       const xScale = chart.scales.x;
// // //       const yScale = chart.scales.y;
      
// // //       if (!xScale || !yScale) return;
      
// // //       // Get current ranges
// // //       const currentXRange = xScale.max - xScale.min;
// // //       const currentYRange = yScale.max - yScale.min;
      
// // //       // Zoom in by 20%
// // //       const newXRange = currentXRange * 0.8;
// // //       const newYRange = currentYRange * 0.8;
      
// // //       const xCenter = (xScale.max + xScale.min) / 2;
// // //       const yCenter = (yScale.max + yScale.min) / 2;
      
// // //       chart.options.scales.x.min = xCenter - newXRange / 2;
// // //       chart.options.scales.x.max = xCenter + newXRange / 2;
// // //       chart.options.scales.y.min = yCenter - newYRange / 2;
// // //       chart.options.scales.y.max = yCenter + newYRange / 2;
// // //       chart.update();
// // //       setIsZoomed(true);
// // //     }
// // //   };

// // //   const handleZoomOut = () => {
// // //     if (chartInstanceRef.current && data?.candles?.length > 0) {
// // //       const chart = chartInstanceRef.current;
// // //       const xScale = chart.scales.x;
// // //       const yScale = chart.scales.y;
      
// // //       if (!xScale || !yScale) return;
      
// // //       // Get current ranges
// // //       const currentXRange = xScale.max - xScale.min;
// // //       const currentYRange = yScale.max - yScale.min;
      
// // //       // Zoom out by 20%
// // //       const newXRange = currentXRange * 1.2;
// // //       const newYRange = currentYRange * 1.2;
      
// // //       const xCenter = (xScale.max + xScale.min) / 2;
// // //       const yCenter = (yScale.max + yScale.min) / 2;
      
// // //       chart.options.scales.x.min = Math.max(0, xCenter - newXRange / 2);
// // //       chart.options.scales.x.max = xCenter + newXRange / 2;
// // //       chart.options.scales.y.min = Math.max(0, yCenter - newYRange / 2);
// // //       chart.options.scales.y.max = yCenter + newYRange / 2;
// // //       chart.update();
// // //       setIsZoomed(true);
// // //     }
// // //   };

// // //   const handleFitToData = () => {
// // //     if (chartInstanceRef.current && data?.candles?.length > 0) {
// // //       const chart = chartInstanceRef.current;
// // //       const candles = data.candles;
      
// // //       if (candles.length === 0) return;
      
// // //       // Calculate price range
// // //       const prices = candles.map(c => c.c || 0).filter(p => !isNaN(p));
// // //       if (prices.length === 0) return;
      
// // //       const minPrice = Math.min(...prices);
// // //       const maxPrice = Math.max(...prices);
      
// // //       // Calculate time range
// // //       const times = candles.map(c => new Date(c.x || Date.now()).getTime());
// // //       const minTime = Math.min(...times);
// // //       const maxTime = Math.max(...times);
      
// // //       // Add padding
// // //       const pricePadding = (maxPrice - minPrice) * 0.1;
// // //       const timePadding = (maxTime - minTime) * 0.05;
      
// // //       chart.options.scales.x.min = minTime - timePadding;
// // //       chart.options.scales.x.max = maxTime + timePadding;
// // //       chart.options.scales.y.min = Math.max(0, minPrice - pricePadding);
// // //       chart.options.scales.y.max = maxPrice + pricePadding;
// // //       chart.update();
// // //       setIsZoomed(false);
// // //     }
// // //   };

// // //   // Pan functions
// // //   const handlePanLeft = () => {
// // //     if (chartInstanceRef.current) {
// // //       const chart = chartInstanceRef.current;
// // //       const xScale = chart.scales.x;
      
// // //       if (!xScale) return;
      
// // //       const xRange = xScale.max - xScale.min;
// // //       const panAmount = xRange * 0.2;
      
// // //       chart.options.scales.x.min -= panAmount;
// // //       chart.options.scales.x.max -= panAmount;
// // //       chart.update();
// // //       setIsZoomed(true);
// // //     }
// // //   };

// // //   const handlePanRight = () => {
// // //     if (chartInstanceRef.current) {
// // //       const chart = chartInstanceRef.current;
// // //       const xScale = chart.scales.x;
      
// // //       if (!xScale) return;
      
// // //       const xRange = xScale.max - xScale.min;
// // //       const panAmount = xRange * 0.2;
      
// // //       chart.options.scales.x.min += panAmount;
// // //       chart.options.scales.x.max += panAmount;
// // //       chart.update();
// // //       setIsZoomed(true);
// // //     }
// // //   };

// // //   // Timeframe quick buttons
// // //   const timeframes = [
// // //     { label: '1D', value: '24h' },
// // //     { label: '1W', value: '1w' },
// // //     { label: '1M', value: '1M' },
// // //     { label: '3M', value: '3M' },
// // //     { label: '1Y', value: '1y' }
// // //   ];

// // //   // Chart load handler
// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       setChartLoaded(true);
// // //     }, 500);

// // //     return () => clearTimeout(timer);
// // //   }, []);

// // //   // Initial fit to data
// // //   useEffect(() => {
// // //     if (chartLoaded && data?.candles?.length > 0) {
// // //       // Fit to data after a short delay to ensure chart is rendered
// // //       setTimeout(() => {
// // //         handleFitToData();
// // //       }, 100);
// // //     }
// // //   }, [chartLoaded, data]);

// // //   // Handle chart instance reference
// // //   const handleChartRef = useCallback((chartInstance) => {
// // //     if (chartInstance) {
// // //       chartInstanceRef.current = chartInstance;
// // //     }
// // //   }, []);

// // //   // Cleanup chart on unmount
// // //   useEffect(() => {
// // //     return () => {
// // //       if (chartInstanceRef.current) {
// // //         chartInstanceRef.current.destroy();
// // //         chartInstanceRef.current = null;
// // //       }
// // //     };
// // //   }, []);

// // //   return (
// // //     <div style={styles.container}>
// // //       {/* Gradient border effect */}
// // //       <div style={styles.gradientBorder} />
      
// // //       {/* Loading overlay */}
// // //       {!chartLoaded && (
// // //         <div style={styles.loadingOverlay}>
// // //           <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
// // //             <span className="visually-hidden">Loading...</span>
// // //           </div>
// // //           <p style={{ color: '#b0bec5', marginTop: '20px', fontSize: '14px' }}>
// // //             Loading market data for {symbol}...
// // //           </p>
// // //         </div>
// // //       )}

// // //       {/* Control panel */}
// // //       <div style={styles.controlPanel}>
// // //         <button 
// // //           style={{...styles.controlButton, ...(isZoomed ? { backgroundColor: 'rgba(64, 150, 255, 0.2)' } : {})}}
// // //           onClick={handleResetZoom}
// // //           title="Reset Zoom"
// // //         >
// // //           <span style={{ fontSize: '16px' }}>⟲</span> Reset
// // //         </button>
        
// // //         <div style={{ display: 'flex', gap: '5px' }}>
// // //           <button 
// // //             style={styles.controlButton}
// // //             onClick={handleZoomIn}
// // //             title="Zoom In"
// // //           >
// // //             <span style={{ fontSize: '16px' }}>⊕</span> In
// // //           </button>
          
// // //           <button 
// // //             style={styles.controlButton}
// // //             onClick={handleZoomOut}
// // //             title="Zoom Out"
// // //           >
// // //             <span style={{ fontSize: '16px' }}>⊖</span> Out
// // //           </button>
// // //         </div>
        
// // //         <div style={{ display: 'flex', gap: '5px' }}>
// // //           <button 
// // //             style={styles.controlButton}
// // //             onClick={handlePanLeft}
// // //             title="Pan Left"
// // //           >
// // //             <span style={{ fontSize: '16px' }}>←</span>
// // //           </button>
          
// // //           <button 
// // //             style={styles.controlButton}
// // //             onClick={handlePanRight}
// // //             title="Pan Right"
// // //           >
// // //             <span style={{ fontSize: '16px' }}>→</span>
// // //           </button>
// // //         </div>
        
// // //         <button 
// // //           style={{...styles.controlButton, ...(showVolume ? { backgroundColor: 'rgba(64, 150, 255, 0.2)' } : {})}}
// // //           onClick={() => setShowVolume(!showVolume)}
// // //           title="Toggle Volume"
// // //         >
// // //           <span style={{ fontSize: '16px' }}>📊</span> Volume
// // //         </button>
        
// // //         <button 
// // //           style={{...styles.controlButton, ...(showIndicators ? { backgroundColor: 'rgba(64, 150, 255, 0.2)' } : {})}}
// // //           onClick={() => setShowIndicators(!showIndicators)}
// // //           title="Toggle Indicators"
// // //         >
// // //           <span style={{ fontSize: '16px' }}>📈</span> Indicators
// // //         </button>
        
// // //         <button 
// // //           style={styles.controlButton}
// // //           onClick={handleFitToData}
// // //           title="Fit to Data"
// // //         >
// // //           <span style={{ fontSize: '16px' }}>⇆</span> Fit Data
// // //         </button>
// // //       </div>

// // //       {/* Time control */}
// // //       <div style={styles.timeControl}>
// // //         <div style={{ color: '#b0bec5', fontSize: '11px', marginBottom: '6px', fontWeight: '600' }}>
// // //           TIME FRAME
// // //         </div>
// // //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
// // //           {timeframes.map(tf => (
// // //             <button
// // //               key={tf.value}
// // //               style={{
// // //                 ...styles.timeButton,
// // //                 ...(timeframe === tf.value ? { 
// // //                   backgroundColor: 'rgba(64, 150, 255, 0.3)',
// // //                   borderColor: '#4096ff',
// // //                   color: '#fff'
// // //                 } : {})
// // //               }}
// // //             >
// // //               {tf.label}
// // //             </button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Main chart */}
// // //       <div style={{ height: '100%', padding: '20px 20px 60px 20px' }}>
// // //         {chartLoaded && (
// // //           <Chart
// // //             ref={handleChartRef}
// // //             type='candlestick'
// // //             data={chartData}
// // //             options={options}
// // //             key={`${symbol}-${timeframe}-${showVolume}-${showIndicators}`}
// // //           />
// // //         )}
// // //       </div>

// // //       {/* Info panel */}
// // //       {currentValue !== null && highlightedPoint && (
// // //         <div style={styles.infoPanel}>
// // //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
// // //             <div>
// // //               <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
// // //                 {symbol}
// // //               </div>
// // //               <div style={{ fontSize: '12px', color: '#b0bec5' }}>
// // //                 {realTimeData ? 'Live Trading' : 'Market Data'}
// // //               </div>
// // //             </div>
// // //             <div style={{
// // //               padding: '4px 8px',
// // //               backgroundColor: realTimeData ? 'rgba(255, 152, 0, 0.2)' : 'rgba(64, 150, 255, 0.2)',
// // //               border: `1px solid ${realTimeData ? '#ff9800' : '#4096ff'}`,
// // //               borderRadius: '4px',
// // //               fontSize: '10px',
// // //               fontWeight: '600',
// // //               color: realTimeData ? '#ff9800' : '#4096ff',
// // //               textTransform: 'uppercase'
// // //             }}>
// // //               {realTimeData ? 'Live' : 'Historical'}
// // //             </div>
// // //           </div>
          
// // //           <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
// // //             <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
// // //               ${(currentValue || 0).toFixed(2)}
// // //             </div>
// // //             <div style={styles.priceChange(priceChange.value)}>
// // //               {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(2)} 
// // //               ({priceChange.value >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
// // //             </div>
// // //           </div>
          
// // //           <div style={{ 
// // //             display: 'grid', 
// // //             gridTemplateColumns: 'repeat(2, 1fr)', 
// // //             gap: '8px',
// // //             fontSize: '12px',
// // //             color: '#b0bec5'
// // //           }}>
// // //             <div>
// // //               <div style={{ opacity: 0.7 }}>Open</div>
// // //               <div style={{ color: '#fff', fontWeight: '600' }}>
// // //                 ${(data?.summary?.open || 0).toFixed(2)}
// // //               </div>
// // //             </div>
// // //             <div>
// // //               <div style={{ opacity: 0.7 }}>High</div>
// // //               <div style={{ color: '#00c853', fontWeight: '600' }}>
// // //                 ${(data?.summary?.high || 0).toFixed(2)}
// // //               </div>
// // //             </div>
// // //             <div>
// // //               <div style={{ opacity: 0.7 }}>Low</div>
// // //               <div style={{ color: '#ff5252', fontWeight: '600' }}>
// // //                 ${(data?.summary?.low || 0).toFixed(2)}
// // //               </div>
// // //             </div>
// // //             <div>
// // //               <div style={{ opacity: 0.7 }}>Volume</div>
// // //               <div style={{ color: '#fff', fontWeight: '600' }}>
// // //                 {(data?.summary?.volume || 0).toLocaleString()}
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div style={{ 
// // //             marginTop: '12px', 
// // //             paddingTop: '12px', 
// // //             borderTop: '1px solid rgba(255, 255, 255, 0.1)',
// // //             fontSize: '10px',
// // //             color: '#78909c',
// // //             display: 'flex',
// // //             justifyContent: 'space-between'
// // //           }}>
// // //             <span>Last update: {lastUpdateTime.toLocaleTimeString()}</span>
// // //             {isRefreshing && (
// // //               <span style={{ color: '#ff9800', display: 'flex', alignItems: 'center', gap: '4px' }}>
// // //                 <div className="spinner-border spinner-border-sm" role="status" style={{ width: '0.6rem', height: '0.6rem' }}>
// // //                   <span className="visually-hidden">Updating...</span>
// // //                 </div>
// // //                 Updating...
// // //               </span>
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Legend panel */}
// // //       <div style={styles.legendPanel}>
// // //         <div style={{ fontWeight: '600', marginBottom: '6px', color: '#e0e0e0' }}>LEGEND</div>
// // //         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
// // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //             <div style={{ width: '12px', height: '4px', backgroundColor: '#00c853' }}></div>
// // //             <span style={{ color: '#b0bec5' }}>Bullish</span>
// // //           </div>
// // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //             <div style={{ width: '12px', height: '4px', backgroundColor: '#ff5252' }}></div>
// // //             <span style={{ color: '#b0bec5' }}>Bearish</span>
// // //           </div>
// // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //             <div style={{ width: '12px', height: '2px', backgroundColor: '#ff9800', border: '1px solid #fff' }}></div>
// // //             <span style={{ color: '#b0bec5' }}>Live Price</span>
// // //           </div>
// // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //             <div style={{ width: '12px', height: '2px', backgroundColor: '#ff9800', borderDash: '5 5' }}></div>
// // //             <span style={{ color: '#b0bec5' }}>SMA 20</span>
// // //           </div>
// // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //             <div style={{ width: '12px', height: '2px', backgroundColor: '#9c27b0', borderDash: '5 5' }}></div>
// // //             <span style={{ color: '#b0bec5' }}>SMA 50</span>
// // //           </div>
// // //         </div>
// // //         <div style={{ marginTop: '8px', fontSize: '9px', color: '#78909c', opacity: 0.7 }}>
// // //           Use buttons to zoom & pan
// // //         </div>
// // //       </div>

// // //       {/* Chart tips overlay */}
// // //       {chartLoaded && (
// // //         <div style={{
// // //           position: 'absolute',
// // //           bottom: '10px',
// // //           left: '50%',
// // //           transform: 'translateX(-50%)',
// // //           backgroundColor: 'rgba(26, 35, 53, 0.8)',
// // //           padding: '6px 12px',
// // //           borderRadius: '4px',
// // //           fontSize: '10px',
// // //           color: '#b0bec5',
// // //           zIndex: 50,
// // //           backdropFilter: 'blur(10px)',
// // //           border: '1px solid rgba(64, 150, 255, 0.2)'
// // //         }}>
// // //           <span>Use control buttons to zoom, pan, and adjust the chart</span>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default CandlestickChart;
// import React, { useRef, useMemo, useEffect } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   TimeScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Chart } from 'react-chartjs-2';
// import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
// import zoomPlugin from 'chartjs-plugin-zoom';
// import annotationPlugin from 'chartjs-plugin-annotation';
// import 'chartjs-adapter-date-fns';

// // Register all professional plugins
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   TimeScale,
//   Tooltip,
//   Legend,
//   CandlestickController,
//   CandlestickElement,
//   zoomPlugin,
//   annotationPlugin
// );

// const CandlestickChart = ({ data, symbol = "BTC/USDT", currentPrice }) => {
//   const chartRef = useRef(null);

//   // 1. Ensure data is formatted exactly as the financial controller expects
//   const formattedData = useMemo(() => {
//     if (!data?.candles) return [];
//     return data.candles.map(c => ({
//       x: Number(c.x), // Timestamp
//       o: Number(c.o), // Open
//       h: Number(c.h), // High
//       l: Number(c.l), // Low
//       c: Number(c.c), // Close
//     })).sort((a, b) => a.x - b.x);
//   }, [data]);

//   // 2. High-Performance Chart Configuration
//   const chartConfig = {
//     datasets: [
//       {
//         label: `${symbol} Live Price`,
//         data: formattedData,
//         borderColor: '#1e222d',
//         candlestick: {
//           color: {
//             up: '#26a69a',    // Professional Teal
//             down: '#ef5350',  // Professional Red
//             unchanged: '#787b86',
//           },
//           wick: {
//             color: {
//               up: '#26a69a',
//               down: '#ef5350',
//             }
//           }
//         },
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     animation: false, // Professional charts don't use "sliding" animations
//     layout: {
//       padding: { right: 50, bottom: 10 }
//     },
//     scales: {
//       x: {
//         type: 'time',
//         grid: { color: 'rgba(42, 46, 57, 0.5)', drawBorder: false },
//         ticks: { color: '#787b86', font: { size: 10 } },
//       },
//       y: {
//         position: 'right',
//         grid: { color: 'rgba(42, 46, 57, 0.5)', drawBorder: false },
//         ticks: { color: '#d1d4dc', font: { size: 11 } },
//       },
//     },
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         mode: 'index',
//         intersect: false,
//         backgroundColor: '#1e222d',
//         titleColor: '#787b86',
//         bodyColor: '#d1d4dc',
//         borderColor: '#363a45',
//         borderWidth: 1,
//       },
//       // ZOOM & SCROLL LOGIC
//       zoom: {
//         pan: {
//           enabled: true,
//           mode: 'xy',
//         },
//         zoom: {
//           wheel: { enabled: true, speed: 0.1 },
//           pinch: { enabled: true },
//           mode: 'xy',
//         },
//       },
//       // LIVE PRICE HIGHLIGHTING
//       annotation: {
//         annotations: {
//           line1: {
//             type: 'line',
//             yMin: currentPrice,
//             yMax: currentPrice,
//             borderColor: '#2962ff',
//             borderWidth: 2,
//             borderDash: [4, 4],
//             label: {
//               display: true,
//               content: `Live: ${currentPrice?.toFixed(2)}`,
//               position: 'end',
//               backgroundColor: '#2962ff',
//               color: '#fff',
//               font: { size: 12, weight: 'bold' },
//               padding: 6,
//               xAdjust: 50
//             },
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div style={containerStyle}>
//       {/* PROFESSIONAL DASHBOARD HEADER */}
//       <div style={headerStyle}>
//         <div style={symbolInfo}>
//           <span style={tickerText}>{symbol}</span>
//           <span style={liveBadge}>● LIVE</span>
//         </div>
        
//         <div style={priceMetrics}>
//           <div style={priceColumn}>
//             <span style={label}>CURRENT PRICE</span>
//             <span style={mainPrice(currentPrice, formattedData?.at(-1)?.o)}>
//               ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </span>
//           </div>
//           <button onClick={() => chartRef.current.resetZoom()} style={resetBtn}>
//             Reset View
//           </button>
//         </div>
//       </div>

//       {/* THE CHART */}
//       <div style={chartWrapper}>
//         <Chart
//           ref={chartRef}
//           type="candlestick"
//           data={chartConfig}
//           options={options}
//         />
//       </div>

//       {/* HUD (Heads Up Display) Overlay for Instructions */}
//       <div style={instructions}>
//         Scroll to zoom • Drag to pan • Hover for details
//       </div>
//     </div>
//   );
// };

// // --- STYLES (Professional Dark Terminal Aesthetic) ---
// const containerStyle = {
//   backgroundColor: '#131722',
//   height: '100vh',
//   width: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   fontFamily: "'Trebuchet MS', sans-serif",
//   color: '#d1d4dc'
// };

// const headerStyle = {
//   display: 'flex',
//   justifyContent: 'space-between',
//   padding: '15px 25px',
//   borderBottom: '1px solid #2a2e39',
//   alignItems: 'center'
// };

// const symbolInfo = { display: 'flex', alignItems: 'center', gap: '12px' };
// const tickerText = { fontSize: '24px', fontWeight: 'bold', color: '#fff' };
// const liveBadge = { fontSize: '10px', color: '#00ff00', letterSpacing: '1px' };

// const priceMetrics = { display: 'flex', alignItems: 'center', gap: '30px' };
// const priceColumn = { display: 'flex', flexDirection: 'column' };
// const label = { fontSize: '10px', color: '#787b86', marginBottom: '4px' };
// const mainPrice = (curr, prev) => ({
//   fontSize: '22px',
//   fontWeight: '600',
//   color: curr >= prev ? '#26a69a' : '#ef5350'
// });

// const resetBtn = {
//   backgroundColor: '#2962ff',
//   color: '#fff',
//   border: 'none',
//   padding: '8px 16px',
//   borderRadius: '4px',
//   cursor: 'pointer',
//   fontWeight: 'bold',
//   fontSize: '12px'
// };

// const chartWrapper = {
//   flex: 1,
//   padding: '10px',
//   cursor: 'crosshair'
// };

// const instructions = {
//   fontSize: '11px',
//   color: '#434651',
//   padding: '8px',
//   textAlign: 'center',
//   borderTop: '1px solid #2a2e39'
// };

// export default CandlestickChart;

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Chart } from 'react-chartjs-2';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CandlestickController,
  CandlestickElement,
  annotationPlugin
);

const styles = {
  container: {
    height: '600px',
    position: 'relative',
    backgroundColor: '#0a1929',
    borderRadius: '12px',
    padding: '10px',
    fontFamily: "'Inter', sans-serif",
    border: '1px solid #1e2d3d'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    color: '#fff'
  },
  priceTag: (isUp) => ({
    fontSize: '24px',
    fontWeight: 'bold',
    color: isUp ? '#00c853' : '#ff5252'
  }),
  controls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px'
  },
  btn: {
    backgroundColor: '#1a2335',
    border: '1px solid #4096ff',
    color: '#fff',
    padding: '5px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};

const CandlestickChart = ({ 
  data, 
  symbol, 
  timeframe, 
  currentPrice 
}) => {
  const chartRef = useRef(null);

  // --- DATA PROCESSING ---
  const chartData = useMemo(() => {
    // 1. Get database candles
    const dbCandles = data?.candles || [];
    
    // 2. Format database candles for Chart.js Financial
    const formattedHistory = dbCandles.map(c => ({
      x: new Date(c.x).getTime(),
      o: parseFloat(c.o),
      h: parseFloat(c.h),
      l: parseFloat(c.l),
      c: parseFloat(c.c),
      v: parseFloat(c.v || 0)
    })).sort((a, b) => a.x - b.x);

    // 3. Append real-time price if available
    if (currentPrice && formattedHistory.length > 0) {
      const lastCandle = formattedHistory[formattedHistory.length - 1];
      const now = Date.now();
      
      // If the last candle is older than the timeframe, start a new one
      // Otherwise, update the current "live" candle
      formattedHistory.push({
        x: now,
        o: lastCandle.c,
        h: Math.max(lastCandle.c, currentPrice),
        l: Math.min(lastCandle.c, currentPrice),
        c: currentPrice,
        v: 0 // Live volume usually fetched separately
      });
    }

    return {
      datasets: [{
        label: symbol,
        data: formattedHistory,
        borderColor: '#ffffff10',
        candlestick: {
          color: {
            up: '#00c853',
            down: '#ff5252',
            unchanged: '#78909c'
          }
        }
      }]
    };
  }, [data, currentPrice, symbol]);

  // --- CHART OPTIONS ---
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { right: 60 } },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'auto' },
        grid: { color: '#1e2d3d' },
        ticks: { color: '#b0bec5' }
      },
      y: {
        position: 'right',
        grid: { color: '#1e2d3d' },
        ticks: { color: '#b0bec5' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: '#1a2335'
      },
      // --- LIVE PRICE HIGHLIGHT ---
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: currentPrice,
            yMax: currentPrice,
            borderColor: '#4096ff',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              display: true,
              content: currentPrice?.toFixed(2),
              position: 'end',
              backgroundColor: '#4096ff',
              color: '#fff',
              xAdjust: 50
            }
          }
        }
      }
    }
  }), [currentPrice]);

  return (
    <div style={styles.container}>
      {/* Header Info */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>{symbol} <span style={{fontSize: '14px', color: '#b0bec5'}}>{timeframe}</span></h2>
        </div>
        <div style={styles.priceTag(currentPrice >= (data?.candles?.at(-1)?.c || 0))}>
          ${currentPrice?.toLocaleString() || data?.candles?.at(-1)?.c?.toLocaleString()}
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ height: '500px' }}>
        <Chart 
          ref={chartRef}
          type="candlestick" 
          data={chartData} 
          options={options} 
        />
      </div>

      {/* User Legend */}
      <div style={{ display: 'flex', gap: '20px', padding: '10px', fontSize: '12px', color: '#b0bec5' }}>
        <span>● <span style={{color: '#00c853'}}>Bullish</span></span>
        <span>● <span style={{color: '#ff5252'}}>Bearish</span></span>
        <span>--- <span style={{color: '#4096ff'}}>Live Price</span></span>
      </div>
    </div>
  );
};

export default CandlestickChart;