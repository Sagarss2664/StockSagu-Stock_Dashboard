// // // // // // // import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
// // // // // // // import {
// // // // // // //   Chart as ChartJS,
// // // // // // //   CategoryScale,
// // // // // // //   LinearScale,
// // // // // // //   TimeScale,
// // // // // // //   LineController,
// // // // // // //   LineElement,
// // // // // // //   PointElement,
// // // // // // //   BarController,
// // // // // // //   BarElement,
// // // // // // //   Title,
// // // // // // //   Tooltip,
// // // // // // //   Legend,
// // // // // // //   Filler,
// // // // // // //   Decimation,
// // // // // // //   SubTitle
// // // // // // // } from 'chart.js';
// // // // // // // import 'chartjs-adapter-date-fns';
// // // // // // // import { Chart } from 'react-chartjs-2';
// // // // // // // import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

// // // // // // // // Register ChartJS components
// // // // // // // ChartJS.register(
// // // // // // //   CategoryScale,
// // // // // // //   LinearScale,
// // // // // // //   TimeScale,
// // // // // // //   LineController,
// // // // // // //   LineElement,
// // // // // // //   PointElement,
// // // // // // //   BarController,
// // // // // // //   BarElement,
// // // // // // //   Title,
// // // // // // //   Tooltip,
// // // // // // //   Legend,
// // // // // // //   Filler,
// // // // // // //   Decimation,
// // // // // // //   SubTitle,
// // // // // // //   CandlestickController,
// // // // // // //   CandlestickElement
// // // // // // // );

// // // // // // // // Helper function for time unit
// // // // // // // const getTimeUnit = (tf) => {
// // // // // // //   const unitMap = {
// // // // // // //     '1m': 'minute',
// // // // // // //     '5m': 'minute',
// // // // // // //     '15m': 'minute',
// // // // // // //     '30m': 'minute',
// // // // // // //     '1h': 'hour',
// // // // // // //     '4h': 'hour',
// // // // // // //     '1d': 'day',
// // // // // // //     '1w': 'week',
// // // // // // //     '1M': 'month',
// // // // // // //     '24h': 'hour'
// // // // // // //   };
// // // // // // //   return unitMap[tf] || 'hour';
// // // // // // // };

// // // // // // // // Helper functions for calculations - MOVED BEFORE COMPONENT
// // // // // // // const calculateSMA = (data, period) => {
// // // // // // //   if (!data || data.length < period) return new Array(data?.length || 0).fill(null);
  
// // // // // // //   const sma = new Array(data.length).fill(null);
// // // // // // //   for (let i = period - 1; i < data.length; i++) {
// // // // // // //     const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
// // // // // // //     sma[i] = sum / period;
// // // // // // //   }
// // // // // // //   return sma;
// // // // // // // };

// // // // // // // const calculateBollingerBands = (data, period, multiplier) => {
// // // // // // //   if (!data || data.length < period) {
// // // // // // //     return {
// // // // // // //       upper: new Array(data?.length || 0).fill(null),
// // // // // // //       lower: new Array(data?.length || 0).fill(null),
// // // // // // //       middle: new Array(data?.length || 0).fill(null)
// // // // // // //     };
// // // // // // //   }
  
// // // // // // //   const upper = new Array(data.length).fill(null);
// // // // // // //   const lower = new Array(data.length).fill(null);
// // // // // // //   const middle = new Array(data.length).fill(null);
  
// // // // // // //   for (let i = period - 1; i < data.length; i++) {
// // // // // // //     const slice = data.slice(i - period + 1, i + 1);
// // // // // // //     const mean = slice.reduce((a, b) => a + b, 0) / period;
// // // // // // //     const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
// // // // // // //     const stdDev = Math.sqrt(variance);
    
// // // // // // //     middle[i] = mean;
// // // // // // //     upper[i] = mean + (multiplier * stdDev);
// // // // // // //     lower[i] = mean - (multiplier * stdDev);
// // // // // // //   }
  
// // // // // // //   return { upper, lower, middle };
// // // // // // // };

// // // // // // // // CSS styles for the component
// // // // // // // const styles = {
// // // // // // //   container: {
// // // // // // //     height: '600px',
// // // // // // //     position: 'relative',
// // // // // // //     backgroundColor: '#0a1929',
// // // // // // //     borderRadius: '12px',
// // // // // // //     overflow: 'hidden',
// // // // // // //     fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
// // // // // // //   },
// // // // // // //   controlPanel: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: '15px',
// // // // // // //     right: '15px',
// // // // // // //     zIndex: 100,
// // // // // // //     display: 'flex',
// // // // // // //     flexDirection: 'column',
// // // // // // //     gap: '10px'
// // // // // // //   },
// // // // // // //   controlButton: {
// // // // // // //     backgroundColor: 'rgba(26, 35, 53, 0.9)',
// // // // // // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // // // // // //     color: '#e0e0e0',
// // // // // // //     padding: '8px 12px',
// // // // // // //     borderRadius: '6px',
// // // // // // //     fontSize: '12px',
// // // // // // //     fontWeight: '500',
// // // // // // //     cursor: 'pointer',
// // // // // // //     transition: 'all 0.2s ease',
// // // // // // //     display: 'flex',
// // // // // // //     alignItems: 'center',
// // // // // // //     gap: '6px',
// // // // // // //     backdropFilter: 'blur(10px)',
// // // // // // //     minWidth: '80px'
// // // // // // //   },
// // // // // // //   timeControl: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: '15px',
// // // // // // //     left: '15px',
// // // // // // //     zIndex: 100,
// // // // // // //     backgroundColor: 'rgba(26, 35, 53, 0.9)',
// // // // // // //     padding: '8px',
// // // // // // //     borderRadius: '6px',
// // // // // // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // // // // // //     backdropFilter: 'blur(10px)'
// // // // // // //   },
// // // // // // //   timeButton: {
// // // // // // //     backgroundColor: 'rgba(64, 150, 255, 0.1)',
// // // // // // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // // // // // //     color: '#e0e0e0',
// // // // // // //     padding: '4px 8px',
// // // // // // //     margin: '2px',
// // // // // // //     borderRadius: '4px',
// // // // // // //     fontSize: '11px',
// // // // // // //     cursor: 'pointer',
// // // // // // //     transition: 'all 0.2s ease'
// // // // // // //   },
// // // // // // //   infoPanel: {
// // // // // // //     position: 'absolute',
// // // // // // //     bottom: '20px',
// // // // // // //     left: '20px',
// // // // // // //     zIndex: 100,
// // // // // // //     backgroundColor: 'rgba(26, 35, 53, 0.9)',
// // // // // // //     padding: '15px',
// // // // // // //     borderRadius: '8px',
// // // // // // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // // // // // //     minWidth: '280px',
// // // // // // //     backdropFilter: 'blur(10px)'
// // // // // // //   },
// // // // // // //   priceChange: (change) => ({
// // // // // // //     color: change >= 0 ? '#00c853' : '#ff5252',
// // // // // // //     fontWeight: '600',
// // // // // // //     fontSize: '24px'
// // // // // // //   }),
// // // // // // //   legendPanel: {
// // // // // // //     position: 'absolute',
// // // // // // //     bottom: '20px',
// // // // // // //     right: '20px',
// // // // // // //     zIndex: 100,
// // // // // // //     backgroundColor: 'rgba(26, 35, 53, 0.9)',
// // // // // // //     padding: '12px',
// // // // // // //     borderRadius: '8px',
// // // // // // //     border: '1px solid rgba(64, 150, 255, 0.3)',
// // // // // // //     fontSize: '11px',
// // // // // // //     backdropFilter: 'blur(10px)'
// // // // // // //   },
// // // // // // //   loadingOverlay: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 0,
// // // // // // //     left: 0,
// // // // // // //     right: 0,
// // // // // // //     bottom: 0,
// // // // // // //     backgroundColor: 'rgba(10, 25, 41, 0.9)',
// // // // // // //     display: 'flex',
// // // // // // //     flexDirection: 'column',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     zIndex: 1000,
// // // // // // //     borderRadius: '12px'
// // // // // // //   },
// // // // // // //   gradientBorder: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 0,
// // // // // // //     left: 0,
// // // // // // //     right: 0,
// // // // // // //     bottom: 0,
// // // // // // //     borderRadius: '12px',
// // // // // // //     padding: '2px',
// // // // // // //     background: 'linear-gradient(45deg, #4096ff, #6f42c1, #4096ff)',
// // // // // // //     WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
// // // // // // //     WebkitMaskComposite: 'xor',
// // // // // // //     maskComposite: 'exclude',
// // // // // // //     pointerEvents: 'none'
// // // // // // //   }
// // // // // // // };

// // // // // // // const CandlestickChart = ({ 
// // // // // // //   data, 
// // // // // // //   symbol, 
// // // // // // //   timeframe, 
// // // // // // //   isRefreshing = false, 
// // // // // // //   currentPrice,
// // // // // // //   stockPrices = {}
// // // // // // // }) => {
// // // // // // //   const chartRef = useRef(null);
// // // // // // //   const chartInstanceRef = useRef(null);
// // // // // // //   const [currentValue, setCurrentValue] = useState(null);
// // // // // // //   const [highlightedPoint, setHighlightedPoint] = useState(null);
// // // // // // //   const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
// // // // // // //   const [realTimeData, setRealTimeData] = useState(null);
// // // // // // //   const [isZoomed, setIsZoomed] = useState(false);
// // // // // // //   const [showVolume, setShowVolume] = useState(false);
// // // // // // //   const [showIndicators, setShowIndicators] = useState(true);
// // // // // // //   const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });
// // // // // // //   const [chartLoaded, setChartLoaded] = useState(false);

// // // // // // //   // Get stock change data
// // // // // // //   const stockData = stockPrices[symbol] || {};

// // // // // // //   // Get the most recent data point from chart data
// // // // // // //   const getLatestDataPoint = useCallback(() => {
// // // // // // //     if (!data?.candles || data.candles.length === 0) return null;
    
// // // // // // //     const sortedCandles = [...data.candles].sort((a, b) => b.x - a.x);
// // // // // // //     return sortedCandles[0];
// // // // // // //   }, [data?.candles]);

// // // // // // //   // Update real-time data
// // // // // // //   useEffect(() => {
// // // // // // //     if (currentPrice !== undefined && currentPrice !== null) {
// // // // // // //       const now = new Date();
// // // // // // //       const latestChartPoint = getLatestDataPoint();
      
// // // // // // //       const realTimeCandle = {
// // // // // // //         x: now.getTime(),
// // // // // // //         o: currentPrice,
// // // // // // //         h: Math.max(currentPrice, latestChartPoint?.h || currentPrice),
// // // // // // //         l: Math.min(currentPrice, latestChartPoint?.l || currentPrice),
// // // // // // //         c: currentPrice,
// // // // // // //         v: latestChartPoint?.v || Math.floor(1000000 + Math.random() * 5000000),
// // // // // // //         isRealTime: true
// // // // // // //       };
      
// // // // // // //       setRealTimeData(realTimeCandle);
// // // // // // //       setCurrentValue(currentPrice);
// // // // // // //       setHighlightedPoint({
// // // // // // //         x: now.getTime(),
// // // // // // //         y: currentPrice,
// // // // // // //         price: currentPrice,
// // // // // // //         time: now
// // // // // // //       });
// // // // // // //       setLastUpdateTime(now);
      
// // // // // // //       // Calculate price change
// // // // // // //       if (latestChartPoint) {
// // // // // // //         const change = currentPrice - latestChartPoint.c;
// // // // // // //         const percent = (change / latestChartPoint.c) * 100;
// // // // // // //         setPriceChange({ value: change, percent });
// // // // // // //       }
// // // // // // //     } else if (data?.candles && data.candles.length > 0) {
// // // // // // //       const latest = getLatestDataPoint();
// // // // // // //       if (latest) {
// // // // // // //         setCurrentValue(latest.c);
// // // // // // //         setHighlightedPoint({
// // // // // // //           x: new Date(latest.x).getTime(),
// // // // // // //           y: latest.c,
// // // // // // //           price: latest.c,
// // // // // // //           time: new Date(latest.x)
// // // // // // //         });
// // // // // // //         setLastUpdateTime(new Date(latest.x));
// // // // // // //       }
// // // // // // //     }
// // // // // // //   }, [currentPrice, data, symbol, getLatestDataPoint]);

// // // // // // //   // Prepare chart data
// // // // // // //   const chartData = useMemo(() => {
// // // // // // //     if (!data?.candles || data.candles.length === 0) {
// // // // // // //       return { 
// // // // // // //         datasets: [],
// // // // // // //         labels: []
// // // // // // //       };
// // // // // // //     }

// // // // // // //     const candles = data.candles;
// // // // // // //     const indicators = data.indicators;
    
// // // // // // //     const latestChartCandle = getLatestDataPoint();
    
// // // // // // //     // Combine data
// // // // // // //     let allCandles = [...candles];
// // // // // // //     if (realTimeData && (!latestChartCandle || realTimeData.x > latestChartCandle.x)) {
// // // // // // //       allCandles = [...candles, realTimeData];
// // // // // // //     }
    
// // // // // // //     // Sort by time
// // // // // // //     const sortedCandles = allCandles.sort((a, b) => a.x - b.x);
    
// // // // // // //     // Create candlestick data with proper structure
// // // // // // //     const candlestickData = sortedCandles.map(candle => ({
// // // // // // //       x: new Date(candle.x).getTime(),
// // // // // // //       o: candle.o || 0,
// // // // // // //       h: candle.h || 0,
// // // // // // //       l: candle.l || 0,
// // // // // // //       c: candle.c || 0,
// // // // // // //       v: candle.v || 0,
// // // // // // //       isCurrent: realTimeData ? candle.x === realTimeData.x : 
// // // // // // //                  (latestChartCandle && candle.x === latestChartCandle.x),
// // // // // // //       isRealTime: candle.isRealTime || false
// // // // // // //     }));

// // // // // // //     const latestPrice = currentValue || (latestChartCandle?.c || 0);
    
// // // // // // //     // Calculate moving averages
// // // // // // //     const prices = candlestickData.map(d => d.c);
// // // // // // //     const sma20 = calculateSMA(prices, 20);
// // // // // // //     const sma50 = calculateSMA(prices, 50);
    
// // // // // // //     // Bollinger Bands
// // // // // // //     const bb = calculateBollingerBands(prices, 20, 2);

// // // // // // //     // Prepare datasets
// // // // // // //     const datasets = [];

// // // // // // //     // 1. Candlestick data
// // // // // // //     datasets.push({
// // // // // // //       label: `${symbol} Price`,
// // // // // // //       data: candlestickData,
// // // // // // //       type: 'candlestick',
// // // // // // //       borderColor: 'rgba(255, 255, 255, 0.1)',
// // // // // // //       borderWidth: 1,
// // // // // // //       color: {
// // // // // // //         up: '#00c853',
// // // // // // //         down: '#ff5252',
// // // // // // //         unchanged: '#78909c'
// // // // // // //       },
// // // // // // //       yAxisID: 'y'
// // // // // // //     });

// // // // // // //     // 2. Volume bars (conditionally shown) - FIXED: Proper data structure
// // // // // // //     if (showVolume) {
// // // // // // //       datasets.push({
// // // // // // //         label: 'Volume',
// // // // // // //         data: candlestickData.map(d => ({ 
// // // // // // //           x: d.x, 
// // // // // // //           y: d.v 
// // // // // // //         })),
// // // // // // //         type: 'bar',
// // // // // // //         backgroundColor: candlestickData.map(d => 
// // // // // // //           d.c >= d.o ? 'rgba(0, 200, 83, 0.3)' : 'rgba(255, 82, 82, 0.3)'
// // // // // // //         ),
// // // // // // //         borderColor: candlestickData.map(d => 
// // // // // // //           d.c >= d.o ? 'rgba(0, 200, 83, 0.6)' : 'rgba(255, 82, 82, 0.6)'
// // // // // // //         ),
// // // // // // //         borderWidth: 1,
// // // // // // //         yAxisID: 'y1'
// // // // // // //       });
// // // // // // //     }

// // // // // // //     // 3. Add indicators if enabled
// // // // // // //     if (showIndicators) {
// // // // // // //       // SMA 20
// // // // // // //       datasets.push({
// // // // // // //         label: 'SMA 20',
// // // // // // //         data: candlestickData.map((d, i) => ({ 
// // // // // // //           x: d.x, 
// // // // // // //           y: sma20[i] 
// // // // // // //         })),
// // // // // // //         type: 'line',
// // // // // // //         borderColor: 'rgba(255, 152, 0, 0.8)',
// // // // // // //         borderWidth: 1.5,
// // // // // // //         pointRadius: 0,
// // // // // // //         fill: false,
// // // // // // //         tension: 0.1
// // // // // // //       });

// // // // // // //       // SMA 50
// // // // // // //       datasets.push({
// // // // // // //         label: 'SMA 50',
// // // // // // //         data: candlestickData.map((d, i) => ({ 
// // // // // // //           x: d.x, 
// // // // // // //           y: sma50[i] 
// // // // // // //         })),
// // // // // // //         type: 'line',
// // // // // // //         borderColor: 'rgba(156, 39, 176, 0.8)',
// // // // // // //         borderWidth: 1.5,
// // // // // // //         pointRadius: 0,
// // // // // // //         fill: false,
// // // // // // //         tension: 0.1
// // // // // // //       });

// // // // // // //       // Bollinger Bands Upper
// // // // // // //       datasets.push({
// // // // // // //         label: 'BB Upper',
// // // // // // //         data: candlestickData.map((d, i) => ({ 
// // // // // // //           x: d.x, 
// // // // // // //           y: bb.upper[i] 
// // // // // // //         })),
// // // // // // //         type: 'line',
// // // // // // //         borderColor: 'rgba(33, 150, 243, 0.6)',
// // // // // // //         borderWidth: 1,
// // // // // // //         pointRadius: 0,
// // // // // // //         borderDash: [5, 5],
// // // // // // //         fill: false
// // // // // // //       });

// // // // // // //       // Bollinger Bands Lower
// // // // // // //       datasets.push({
// // // // // // //         label: 'BB Lower',
// // // // // // //         data: candlestickData.map((d, i) => ({ 
// // // // // // //           x: d.x, 
// // // // // // //           y: bb.lower[i] 
// // // // // // //         })),
// // // // // // //         type: 'line',
// // // // // // //         borderColor: 'rgba(33, 150, 243, 0.6)',
// // // // // // //         borderWidth: 1,
// // // // // // //         pointRadius: 0,
// // // // // // //         borderDash: [5, 5],
// // // // // // //         fill: false
// // // // // // //       });
// // // // // // //     }

// // // // // // //     // 4. Add real-time marker
// // // // // // //     if (realTimeData) {
// // // // // // //       datasets.push({
// // // // // // //         label: 'Live Price',
// // // // // // //         data: [{ x: realTimeData.x, y: realTimeData.c }],
// // // // // // //         type: 'line',
// // // // // // //         borderColor: '#ff9800',
// // // // // // //         borderWidth: 2,
// // // // // // //         pointBackgroundColor: '#ff9800',
// // // // // // //         pointBorderColor: '#fff',
// // // // // // //         pointBorderWidth: 2,
// // // // // // //         pointRadius: 6,
// // // // // // //         pointHoverRadius: 10,
// // // // // // //         fill: false,
// // // // // // //         tension: 0,
// // // // // // //         pointStyle: 'rectRot'
// // // // // // //       });
// // // // // // //     }

// // // // // // //     return { 
// // // // // // //       datasets,
// // // // // // //       labels: candlestickData.map(d => new Date(d.x).toISOString())
// // // // // // //     };
// // // // // // //   }, [data, symbol, realTimeData, currentValue, showVolume, showIndicators, getLatestDataPoint]);

// // // // // // //   // Chart options
// // // // // // //   const options = useMemo(() => ({
// // // // // // //     responsive: true,
// // // // // // //     maintainAspectRatio: false,
// // // // // // //     interaction: {
// // // // // // //       mode: 'index',
// // // // // // //       intersect: false
// // // // // // //     },
// // // // // // //     plugins: {
// // // // // // //       legend: {
// // // // // // //         position: 'top',
// // // // // // //         labels: {
// // // // // // //           color: '#b0bec5',
// // // // // // //           usePointStyle: true,
// // // // // // //           boxWidth: 8,
// // // // // // //           font: {
// // // // // // //             size: 11,
// // // // // // //             family: "'Inter', sans-serif"
// // // // // // //           },
// // // // // // //           padding: 15
// // // // // // //         }
// // // // // // //       },
// // // // // // //       title: {
// // // // // // //         display: true,
// // // // // // //         text: `${symbol} • ${timeframe} • ${new Date().toLocaleDateString()}`,
// // // // // // //         color: '#e0e0e0',
// // // // // // //         font: {
// // // // // // //           size: 14,
// // // // // // //           weight: '600',
// // // // // // //           family: "'Inter', sans-serif"
// // // // // // //         },
// // // // // // //         padding: {
// // // // // // //           top: 10,
// // // // // // //           bottom: 20
// // // // // // //         }
// // // // // // //       },
// // // // // // //       tooltip: {
// // // // // // //         backgroundColor: 'rgba(26, 35, 53, 0.95)',
// // // // // // //         titleColor: '#e0e0e0',
// // // // // // //         bodyColor: '#e0e0e0',
// // // // // // //         borderColor: 'rgba(64, 150, 255, 0.3)',
// // // // // // //         borderWidth: 1,
// // // // // // //         cornerRadius: 6,
// // // // // // //         padding: 12,
// // // // // // //         displayColors: false,
// // // // // // //         callbacks: {
// // // // // // //           title: (context) => {
// // // // // // //             const date = new Date(context[0].parsed.x);
// // // // // // //             return date.toLocaleString('en-US', {
// // // // // // //               weekday: 'short',
// // // // // // //               month: 'short',
// // // // // // //               day: 'numeric',
// // // // // // //               hour: '2-digit',
// // // // // // //               minute: '2-digit'
// // // // // // //             });
// // // // // // //           },
// // // // // // //           label: (context) => {
// // // // // // //             const dataset = context.dataset;
// // // // // // //             const dataPoint = dataset.data[context.dataIndex];
            
// // // // // // //             if (!dataPoint) return '';
            
// // // // // // //             if (dataset.type === 'candlestick') {
// // // // // // //               return [
// // // // // // //                 `Open: $${(dataPoint.o || 0).toFixed(2)}`,
// // // // // // //                 `High: $${(dataPoint.h || 0).toFixed(2)}`,
// // // // // // //                 `Low: $${(dataPoint.l || 0).toFixed(2)}`,
// // // // // // //                 `Close: $${(dataPoint.c || 0).toFixed(2)}`,
// // // // // // //                 `Volume: ${(dataPoint.v || 0).toLocaleString()}`
// // // // // // //               ];
// // // // // // //             } else if (dataset.type === 'bar') {
// // // // // // //               return `Volume: ${(dataPoint.y || 0).toLocaleString()}`;
// // // // // // //             }
// // // // // // //             return `${dataset.label}: $${(dataPoint.y || 0).toFixed(2)}`;
// // // // // // //           }
// // // // // // //         }
// // // // // // //       },
// // // // // // //       decimation: {
// // // // // // //         enabled: true,
// // // // // // //         algorithm: 'lttb',
// // // // // // //         samples: 100
// // // // // // //       }
// // // // // // //     },
// // // // // // //     scales: {
// // // // // // //       x: {
// // // // // // //         type: 'time',
// // // // // // //         time: {
// // // // // // //           unit: getTimeUnit(timeframe),
// // // // // // //           displayFormats: {
// // // // // // //             minute: 'HH:mm',
// // // // // // //             hour: 'MMM dd HH:mm',
// // // // // // //             day: 'MMM dd',
// // // // // // //             week: 'MMM dd',
// // // // // // //             month: 'MMM yyyy'
// // // // // // //           },
// // // // // // //           tooltipFormat: 'MMM dd, yyyy HH:mm'
// // // // // // //         },
// // // // // // //         grid: {
// // // // // // //           color: 'rgba(255, 255, 255, 0.05)',
// // // // // // //           drawBorder: false
// // // // // // //         },
// // // // // // //         ticks: {
// // // // // // //           color: '#b0bec5',
// // // // // // //           font: {
// // // // // // //             size: 11,
// // // // // // //             family: "'Inter', sans-serif"
// // // // // // //           },
// // // // // // //           maxTicksLimit: 10,
// // // // // // //           maxRotation: 0
// // // // // // //         },
// // // // // // //         border: {
// // // // // // //           color: 'rgba(255, 255, 255, 0.1)'
// // // // // // //         }
// // // // // // //       },
// // // // // // //       y: {
// // // // // // //         position: 'right',
// // // // // // //         grid: {
// // // // // // //           color: 'rgba(255, 255, 255, 0.05)',
// // // // // // //           drawBorder: false
// // // // // // //         },
// // // // // // //         ticks: {
// // // // // // //           color: '#b0bec5',
// // // // // // //           font: {
// // // // // // //             size: 11,
// // // // // // //             family: "'Inter', sans-serif"
// // // // // // //           },
// // // // // // //           callback: (value) => `$${value.toFixed(2)}`,
// // // // // // //           padding: 8
// // // // // // //         },
// // // // // // //         border: {
// // // // // // //           color: 'rgba(255, 255, 255, 0.1)'
// // // // // // //         },
// // // // // // //         title: {
// // // // // // //           display: true,
// // // // // // //           text: 'Price ($)',
// // // // // // //           color: '#b0bec5',
// // // // // // //           font: {
// // // // // // //             size: 12,
// // // // // // //             weight: '600',
// // // // // // //             family: "'Inter', sans-serif"
// // // // // // //           }
// // // // // // //         }
// // // // // // //       },
// // // // // // //       y1: {
// // // // // // //         position: 'left',
// // // // // // //         grid: {
// // // // // // //           drawOnChartArea: false
// // // // // // //         },
// // // // // // //         ticks: {
// // // // // // //           color: '#b0bec5',
// // // // // // //           font: {
// // // // // // //             size: 11,
// // // // // // //             family: "'Inter', sans-serif"
// // // // // // //           },
// // // // // // //           callback: (value) => `${(value / 1000000).toFixed(1)}M`
// // // // // // //         },
// // // // // // //         title: {
// // // // // // //           display: true,
// // // // // // //           text: 'Volume',
// // // // // // //           color: '#b0bec5',
// // // // // // //           font: {
// // // // // // //             size: 12,
// // // // // // //             weight: '600',
// // // // // // //             family: "'Inter', sans-serif"
// // // // // // //           }
// // // // // // //         }
// // // // // // //       }
// // // // // // //     },
// // // // // // //     elements: {
// // // // // // //       point: {
// // // // // // //         radius: 0,
// // // // // // //         hoverRadius: 4
// // // // // // //       },
// // // // // // //       line: {
// // // // // // //         tension: 0
// // // // // // //       }
// // // // // // //     },
// // // // // // //     animation: {
// // // // // // //       duration: 0
// // // // // // //     }
// // // // // // //   }), [symbol, timeframe]);

// // // // // // //   // Chart control functions
// // // // // // //   const handleResetZoom = () => {
// // // // // // //     if (chartInstanceRef.current) {
// // // // // // //       chartInstanceRef.current.reset();
// // // // // // //       setIsZoomed(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleZoomIn = () => {
// // // // // // //     if (chartInstanceRef.current && data?.candles?.length > 0) {
// // // // // // //       const chart = chartInstanceRef.current;
// // // // // // //       const xScale = chart.scales.x;
// // // // // // //       const yScale = chart.scales.y;
      
// // // // // // //       if (!xScale || !yScale) return;
      
// // // // // // //       // Get current ranges
// // // // // // //       const currentXRange = xScale.max - xScale.min;
// // // // // // //       const currentYRange = yScale.max - yScale.min;
      
// // // // // // //       // Zoom in by 20%
// // // // // // //       const newXRange = currentXRange * 0.8;
// // // // // // //       const newYRange = currentYRange * 0.8;
      
// // // // // // //       const xCenter = (xScale.max + xScale.min) / 2;
// // // // // // //       const yCenter = (yScale.max + yScale.min) / 2;
      
// // // // // // //       chart.options.scales.x.min = xCenter - newXRange / 2;
// // // // // // //       chart.options.scales.x.max = xCenter + newXRange / 2;
// // // // // // //       chart.options.scales.y.min = yCenter - newYRange / 2;
// // // // // // //       chart.options.scales.y.max = yCenter + newYRange / 2;
// // // // // // //       chart.update();
// // // // // // //       setIsZoomed(true);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleZoomOut = () => {
// // // // // // //     if (chartInstanceRef.current && data?.candles?.length > 0) {
// // // // // // //       const chart = chartInstanceRef.current;
// // // // // // //       const xScale = chart.scales.x;
// // // // // // //       const yScale = chart.scales.y;
      
// // // // // // //       if (!xScale || !yScale) return;
      
// // // // // // //       // Get current ranges
// // // // // // //       const currentXRange = xScale.max - xScale.min;
// // // // // // //       const currentYRange = yScale.max - yScale.min;
      
// // // // // // //       // Zoom out by 20%
// // // // // // //       const newXRange = currentXRange * 1.2;
// // // // // // //       const newYRange = currentYRange * 1.2;
      
// // // // // // //       const xCenter = (xScale.max + xScale.min) / 2;
// // // // // // //       const yCenter = (yScale.max + yScale.min) / 2;
      
// // // // // // //       chart.options.scales.x.min = Math.max(0, xCenter - newXRange / 2);
// // // // // // //       chart.options.scales.x.max = xCenter + newXRange / 2;
// // // // // // //       chart.options.scales.y.min = Math.max(0, yCenter - newYRange / 2);
// // // // // // //       chart.options.scales.y.max = yCenter + newYRange / 2;
// // // // // // //       chart.update();
// // // // // // //       setIsZoomed(true);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleFitToData = () => {
// // // // // // //     if (chartInstanceRef.current && data?.candles?.length > 0) {
// // // // // // //       const chart = chartInstanceRef.current;
// // // // // // //       const candles = data.candles;
      
// // // // // // //       if (candles.length === 0) return;
      
// // // // // // //       // Calculate price range
// // // // // // //       const prices = candles.map(c => c.c || 0).filter(p => !isNaN(p));
// // // // // // //       if (prices.length === 0) return;
      
// // // // // // //       const minPrice = Math.min(...prices);
// // // // // // //       const maxPrice = Math.max(...prices);
      
// // // // // // //       // Calculate time range
// // // // // // //       const times = candles.map(c => new Date(c.x || Date.now()).getTime());
// // // // // // //       const minTime = Math.min(...times);
// // // // // // //       const maxTime = Math.max(...times);
      
// // // // // // //       // Add padding
// // // // // // //       const pricePadding = (maxPrice - minPrice) * 0.1;
// // // // // // //       const timePadding = (maxTime - minTime) * 0.05;
      
// // // // // // //       chart.options.scales.x.min = minTime - timePadding;
// // // // // // //       chart.options.scales.x.max = maxTime + timePadding;
// // // // // // //       chart.options.scales.y.min = Math.max(0, minPrice - pricePadding);
// // // // // // //       chart.options.scales.y.max = maxPrice + pricePadding;
// // // // // // //       chart.update();
// // // // // // //       setIsZoomed(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Pan functions
// // // // // // //   const handlePanLeft = () => {
// // // // // // //     if (chartInstanceRef.current) {
// // // // // // //       const chart = chartInstanceRef.current;
// // // // // // //       const xScale = chart.scales.x;
      
// // // // // // //       if (!xScale) return;
      
// // // // // // //       const xRange = xScale.max - xScale.min;
// // // // // // //       const panAmount = xRange * 0.2;
      
// // // // // // //       chart.options.scales.x.min -= panAmount;
// // // // // // //       chart.options.scales.x.max -= panAmount;
// // // // // // //       chart.update();
// // // // // // //       setIsZoomed(true);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handlePanRight = () => {
// // // // // // //     if (chartInstanceRef.current) {
// // // // // // //       const chart = chartInstanceRef.current;
// // // // // // //       const xScale = chart.scales.x;
      
// // // // // // //       if (!xScale) return;
      
// // // // // // //       const xRange = xScale.max - xScale.min;
// // // // // // //       const panAmount = xRange * 0.2;
      
// // // // // // //       chart.options.scales.x.min += panAmount;
// // // // // // //       chart.options.scales.x.max += panAmount;
// // // // // // //       chart.update();
// // // // // // //       setIsZoomed(true);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Timeframe quick buttons
// // // // // // //   const timeframes = [
// // // // // // //     { label: '1D', value: '24h' },
// // // // // // //     { label: '1W', value: '1w' },
// // // // // // //     { label: '1M', value: '1M' },
// // // // // // //     { label: '3M', value: '3M' },
// // // // // // //     { label: '1Y', value: '1y' }
// // // // // // //   ];

// // // // // // //   // Chart load handler
// // // // // // //   useEffect(() => {
// // // // // // //     const timer = setTimeout(() => {
// // // // // // //       setChartLoaded(true);
// // // // // // //     }, 500);

// // // // // // //     return () => clearTimeout(timer);
// // // // // // //   }, []);

// // // // // // //   // Initial fit to data
// // // // // // //   useEffect(() => {
// // // // // // //     if (chartLoaded && data?.candles?.length > 0) {
// // // // // // //       // Fit to data after a short delay to ensure chart is rendered
// // // // // // //       setTimeout(() => {
// // // // // // //         handleFitToData();
// // // // // // //       }, 100);
// // // // // // //     }
// // // // // // //   }, [chartLoaded, data]);

// // // // // // //   // Handle chart instance reference
// // // // // // //   const handleChartRef = useCallback((chartInstance) => {
// // // // // // //     if (chartInstance) {
// // // // // // //       chartInstanceRef.current = chartInstance;
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   // Cleanup chart on unmount
// // // // // // //   useEffect(() => {
// // // // // // //     return () => {
// // // // // // //       if (chartInstanceRef.current) {
// // // // // // //         chartInstanceRef.current.destroy();
// // // // // // //         chartInstanceRef.current = null;
// // // // // // //       }
// // // // // // //     };
// // // // // // //   }, []);

// // // // // // //   return (
// // // // // // //     <div style={styles.container}>
// // // // // // //       {/* Gradient border effect */}
// // // // // // //       <div style={styles.gradientBorder} />
      
// // // // // // //       {/* Loading overlay */}
// // // // // // //       {!chartLoaded && (
// // // // // // //         <div style={styles.loadingOverlay}>
// // // // // // //           <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
// // // // // // //             <span className="visually-hidden">Loading...</span>
// // // // // // //           </div>
// // // // // // //           <p style={{ color: '#b0bec5', marginTop: '20px', fontSize: '14px' }}>
// // // // // // //             Loading market data for {symbol}...
// // // // // // //           </p>
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       {/* Control panel */}
// // // // // // //       <div style={styles.controlPanel}>
// // // // // // //         <button 
// // // // // // //           style={{...styles.controlButton, ...(isZoomed ? { backgroundColor: 'rgba(64, 150, 255, 0.2)' } : {})}}
// // // // // // //           onClick={handleResetZoom}
// // // // // // //           title="Reset Zoom"
// // // // // // //         >
// // // // // // //           <span style={{ fontSize: '16px' }}>⟲</span> Reset
// // // // // // //         </button>
        
// // // // // // //         <div style={{ display: 'flex', gap: '5px' }}>
// // // // // // //           <button 
// // // // // // //             style={styles.controlButton}
// // // // // // //             onClick={handleZoomIn}
// // // // // // //             title="Zoom In"
// // // // // // //           >
// // // // // // //             <span style={{ fontSize: '16px' }}>⊕</span> In
// // // // // // //           </button>
          
// // // // // // //           <button 
// // // // // // //             style={styles.controlButton}
// // // // // // //             onClick={handleZoomOut}
// // // // // // //             title="Zoom Out"
// // // // // // //           >
// // // // // // //             <span style={{ fontSize: '16px' }}>⊖</span> Out
// // // // // // //           </button>
// // // // // // //         </div>
        
// // // // // // //         <div style={{ display: 'flex', gap: '5px' }}>
// // // // // // //           <button 
// // // // // // //             style={styles.controlButton}
// // // // // // //             onClick={handlePanLeft}
// // // // // // //             title="Pan Left"
// // // // // // //           >
// // // // // // //             <span style={{ fontSize: '16px' }}>←</span>
// // // // // // //           </button>
          
// // // // // // //           <button 
// // // // // // //             style={styles.controlButton}
// // // // // // //             onClick={handlePanRight}
// // // // // // //             title="Pan Right"
// // // // // // //           >
// // // // // // //             <span style={{ fontSize: '16px' }}>→</span>
// // // // // // //           </button>
// // // // // // //         </div>
        
// // // // // // //         <button 
// // // // // // //           style={{...styles.controlButton, ...(showVolume ? { backgroundColor: 'rgba(64, 150, 255, 0.2)' } : {})}}
// // // // // // //           onClick={() => setShowVolume(!showVolume)}
// // // // // // //           title="Toggle Volume"
// // // // // // //         >
// // // // // // //           <span style={{ fontSize: '16px' }}>📊</span> Volume
// // // // // // //         </button>
        
// // // // // // //         <button 
// // // // // // //           style={{...styles.controlButton, ...(showIndicators ? { backgroundColor: 'rgba(64, 150, 255, 0.2)' } : {})}}
// // // // // // //           onClick={() => setShowIndicators(!showIndicators)}
// // // // // // //           title="Toggle Indicators"
// // // // // // //         >
// // // // // // //           <span style={{ fontSize: '16px' }}>📈</span> Indicators
// // // // // // //         </button>
        
// // // // // // //         <button 
// // // // // // //           style={styles.controlButton}
// // // // // // //           onClick={handleFitToData}
// // // // // // //           title="Fit to Data"
// // // // // // //         >
// // // // // // //           <span style={{ fontSize: '16px' }}>⇆</span> Fit Data
// // // // // // //         </button>
// // // // // // //       </div>

// // // // // // //       {/* Time control */}
// // // // // // //       <div style={styles.timeControl}>
// // // // // // //         <div style={{ color: '#b0bec5', fontSize: '11px', marginBottom: '6px', fontWeight: '600' }}>
// // // // // // //           TIME FRAME
// // // // // // //         </div>
// // // // // // //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
// // // // // // //           {timeframes.map(tf => (
// // // // // // //             <button
// // // // // // //               key={tf.value}
// // // // // // //               style={{
// // // // // // //                 ...styles.timeButton,
// // // // // // //                 ...(timeframe === tf.value ? { 
// // // // // // //                   backgroundColor: 'rgba(64, 150, 255, 0.3)',
// // // // // // //                   borderColor: '#4096ff',
// // // // // // //                   color: '#fff'
// // // // // // //                 } : {})
// // // // // // //               }}
// // // // // // //             >
// // // // // // //               {tf.label}
// // // // // // //             </button>
// // // // // // //           ))}
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Main chart */}
// // // // // // //       <div style={{ height: '100%', padding: '20px 20px 60px 20px' }}>
// // // // // // //         {chartLoaded && (
// // // // // // //           <Chart
// // // // // // //             ref={handleChartRef}
// // // // // // //             type='candlestick'
// // // // // // //             data={chartData}
// // // // // // //             options={options}
// // // // // // //             key={`${symbol}-${timeframe}-${showVolume}-${showIndicators}`}
// // // // // // //           />
// // // // // // //         )}
// // // // // // //       </div>

// // // // // // //       {/* Info panel */}
// // // // // // //       {currentValue !== null && highlightedPoint && (
// // // // // // //         <div style={styles.infoPanel}>
// // // // // // //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
// // // // // // //             <div>
// // // // // // //               <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
// // // // // // //                 {symbol}
// // // // // // //               </div>
// // // // // // //               <div style={{ fontSize: '12px', color: '#b0bec5' }}>
// // // // // // //                 {realTimeData ? 'Live Trading' : 'Market Data'}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //             <div style={{
// // // // // // //               padding: '4px 8px',
// // // // // // //               backgroundColor: realTimeData ? 'rgba(255, 152, 0, 0.2)' : 'rgba(64, 150, 255, 0.2)',
// // // // // // //               border: `1px solid ${realTimeData ? '#ff9800' : '#4096ff'}`,
// // // // // // //               borderRadius: '4px',
// // // // // // //               fontSize: '10px',
// // // // // // //               fontWeight: '600',
// // // // // // //               color: realTimeData ? '#ff9800' : '#4096ff',
// // // // // // //               textTransform: 'uppercase'
// // // // // // //             }}>
// // // // // // //               {realTimeData ? 'Live' : 'Historical'}
// // // // // // //             </div>
// // // // // // //           </div>
          
// // // // // // //           <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
// // // // // // //             <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
// // // // // // //               ${(currentValue || 0).toFixed(2)}
// // // // // // //             </div>
// // // // // // //             <div style={styles.priceChange(priceChange.value)}>
// // // // // // //               {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(2)} 
// // // // // // //               ({priceChange.value >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
// // // // // // //             </div>
// // // // // // //           </div>
          
// // // // // // //           <div style={{ 
// // // // // // //             display: 'grid', 
// // // // // // //             gridTemplateColumns: 'repeat(2, 1fr)', 
// // // // // // //             gap: '8px',
// // // // // // //             fontSize: '12px',
// // // // // // //             color: '#b0bec5'
// // // // // // //           }}>
// // // // // // //             <div>
// // // // // // //               <div style={{ opacity: 0.7 }}>Open</div>
// // // // // // //               <div style={{ color: '#fff', fontWeight: '600' }}>
// // // // // // //                 ${(data?.summary?.open || 0).toFixed(2)}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //             <div>
// // // // // // //               <div style={{ opacity: 0.7 }}>High</div>
// // // // // // //               <div style={{ color: '#00c853', fontWeight: '600' }}>
// // // // // // //                 ${(data?.summary?.high || 0).toFixed(2)}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //             <div>
// // // // // // //               <div style={{ opacity: 0.7 }}>Low</div>
// // // // // // //               <div style={{ color: '#ff5252', fontWeight: '600' }}>
// // // // // // //                 ${(data?.summary?.low || 0).toFixed(2)}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //             <div>
// // // // // // //               <div style={{ opacity: 0.7 }}>Volume</div>
// // // // // // //               <div style={{ color: '#fff', fontWeight: '600' }}>
// // // // // // //                 {(data?.summary?.volume || 0).toLocaleString()}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
          
// // // // // // //           <div style={{ 
// // // // // // //             marginTop: '12px', 
// // // // // // //             paddingTop: '12px', 
// // // // // // //             borderTop: '1px solid rgba(255, 255, 255, 0.1)',
// // // // // // //             fontSize: '10px',
// // // // // // //             color: '#78909c',
// // // // // // //             display: 'flex',
// // // // // // //             justifyContent: 'space-between'
// // // // // // //           }}>
// // // // // // //             <span>Last update: {lastUpdateTime.toLocaleTimeString()}</span>
// // // // // // //             {isRefreshing && (
// // // // // // //               <span style={{ color: '#ff9800', display: 'flex', alignItems: 'center', gap: '4px' }}>
// // // // // // //                 <div className="spinner-border spinner-border-sm" role="status" style={{ width: '0.6rem', height: '0.6rem' }}>
// // // // // // //                   <span className="visually-hidden">Updating...</span>
// // // // // // //                 </div>
// // // // // // //                 Updating...
// // // // // // //               </span>
// // // // // // //             )}
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       {/* Legend panel */}
// // // // // // //       <div style={styles.legendPanel}>
// // // // // // //         <div style={{ fontWeight: '600', marginBottom: '6px', color: '#e0e0e0' }}>LEGEND</div>
// // // // // // //         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
// // // // // // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // // // // // //             <div style={{ width: '12px', height: '4px', backgroundColor: '#00c853' }}></div>
// // // // // // //             <span style={{ color: '#b0bec5' }}>Bullish</span>
// // // // // // //           </div>
// // // // // // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // // // // // //             <div style={{ width: '12px', height: '4px', backgroundColor: '#ff5252' }}></div>
// // // // // // //             <span style={{ color: '#b0bec5' }}>Bearish</span>
// // // // // // //           </div>
// // // // // // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // // // // // //             <div style={{ width: '12px', height: '2px', backgroundColor: '#ff9800', border: '1px solid #fff' }}></div>
// // // // // // //             <span style={{ color: '#b0bec5' }}>Live Price</span>
// // // // // // //           </div>
// // // // // // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // // // // // //             <div style={{ width: '12px', height: '2px', backgroundColor: '#ff9800', borderDash: '5 5' }}></div>
// // // // // // //             <span style={{ color: '#b0bec5' }}>SMA 20</span>
// // // // // // //           </div>
// // // // // // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // // // // // //             <div style={{ width: '12px', height: '2px', backgroundColor: '#9c27b0', borderDash: '5 5' }}></div>
// // // // // // //             <span style={{ color: '#b0bec5' }}>SMA 50</span>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //         <div style={{ marginTop: '8px', fontSize: '9px', color: '#78909c', opacity: 0.7 }}>
// // // // // // //           Use buttons to zoom & pan
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Chart tips overlay */}
// // // // // // //       {chartLoaded && (
// // // // // // //         <div style={{
// // // // // // //           position: 'absolute',
// // // // // // //           bottom: '10px',
// // // // // // //           left: '50%',
// // // // // // //           transform: 'translateX(-50%)',
// // // // // // //           backgroundColor: 'rgba(26, 35, 53, 0.8)',
// // // // // // //           padding: '6px 12px',
// // // // // // //           borderRadius: '4px',
// // // // // // //           fontSize: '10px',
// // // // // // //           color: '#b0bec5',
// // // // // // //           zIndex: 50,
// // // // // // //           backdropFilter: 'blur(10px)',
// // // // // // //           border: '1px solid rgba(64, 150, 255, 0.2)'
// // // // // // //         }}>
// // // // // // //           <span>Use control buttons to zoom, pan, and adjust the chart</span>
// // // // // // //         </div>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default CandlestickChart;
// // // // import React, { useRef, useMemo, useEffect } from 'react';
// // // // import {
// // // //   Chart as ChartJS,
// // // //   CategoryScale,
// // // //   LinearScale,
// // // //   TimeScale,
// // // //   Tooltip,
// // // //   Legend,
// // // // } from 'chart.js';
// // // // import { Chart } from 'react-chartjs-2';
// // // // import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
// // // // import zoomPlugin from 'chartjs-plugin-zoom';
// // // // import annotationPlugin from 'chartjs-plugin-annotation';
// // // // import 'chartjs-adapter-date-fns';

// // // // // Register all professional plugins
// // // // ChartJS.register(
// // // //   CategoryScale,
// // // //   LinearScale,
// // // //   TimeScale,
// // // //   Tooltip,
// // // //   Legend,
// // // //   CandlestickController,
// // // //   CandlestickElement,
// // // //   zoomPlugin,
// // // //   annotationPlugin
// // // // );

// // // // const CandlestickChart = ({ data, symbol = "BTC/USDT", currentPrice }) => {
// // // //   const chartRef = useRef(null);

// // // //   // 1. Ensure data is formatted exactly as the financial controller expects
// // // //   const formattedData = useMemo(() => {
// // // //     if (!data?.candles) return [];
// // // //     return data.candles.map(c => ({
// // // //       x: Number(c.x), // Timestamp
// // // //       o: Number(c.o), // Open
// // // //       h: Number(c.h), // High
// // // //       l: Number(c.l), // Low
// // // //       c: Number(c.c), // Close
// // // //     })).sort((a, b) => a.x - b.x);
// // // //   }, [data]);

// // // //   // 2. High-Performance Chart Configuration
// // // //   const chartConfig = {
// // // //     datasets: [
// // // //       {
// // // //         label: `${symbol} Live Price`,
// // // //         data: formattedData,
// // // //         borderColor: '#1e222d',
// // // //         candlestick: {
// // // //           color: {
// // // //             up: '#26a69a',    // Professional Teal
// // // //             down: '#ef5350',  // Professional Red
// // // //             unchanged: '#787b86',
// // // //           },
// // // //           wick: {
// // // //             color: {
// // // //               up: '#26a69a',
// // // //               down: '#ef5350',
// // // //             }
// // // //           }
// // // //         },
// // // //       },
// // // //     ],
// // // //   };

// // // //   const options = {
// // // //     responsive: true,
// // // //     maintainAspectRatio: false,
// // // //     animation: false, // Professional charts don't use "sliding" animations
// // // //     layout: {
// // // //       padding: { right: 50, bottom: 10 }
// // // //     },
// // // //     scales: {
// // // //       x: {
// // // //         type: 'time',
// // // //         grid: { color: 'rgba(42, 46, 57, 0.5)', drawBorder: false },
// // // //         ticks: { color: '#787b86', font: { size: 10 } },
// // // //       },
// // // //       y: {
// // // //         position: 'right',
// // // //         grid: { color: 'rgba(42, 46, 57, 0.5)', drawBorder: false },
// // // //         ticks: { color: '#d1d4dc', font: { size: 11 } },
// // // //       },
// // // //     },
// // // //     plugins: {
// // // //       legend: { display: false },
// // // //       tooltip: {
// // // //         enabled: true,
// // // //         mode: 'index',
// // // //         intersect: false,
// // // //         backgroundColor: '#1e222d',
// // // //         titleColor: '#787b86',
// // // //         bodyColor: '#d1d4dc',
// // // //         borderColor: '#363a45',
// // // //         borderWidth: 1,
// // // //       },
// // // //       // ZOOM & SCROLL LOGIC
// // // //       zoom: {
// // // //         pan: {
// // // //           enabled: true,
// // // //           mode: 'xy',
// // // //         },
// // // //         zoom: {
// // // //           wheel: { enabled: true, speed: 0.1 },
// // // //           pinch: { enabled: true },
// // // //           mode: 'xy',
// // // //         },
// // // //       },
// // // //       // LIVE PRICE HIGHLIGHTING
// // // //       annotation: {
// // // //         annotations: {
// // // //           line1: {
// // // //             type: 'line',
// // // //             yMin: currentPrice,
// // // //             yMax: currentPrice,
// // // //             borderColor: '#2962ff',
// // // //             borderWidth: 2,
// // // //             borderDash: [4, 4],
// // // //             label: {
// // // //               display: true,
// // // //               content: `Live: ${currentPrice?.toFixed(2)}`,
// // // //               position: 'end',
// // // //               backgroundColor: '#2962ff',
// // // //               color: '#fff',
// // // //               font: { size: 12, weight: 'bold' },
// // // //               padding: 6,
// // // //               xAdjust: 50
// // // //             },
// // // //           },
// // // //         },
// // // //       },
// // // //     },
// // // //   };

// // // //   return (
// // // //     <div style={containerStyle}>
// // // //       {/* PROFESSIONAL DASHBOARD HEADER */}
// // // //       <div style={headerStyle}>
// // // //         <div style={symbolInfo}>
// // // //           <span style={tickerText}>{symbol}</span>
// // // //           <span style={liveBadge}>● LIVE</span>
// // // //         </div>
        
// // // //         <div style={priceMetrics}>
// // // //           <div style={priceColumn}>
// // // //             <span style={label}>CURRENT PRICE</span>
// // // //             <span style={mainPrice(currentPrice, formattedData?.at(-1)?.o)}>
// // // //               ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
// // // //             </span>
// // // //           </div>
// // // //           <button onClick={() => chartRef.current.resetZoom()} style={resetBtn}>
// // // //             Reset View
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* THE CHART */}
// // // //       <div style={chartWrapper}>
// // // //         <Chart
// // // //           ref={chartRef}
// // // //           type="candlestick"
// // // //           data={chartConfig}
// // // //           options={options}
// // // //         />
// // // //       </div>

// // // //       {/* HUD (Heads Up Display) Overlay for Instructions */}
// // // //       <div style={instructions}>
// // // //         Scroll to zoom • Drag to pan • Hover for details
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- STYLES (Professional Dark Terminal Aesthetic) ---
// // // // const containerStyle = {
// // // //   backgroundColor: '#131722',
// // // //   height: '100vh',
// // // //   width: '100%',
// // // //   display: 'flex',
// // // //   flexDirection: 'column',
// // // //   fontFamily: "'Trebuchet MS', sans-serif",
// // // //   color: '#d1d4dc'
// // // // };

// // // // const headerStyle = {
// // // //   display: 'flex',
// // // //   justifyContent: 'space-between',
// // // //   padding: '15px 25px',
// // // //   borderBottom: '1px solid #2a2e39',
// // // //   alignItems: 'center'
// // // // };

// // // // const symbolInfo = { display: 'flex', alignItems: 'center', gap: '12px' };
// // // // const tickerText = { fontSize: '24px', fontWeight: 'bold', color: '#fff' };
// // // // const liveBadge = { fontSize: '10px', color: '#00ff00', letterSpacing: '1px' };

// // // // const priceMetrics = { display: 'flex', alignItems: 'center', gap: '30px' };
// // // // const priceColumn = { display: 'flex', flexDirection: 'column' };
// // // // const label = { fontSize: '10px', color: '#787b86', marginBottom: '4px' };
// // // // const mainPrice = (curr, prev) => ({
// // // //   fontSize: '22px',
// // // //   fontWeight: '600',
// // // //   color: curr >= prev ? '#26a69a' : '#ef5350'
// // // // });

// // // // const resetBtn = {
// // // //   backgroundColor: '#2962ff',
// // // //   color: '#fff',
// // // //   border: 'none',
// // // //   padding: '8px 16px',
// // // //   borderRadius: '4px',
// // // //   cursor: 'pointer',
// // // //   fontWeight: 'bold',
// // // //   fontSize: '12px'
// // // // };

// // // // const chartWrapper = {
// // // //   flex: 1,
// // // //   padding: '10px',
// // // //   cursor: 'crosshair'
// // // // };

// // // // const instructions = {
// // // //   fontSize: '11px',
// // // //   color: '#434651',
// // // //   padding: '8px',
// // // //   textAlign: 'center',
// // // //   borderTop: '1px solid #2a2e39'
// // // // };

// // // // export default CandlestickChart;


// // // import React, { useRef, useMemo, memo } from 'react';
// // // import {
// // //   Chart as ChartJS,
// // //   CategoryScale,
// // //   LinearScale,
// // //   TimeScale,
// // //   Tooltip,
// // //   Legend,
// // // } from 'chart.js';
// // // import { Chart } from 'react-chartjs-2';
// // // import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
// // // import annotationPlugin from 'chartjs-plugin-annotation';
// // // import 'chartjs-adapter-date-fns';

// // // // 1. REGISTER PLUGINS OUTSIDE THE COMPONENT (Crucial for performance)
// // // ChartJS.register(
// // //   CategoryScale,
// // //   LinearScale,
// // //   TimeScale,
// // //   Tooltip,
// // //   Legend,
// // //   CandlestickController,
// // //   CandlestickElement,
// // //   annotationPlugin
// // // );

// // // const CandlestickChart = ({ data, symbol, timeframe, currentPrice }) => {
// // //   const chartRef = useRef(null);

// // //   // 2. MEMOIZE DATA (Prevents the chart from re-drawing on every mouse move)
// // //   const chartData = useMemo(() => {
// // //     const dbCandles = data?.candles || [];
    
// // //     const formatted = dbCandles.map(c => ({
// // //       x: new Date(c.x).getTime(),
// // //       o: Number(c.o),
// // //       h: Number(c.h),
// // //       l: Number(c.l),
// // //       c: Number(c.c)
// // //     })).sort((a, b) => a.x - b.x);

// // //     return {
// // //       datasets: [{
// // //         label: symbol,
// // //         data: formatted,
// // //         candlestick: {
// // //           color: { up: '#00c853', down: '#ff5252', unchanged: '#78909c' },
// // //           wick: { color: { up: '#00c853', down: '#ff5252' } }
// // //         }
// // //       }]
// // //     };
// // //   }, [data?.candles, symbol]); // Only recalculate if the database data changes

// // //   // 3. MEMOIZE OPTIONS (This prevents the "Sticking" / Freezing)
// // //   const options = useMemo(() => ({
// // //     responsive: true,
// // //     maintainAspectRatio: false,
// // //     animation: false, // Performance: Disable animations for live data
// // //     parsing: false,   // Performance: Data is already parsed in useMemo
// // //     normalized: true, // Performance: Data is already sorted
// // //     scales: {
// // //       x: {
// // //         type: 'time',
// // //         grid: { color: 'rgba(255,255,255,0.05)' },
// // //         ticks: { color: '#b0bec5', source: 'auto' }
// // //       },
// // //       y: {
// // //         position: 'right',
// // //         grid: { color: 'rgba(255,255,255,0.05)' },
// // //         ticks: { color: '#b0bec5' }
// // //       }
// // //     },
// // //     plugins: {
// // //       legend: { display: false },
// // //       annotation: {
// // //         annotations: {
// // //           priceLine: {
// // //             type: 'line',
// // //             yMin: currentPrice,
// // //             yMax: currentPrice,
// // //             borderColor: '#4096ff',
// // //             borderWidth: 2,
// // //             borderDash: [5, 5],
// // //             label: {
// // //               display: true,
// // //               content: currentPrice?.toFixed(2),
// // //               position: 'end',
// // //               backgroundColor: '#4096ff',
// // //             }
// // //           }
// // //         }
// // //       }
// // //     }
// // //   }), [currentPrice]); // Only re-configures if price changes

// // //   return (
// // //     <div style={containerStyle}>
// // //       <div style={headerStyle}>
// // //         <span style={symbolStyle}>{symbol}</span>
// // //         <span style={priceStyle(currentPrice)}>
// // //           ${currentPrice?.toLocaleString() || '---'}
// // //         </span>
// // //       </div>
// // //       <div style={{ flex: 1 }}>
// // //         <Chart 
// // //           ref={chartRef}
// // //           type="candlestick" 
// // //           data={chartData} 
// // //           options={options} 
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // --- STATIC STYLES (Avoids object creation on every render) ---
// // // const containerStyle = {
// // //   height: '600px',
// // //   backgroundColor: '#0a1929',
// // //   display: 'flex',
// // //   flexDirection: 'column',
// // //   padding: '15px',
// // //   borderRadius: '8px',
// // //   overflow: 'hidden'
// // // };

// // // const headerStyle = {
// // //   display: 'flex',
// // //   justifyContent: 'space-between',
// // //   paddingBottom: '15px'
// // // };

// // // const symbolStyle = { color: '#fff', fontSize: '20px', fontWeight: 'bold' };

// // // const priceStyle = (price) => ({
// // //   color: '#4096ff',
// // //   fontSize: '20px',
// // //   fontWeight: 'bold'
// // // });

// // // // 4. WRAP IN MEMO (Final Performance Layer)
// // // export default memo(CandlestickChart);
// // import React, { useRef, useMemo, memo } from 'react';
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   TimeScale,
// //   Tooltip,
// //   Legend,
// // } from 'chart.js';
// // import 'chartjs-adapter-date-fns';
// // import { Chart } from 'react-chartjs-2';
// // import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
// // import annotationPlugin from 'chartjs-plugin-annotation';

// // // Register outside to prevent memory leaks and "sticking"
// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   TimeScale,
// //   Tooltip,
// //   Legend,
// //   CandlestickController,
// //   CandlestickElement,
// //   annotationPlugin
// // );

// // const CandlestickChart = ({ 
// //   data,          // Expecting: { candles: [...] }
// //   symbol,        // e.g., "AAPL"
// //   timeframe, 
// //   currentPrice   // Live price from your websocket/API
// // }) => {
// //   const chartRef = useRef(null);

// //   // --- THE REAL DATA ADAPTER ---
// //   const processedData = useMemo(() => {
// //     // 1. Strict check: If no data, return empty dataset (No dummy values!)
// //     if (!data || !data.candles || !Array.isArray(data.candles)) {
// //       console.warn(`No real data found for ${symbol}`);
// //       return { datasets: [] };
// //     }

// //     // 2. Map Database fields to Chart.js fields
// //     // This handles common database naming conventions (open/o, close/c, etc.)
// //     const formattedCandles = data.candles.map(item => {
// //       const timestamp = new Date(item.x || item.timestamp || item.date).getTime();
      
// //       return {
// //         x: timestamp,
// //         o: parseFloat(item.o || item.open),
// //         h: parseFloat(item.h || item.high),
// //         l: parseFloat(item.l || item.low),
// //         c: parseFloat(item.c || item.close),
// //       };
// //     })
// //     .filter(c => !isNaN(c.c)) // Remove any corrupted real data points
// //     .sort((a, b) => a.x - b.x); // Ensure correct chronological order

// //     return {
// //       datasets: [{
// //         label: `${symbol} Real Values`,
// //         data: formattedCandles,
// //         candlestick: {
// //           color: {
// //             up: '#26a69a',    // High-visibility exchange teal
// //             down: '#ef5350',  // High-visibility exchange red
// //             unchanged: '#787b86'
// //           },
// //           wick: { color: { up: '#26a69a', down: '#ef5350' } }
// //         }
// //       }]
// //     };
// //   }, [data, symbol]); // Recalculates only when database data for this stock changes

// //   // --- CHART CONFIGURATION ---
// //   const options = useMemo(() => ({
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     animation: false, 
// //     parsing: false,   
// //     normalized: true,
// //     layout: { padding: { right: 55 } },
// //     scales: {
// //       x: {
// //         type: 'time',
// //         grid: { color: '#1e222d' },
// //         ticks: { color: '#787b86', font: { size: 10 } }
// //       },
// //       y: {
// //         position: 'right',
// //         grid: { color: '#1e222d' },
// //         ticks: { 
// //           color: '#d1d4dc', 
// //           font: { size: 11 },
// //           callback: (value) => value.toLocaleString(undefined, { minimumFractionDigits: 2 })
// //         }
// //       }
// //     },
// //     plugins: {
// //       legend: { display: false },
// //       tooltip: {
// //         enabled: true,
// //         backgroundColor: '#1e222d',
// //         borderColor: '#363a45',
// //         borderWidth: 1,
// //         callbacks: {
// //           label: (ctx) => {
// //             const d = ctx.raw;
// //             return [
// //               ` O: ${d.o.toFixed(2)}`,
// //               ` H: ${d.h.toFixed(2)}`,
// //               ` L: ${d.l.toFixed(2)}`,
// //               ` C: ${d.c.toFixed(2)}`
// //             ];
// //           }
// //         }
// //       },
// //       annotation: {
// //         annotations: {
// //           currentPriceLine: {
// //             type: 'line',
// //             yMin: currentPrice,
// //             yMax: currentPrice,
// //             borderColor: '#2962ff',
// //             borderWidth: 1.5,
// //             borderDash: [4, 4],
// //             label: {
// //               display: true,
// //               content: currentPrice?.toFixed(2) || 'Loading...',
// //               position: 'end',
// //               backgroundColor: '#2962ff',
// //               color: '#fff',
// //               font: { size: 11, weight: 'bold' },
// //               xAdjust: 50
// //             }
// //           }
// //         }
// //       }
// //     }
// //   }), [currentPrice]);

// //   return (
// //     <div style={chartCardStyle}>
// //       <div style={headerStyle}>
// //         <div style={symbolBox}>
// //           <span style={symbolText}>{symbol}</span>
// //           <span style={timeframeText}>{timeframe}</span>
// //         </div>
// //         <div style={livePriceText(currentPrice, data?.candles?.at(-1)?.c)}>
// //           {currentPrice ? `$${currentPrice.toLocaleString()}` : 'Connecting...'}
// //         </div>
// //       </div>

// //       <div style={{ flex: 1, position: 'relative', cursor: 'crosshair' }}>
// //         <Chart 
// //           ref={chartRef}
// //           type="candlestick" 
// //           data={processedData} 
// //           options={options} 
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // // --- STYLES ---
// // const chartCardStyle = {
// //   height: '500px',
// //   backgroundColor: '#131722', // Standard TradingView Background
// //   display: 'flex',
// //   flexDirection: 'column',
// //   padding: '16px',
// //   borderRadius: '8px',
// //   border: '1px solid #363a45',
// //   marginBottom: '20px'
// // };

// // const headerStyle = {
// //   display: 'flex',
// //   justifyContent: 'space-between',
// //   alignItems: 'center',
// //   marginBottom: '15px'
// // };

// // const symbolBox = { display: 'flex', alignItems: 'baseline', gap: '8px' };
// // const symbolText = { color: '#fff', fontSize: '22px', fontWeight: 'bold' };
// // const timeframeText = { color: '#787b86', fontSize: '12px' };

// // const livePriceText = (curr, last) => ({
// //   fontSize: '22px',
// //   fontWeight: 'bold',
// //   color: curr >= last ? '#26a69a' : '#ef5350'
// // });

// // export default memo(CandlestickChart);
// import React, { useRef, useMemo, memo, useEffect, useState } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   TimeScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import 'chartjs-adapter-date-fns';
// import { Chart } from 'react-chartjs-2';
// import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
// import annotationPlugin from 'chartjs-plugin-annotation';

// // Register outside to prevent memory leaks and "sticking"
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   TimeScale,
//   Tooltip,
//   Legend,
//   CandlestickController,
//   CandlestickElement,
//   annotationPlugin
// );

// const CandlestickChart = ({ 
//   data,          // Historical candlestick data from API
//   symbol,        // e.g., "AAPL"
//   timeframe, 
//   currentPrice,  // Live price from websocket
//   isLoading = false
// }) => {
//   const chartRef = useRef(null);
//   const [localData, setLocalData] = useState([]);
//   const [yAxisRange, setYAxisRange] = useState({ min: 0, max: 100 });

//   // Calculate Y-axis range from data
//   const calculateYAxisRange = (candles) => {
//     if (!candles || candles.length === 0) {
//       return { min: 0, max: 100 };
//     }

//     let min = Number.MAX_VALUE;
//     let max = Number.MIN_VALUE;

//     candles.forEach(candle => {
//       const low = candle.l || candle.low || 0;
//       const high = candle.h || candle.high || 0;
      
//       min = Math.min(min, low);
//       max = Math.max(max, high);
//     });

//     // Add 5% padding to top and bottom for better visualization
//     const padding = (max - min) * 0.05;
//     return {
//       min: Math.max(0, min - padding), // Don't go below 0 for stock prices
//       max: max + padding
//     };
//   };

//   // Update local data when new historical data arrives
//   useEffect(() => {
//     if (data?.candles && Array.isArray(data.candles) && data.candles.length > 0) {
//       console.log(`📊 Received ${data.candles.length} candles for ${symbol}`);
//       const candles = data.candles;
//       setLocalData(candles);
//       setYAxisRange(calculateYAxisRange(candles));
//     }
//   }, [data, symbol]);

//   // Update Y-axis range when current price changes
//   useEffect(() => {
//     if (currentPrice && localData.length > 0) {
//       const range = calculateYAxisRange(localData);
//       // Include current price in range calculation
//       const newMin = Math.min(range.min, currentPrice);
//       const newMax = Math.max(range.max, currentPrice);
//       const padding = (newMax - newMin) * 0.05;
      
//       setYAxisRange({
//         min: Math.max(0, newMin - padding),
//         max: newMax + padding
//       });
//     }
//   }, [currentPrice, localData]);

//   // Get the latest close price for color comparison
//   const lastClose = useMemo(() => {
//     if (localData.length > 0) {
//       const lastCandle = localData[localData.length - 1];
//       return lastCandle.c || lastCandle.close || 0;
//     }
//     return currentPrice || 0;
//   }, [localData, currentPrice]);

//   // --- DATA PROCESSING ---
//   const processedData = useMemo(() => {
//     // 1. Use local data if available, otherwise use API data
//     const dataToUse = localData.length > 0 ? localData : (data?.candles || []);
    
//     // 2. Check if we have data
//     if (!dataToUse || dataToUse.length === 0) {
//       if (isLoading) {
//         console.log(`⏳ Waiting for data for ${symbol}...`);
//         return { datasets: [] };
//       }
//       console.warn(`⚠️ No data found for ${symbol}`);
//       return { datasets: [] };
//     }

//     console.log(`✅ Processing ${dataToUse.length} candles for ${symbol}`);

//     // 3. Map to Chart.js format
//     const formattedCandles = dataToUse
//       .map(item => {
//         try {
//           // Handle timestamp
//           let timestamp;
//           if (item.x) {
//             timestamp = new Date(item.x).getTime();
//           } else if (item.timestamp) {
//             timestamp = new Date(item.timestamp).getTime();
//           } else {
//             console.warn('No timestamp found for item:', item);
//             return null;
//           }

//           // Extract OHLC values
//           const open = parseFloat(item.o || item.open || 0);
//           const high = parseFloat(item.h || item.high || 0);
//           const low = parseFloat(item.l || item.low || 0);
//           const close = parseFloat(item.c || item.close || 0);

//           // Validate
//           if (isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
//             console.warn('Invalid data in item:', item);
//             return null;
//           }

//           return {
//             x: timestamp,
//             o: open,
//             h: high,
//             l: low,
//             c: close,
//             v: parseFloat(item.v || item.volume || 0),
//             // Store original for reference
//             _raw: item
//           };
//         } catch (error) {
//           console.warn('Error processing item:', error, item);
//           return null;
//         }
//       })
//       .filter(c => c !== null && c.x > 0)
//       .sort((a, b) => a.x - b.x);

//     if (formattedCandles.length === 0) {
//       console.warn('No valid candles after processing');
//       return { datasets: [] };
//     }

//     // Update Y-axis range based on processed data
//     const newRange = calculateYAxisRange(formattedCandles);
//     if (newRange.min !== yAxisRange.min || newRange.max !== yAxisRange.max) {
//       setTimeout(() => setYAxisRange(newRange), 0);
//     }

//     return {
//       datasets: [{
//         label: `${symbol} - ${timeframe}`,
//         data: formattedCandles,
//         color: {
//           up: '#26a69a',
//           down: '#ef5350',
//           unchanged: '#787b86'
//         },
//         borderColor: (ctx) => {
//           const item = ctx.dataset.data[ctx.dataIndex];
//           if (!item) return '#787b86';
//           return item.c >= item.o ? '#26a69a' : '#ef5350';
//         },
//         backgroundColor: (ctx) => {
//           const item = ctx.dataset.data[ctx.dataIndex];
//           if (!item) return '#787b86';
//           return item.c >= item.o ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
//         }
//       }]
//     };
//   }, [localData, data, symbol, timeframe, isLoading]);

//   // --- CHART CONFIGURATION ---
//   const options = useMemo(() => {
//     const baseOptions = {
//       responsive: true,
//       maintainAspectRatio: false,
//       animation: {
//         duration: 0
//       },
//       parsing: false,
//       normalized: true,
//       layout: { 
//         padding: { 
//           right: 55,
//           top: 20,
//           bottom: 20,
//           left: 20
//         } 
//       },
//       scales: {
//         x: {
//           type: 'time',
//           time: {
//             unit: timeframe === '1d' ? 'day' : 
//                   timeframe === '1h' ? 'hour' : 
//                   timeframe === '1m' ? 'minute' : 'hour',
//             displayFormats: {
//               minute: 'HH:mm',
//               hour: 'MMM dd HH:mm',
//               day: 'MMM dd'
//             },
//             tooltipFormat: 'MMM dd, yyyy HH:mm'
//           },
//           grid: { 
//             color: '#2a2e39',
//             drawBorder: false
//           },
//           ticks: { 
//             color: '#787b86', 
//             font: { size: 11 },
//             maxRotation: 0,
//             autoSkip: true,
//             maxTicksLimit: 8
//           },
//           border: {
//             display: false
//           },
//           offset: true
//         },
//         y: {
//           position: 'right',
//           type: 'linear',
//           grid: { 
//             color: '#2a2e39',
//             drawBorder: false
//           },
//           ticks: { 
//             color: '#d1d4dc', 
//             font: { size: 12 },
//             callback: (value) => {
//               if (typeof value !== 'number' || isNaN(value)) return '';
//               return value.toLocaleString(undefined, { 
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//               });
//             },
//             padding: 8,
//             autoSkip: true,
//             maxTicksLimit: 10
//           },
//           border: {
//             display: false
//           },
//           // FIX: Explicitly set min and max for proper scaling
//           min: yAxisRange.min,
//           max: yAxisRange.max,
//           // Allow the scale to be nice (round numbers)
//           beginAtZero: false
//         }
//       },
//       plugins: {
//         legend: { 
//           display: false 
//         },
//         tooltip: {
//           enabled: true,
//           backgroundColor: 'rgba(26, 29, 39, 0.95)',
//           borderColor: '#363a45',
//           borderWidth: 1,
//           titleColor: '#d1d4dc',
//           titleFont: { size: 12 },
//           bodyColor: '#fff',
//           bodyFont: { size: 12 },
//           padding: 12,
//           displayColors: false,
//           cornerRadius: 4,
//           callbacks: {
//             title: (context) => {
//               const date = new Date(context[0].parsed.x);
//               return date.toLocaleString('en-US', {
//                 month: 'short',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit'
//               });
//             },
//             label: (ctx) => {
//               const d = ctx.raw;
//               if (!d) return [];
              
//               const change = d.c - d.o;
//               const changePercent = d.o > 0 ? (change / d.o) * 100 : 0;
//               const volume = d.v ? (d.v / 1000000).toFixed(2) + 'M' : 'N/A';
              
//               return [
//                 `Open: $${d.o.toFixed(2)}`,
//                 `High: $${d.h.toFixed(2)}`,
//                 `Low: $${d.l.toFixed(2)}`,
//                 `Close: $${d.c.toFixed(2)}`,
//                 `Change: ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`,
//                 `Volume: ${volume}`
//               ];
//             }
//           }
//         },
//         annotation: currentPrice ? {
//           annotations: {
//             currentPriceLine: {
//               type: 'line',
//               yMin: currentPrice,
//               yMax: currentPrice,
//               borderColor: '#2962ff',
//               borderWidth: 1.5,
//               borderDash: [4, 4],
//               label: {
//                 display: true,
//                 content: `$${currentPrice.toFixed(2)}`,
//                 position: 'end',
//                 backgroundColor: '#2962ff',
//                 color: '#fff',
//                 font: { 
//                   size: 11, 
//                   weight: 'bold' 
//                 },
//                 padding: {
//                   x: 8,
//                   y: 4
//                 },
//                 borderRadius: 4,
//                 xAdjust: 50,
//                 yAdjust: 0
//               }
//             }
//           }
//         } : {}
//       },
//       interaction: {
//         intersect: false,
//         mode: 'index'
//       },
//       // FIX: Ensure the chart updates when data changes
//       transition: {
//         duration: 0
//       }
//     };

//     return baseOptions;
//   }, [currentPrice, timeframe, yAxisRange]);

//   // --- RENDER LOGIC ---
//   const hasData = processedData.datasets.length > 0 && 
//                   processedData.datasets[0].data.length > 0;

//   return (
//     <div style={chartCardStyle}>
//       <div style={headerStyle}>
//         <div style={symbolBox}>
//           <span style={symbolText}>{symbol || 'N/A'}</span>
//           <span style={timeframeText}>{timeframe || '1h'}</span>
//           {data?.summary?.change !== undefined && (
//             <span style={{
//               ...changeTextStyle,
//               color: data.summary.change >= 0 ? '#26a69a' : '#ef5350',
//               backgroundColor: data.summary.change >= 0 ? 'rgba(38, 166, 154, 0.1)' : 'rgba(239, 83, 80, 0.1)'
//             }}>
//               {data.summary.change >= 0 ? '+' : ''}{data.summary.change?.toFixed(2) || '0.00'} 
//               ({data.summary.changePercent?.toFixed(2) || '0.00'}%)
//             </span>
//           )}
//         </div>
//         <div style={livePriceText(currentPrice, lastClose)}>
//           {currentPrice ? `$${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Loading...'}
//           {currentPrice && lastClose && (
//             <span style={priceChangeStyle(currentPrice, lastClose)}>
//               {currentPrice >= lastClose ? '▲' : '▼'}
//             </span>
//           )}
//         </div>
//       </div>

//       <div style={chartContainerStyle}>
//         {isLoading ? (
//           <div style={loadingStyle}>
//             <div style={loadingSpinner}></div>
//             <div style={loadingText}>Loading chart data...</div>
//           </div>
//         ) : !hasData ? (
//           <div style={noDataStyle}>
//             <div style={noDataIcon}>📊</div>
//             <div style={noDataText}>No historical data available</div>
//             <div style={noDataSubText}>
//               {symbol ? `Waiting for data for ${symbol}` : 'Select a symbol to view chart'}
//             </div>
//             {currentPrice && (
//               <div style={currentPriceInfo}>
//                 Current Price: <span style={{ fontWeight: 'bold' }}>${currentPrice.toFixed(2)}</span>
//               </div>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Debug info (remove in production) */}
//             <div style={debugInfoStyle}>
//               Y-Axis Range: ${yAxisRange.min.toFixed(2)} - ${yAxisRange.max.toFixed(2)} | 
//               Data Points: {processedData.datasets[0].data.length}
//             </div>
//             <Chart 
//               ref={chartRef}
//               type="candlestick" 
//               data={processedData} 
//               options={options} 
//               style={{ width: '100%', height: 'calc(100% - 20px)' }}
//             />
//           </>
//         )}
//       </div>

//       {hasData && data?.summary && (
//         <div style={summaryStyle}>
//           <div style={summaryItem}>
//             <span style={summaryLabel}>Open</span>
//             <span style={summaryValue}>${data.summary.open?.toFixed(2) || '0.00'}</span>
//           </div>
//           <div style={summaryItem}>
//             <span style={summaryLabel}>High</span>
//             <span style={summaryValue}>${data.summary.high?.toFixed(2) || '0.00'}</span>
//           </div>
//           <div style={summaryItem}>
//             <span style={summaryLabel}>Low</span>
//             <span style={summaryValue}>${data.summary.low?.toFixed(2) || '0.00'}</span>
//           </div>
//           <div style={summaryItem}>
//             <span style={summaryLabel}>Vol</span>
//             <span style={summaryValue}>
//               {data.summary.volume ? (data.summary.volume / 1000000).toFixed(2) + 'M' : '0'}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- STYLES ---
// const chartCardStyle = {
//   height: '500px',
//   backgroundColor: '#131722',
//   display: 'flex',
//   flexDirection: 'column',
//   padding: '16px',
//   borderRadius: '8px',
//   border: '1px solid #363a45',
//   marginBottom: '20px',
//   overflow: 'hidden',
//   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
// };

// const headerStyle = {
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: '15px',
//   paddingBottom: '12px',
//   borderBottom: '1px solid #363a45'
// };

// const symbolBox = { 
//   display: 'flex', 
//   alignItems: 'center', 
//   gap: '12px',
//   flexWrap: 'wrap'
// };

// const symbolText = { 
//   color: '#fff', 
//   fontSize: '22px', 
//   fontWeight: 'bold',
//   fontFamily: 'Arial, sans-serif'
// };

// const timeframeText = { 
//   color: '#787b86', 
//   fontSize: '12px',
//   backgroundColor: '#2a2e39',
//   padding: '4px 10px',
//   borderRadius: '4px',
//   fontWeight: '500'
// };

// const changeTextStyle = {
//   fontSize: '12px',
//   fontWeight: 'bold',
//   padding: '4px 10px',
//   borderRadius: '4px',
//   fontFamily: 'monospace'
// };

// const livePriceText = (curr, last) => ({
//   fontSize: '22px',
//   fontWeight: 'bold',
//   color: curr >= last ? '#26a69a' : '#ef5350',
//   display: 'flex',
//   alignItems: 'center',
//   gap: '8px',
//   fontFamily: 'Arial, sans-serif'
// });

// const priceChangeStyle = (curr, last) => ({
//   fontSize: '16px',
//   marginLeft: '4px'
// });

// const chartContainerStyle = {
//   flex: 1,
//   position: 'relative',
//   minHeight: '400px',
//   width: '100%'
// };

// const debugInfoStyle = {
//   position: 'absolute',
//   top: '0',
//   left: '0',
//   right: '0',
//   backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   color: '#fff',
//   fontSize: '10px',
//   padding: '2px 8px',
//   zIndex: 100,
//   fontFamily: 'monospace'
// };

// const loadingStyle = {
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   alignItems: 'center',
//   height: '100%',
//   width: '100%',
//   backgroundColor: '#131722'
// };

// const loadingSpinner = {
//   width: '40px',
//   height: '40px',
//   border: '3px solid #363a45',
//   borderTop: '3px solid #2962ff',
//   borderRadius: '50%',
//   animation: 'spin 1s linear infinite',
//   marginBottom: '16px'
// };

// const loadingText = {
//   color: '#787b86',
//   fontSize: '14px'
// };

// const noDataStyle = {
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   alignItems: 'center',
//   height: '100%',
//   width: '100%',
//   backgroundColor: '#131722',
//   color: '#787b86',
//   padding: '40px'
// };

// const noDataIcon = {
//   fontSize: '48px',
//   marginBottom: '16px',
//   opacity: 0.5
// };

// const noDataText = {
//   fontSize: '16px',
//   fontWeight: 'bold',
//   marginBottom: '8px',
//   color: '#d1d4dc'
// };

// const noDataSubText = {
//   fontSize: '14px',
//   textAlign: 'center',
//   marginBottom: '20px',
//   maxWidth: '300px',
//   lineHeight: '1.5'
// };

// const currentPriceInfo = {
//   fontSize: '14px',
//   color: '#787b86',
//   backgroundColor: '#2a2e39',
//   padding: '8px 16px',
//   borderRadius: '6px',
//   marginTop: '10px'
// };

// const summaryStyle = {
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: '12px 16px',
//   backgroundColor: '#1e222d',
//   borderRadius: '6px',
//   marginTop: '15px',
//   border: '1px solid #363a45'
// };

// const summaryItem = {
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   flex: 1
// };

// const summaryLabel = {
//   fontSize: '11px',
//   color: '#787b86',
//   marginBottom: '4px',
//   textTransform: 'uppercase',
//   letterSpacing: '0.5px'
// };

// const summaryValue = {
//   fontSize: '13px',
//   fontWeight: 'bold',
//   color: '#d1d4dc',
//   fontFamily: 'monospace'
// };

// // Add CSS animation for spinner
// if (typeof document !== 'undefined') {
//   const styleSheet = document.createElement('style');
//   styleSheet.innerHTML = `
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//   `;
//   document.head.appendChild(styleSheet);
// }

// export default memo(CandlestickChart);