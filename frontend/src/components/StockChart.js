// import React, { useEffect, useState, useRef } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';
// import { Line, Bar } from 'react-chartjs-2';
// import { format, subHours, parseISO } from 'date-fns';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const StockChart = ({ symbol, chartData, chartType = 'line', timeframe = '1h' }) => {
//   const [chartOptions, setChartOptions] = useState({});
//   const [chartDataset, setChartDataset] = useState(null);
//   const chartRef = useRef(null);

//   // Format timeframe for display
//   const getTimeframeLabel = () => {
//     switch(timeframe) {
//       case '5m': return '5 Minutes';
//       case '15m': return '15 Minutes';
//       case '1h': return '1 Hour';
//       case '24h': return '24 Hours';
//       default: return '1 Hour';
//     }
//   };

//   // Prepare data for Chart.js
//   useEffect(() => {
//     if (!chartData || !chartData.historical || chartData.historical.length === 0) {
//       return;
//     }

//     const historicalData = chartData.historical;
//     const currentPrice = chartData.current?.price;

//     // Prepare labels (timestamps)
//     const labels = historicalData.map(item => {
//       const date = new Date(item.timestamp);
//       if (timeframe === '5m' || timeframe === '15m') {
//         return format(date, 'HH:mm');
//       }
//       return format(date, 'HH:mm');
//     });

//     // Prepare datasets based on chart type
//     let datasets = [];

//     if (chartType === 'line' || chartType === 'area') {
//       datasets = [
//         {
//           label: `${symbol} Price`,
//           data: historicalData.map(item => item.close || item.price),
//           borderColor: currentPrice >= historicalData[0]?.price ? '#28a745' : '#dc3545',
//           backgroundColor: chartType === 'area' 
//             ? currentPrice >= historicalData[0]?.price 
//               ? 'rgba(40, 167, 69, 0.1)' 
//               : 'rgba(220, 53, 69, 0.1)'
//             : 'transparent',
//           borderWidth: 2,
//           pointRadius: historicalData.length > 20 ? 1 : 3,
//           pointBackgroundColor: currentPrice >= historicalData[0]?.price ? '#28a745' : '#dc3545',
//           fill: chartType === 'area',
//           tension: 0.1
//         }
//       ];
//     } else if (chartType === 'candlestick') {
//       datasets = [
//         {
//           label: 'Price Range',
//           data: historicalData.map(item => ({
//             x: new Date(item.timestamp),
//             o: item.open,
//             h: item.high,
//             l: item.low,
//             c: item.close
//           })),
//           backgroundColor: historicalData.map(item => 
//             item.close >= item.open ? 'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)'
//           ),
//           borderColor: historicalData.map(item => 
//             item.close >= item.open ? '#28a745' : '#dc3545'
//           ),
//           borderWidth: 1
//         }
//       ];
//     }

//     setChartDataset({
//       labels,
//       datasets
//     });

//     // Configure chart options
//     setChartOptions({
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: 'top',
//           display: true,
//           labels: {
//             font: {
//               size: 12
//             }
//           }
//         },
//         title: {
//           display: true,
//           text: `${symbol} - ${getTimeframeLabel()} Chart`,
//           font: {
//             size: 16,
//             weight: 'bold'
//           }
//         },
//         tooltip: {
//           mode: 'index',
//           intersect: false,
//           callbacks: {
//             label: (context) => {
//               let label = context.dataset.label || '';
//               if (label) {
//                 label += ': ';
//               }
//               if (context.parsed.y !== null) {
//                 label += `$${context.parsed.y.toFixed(2)}`;
                
//                 // For candlestick charts, show OHLC data
//                 if (chartType === 'candlestick' && context.raw) {
//                   label += ` (O: $${context.raw.o.toFixed(2)}, H: $${context.raw.h.toFixed(2)}, L: $${context.raw.l.toFixed(2)}, C: $${context.raw.c.toFixed(2)})`;
//                 }
//               }
//               return label;
//             }
//           }
//         }
//       },
//       scales: {
//         x: {
//           grid: {
//             display: false
//           },
//           ticks: {
//             maxTicksLimit: 10,
//             font: {
//               size: 11
//             }
//           }
//         },
//         y: {
//           position: 'right',
//           grid: {
//             color: 'rgba(0, 0, 0, 0.05)'
//           },
//           ticks: {
//             callback: (value) => `$${value.toFixed(2)}`,
//             font: {
//               size: 11
//             }
//           }
//         }
//       },
//       interaction: {
//         intersect: false,
//         mode: 'nearest'
//       },
//       animation: {
//         duration: 300
//       }
//     });

//   }, [chartData, symbol, chartType, timeframe]);

//   // Handle no data state
//   if (!chartData || !chartData.historical || chartData.historical.length === 0) {
//     return (
//       <div style={{
//         height: '300px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#f8f9fa',
//         borderRadius: '8px',
//         border: '1px dashed #dee2e6'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <p style={{ color: '#6c757d', marginBottom: '10px' }}>
//             No historical data available for {symbol}
//           </p>
//           <p style={{ fontSize: '14px', color: '#999' }}>
//             Data will appear after the next price update
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ height: '300px', position: 'relative' }}>
//       {chartType === 'candlestick' ? (
//         <Bar
//           ref={chartRef}
//           data={chartDataset}
//           options={chartOptions}
//         />
//       ) : (
//         <Line
//           ref={chartRef}
//           data={chartDataset}
//           options={chartOptions}
//         />
//       )}
      
//       <div style={{
//         position: 'absolute',
//         top: '10px',
//         right: '10px',
//         display: 'flex',
//         gap: '5px',
//         zIndex: 10
//       }}>
//         <span style={{
//           padding: '2px 8px',
//           backgroundColor: chartData.current?.change >= 0 ? '#28a745' : '#dc3545',
//           color: 'white',
//           borderRadius: '4px',
//           fontSize: '12px',
//           fontWeight: '600'
//         }}>
//           {chartData.current?.change >= 0 ? '+' : ''}{chartData.current?.change?.toFixed(2)} 
//           ({chartData.current?.changePercent?.toFixed(2)}%)
//         </span>
//       </div>
//     </div>
//   );
// };

// export default StockChart;
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ symbol, chartData, timeframe = '1h' }) => {
  // If no data, show loading/empty state
  if (!chartData || !chartData.historical || chartData.historical.length === 0) {
    return (
      <div style={{
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: '15px', color: '#666' }}>
          Loading chart data for {symbol}...
        </p>
        <p style={{ fontSize: '12px', color: '#999' }}>
          This may take a moment on first load
        </p>
      </div>
    );
  }

  const historicalData = chartData.historical;
  const currentPrice = chartData.current?.price || 0;
  
  // Prepare labels (timestamps)
  const labels = historicalData.map(item => {
    const date = new Date(item.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Prepare data points
  const dataPoints = historicalData.map(item => item.price || item.close || 0);

  // Chart data configuration
  const data = {
    labels,
    datasets: [
      {
        label: `${symbol} Price`,
        data: dataPoints,
        borderColor: currentPrice >= dataPoints[0] ? '#28a745' : '#dc3545',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        borderWidth: 2,
        pointRadius: historicalData.length > 30 ? 1 : 3,
        pointBackgroundColor: currentPrice >= dataPoints[0] ? '#28a745' : '#dc3545',
        fill: true,
        tension: 0.2
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `${symbol} - ${timeframe} Chart`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `$${context.parsed.y.toFixed(2)}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 10,
          font: {
            size: 11
          }
        }
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`,
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Line data={data} options={options} />
      
      {/* Current price indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '5px 10px',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
        fontSize: '14px',
        fontWeight: 'bold',
        color: currentPrice >= dataPoints[0] ? '#28a745' : '#dc3545'
      }}>
        ${currentPrice.toFixed(2)}
      </div>
      
      {/* Data point count */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        fontSize: '12px',
        color: '#666'
      }}>
        {historicalData.length} data points
      </div>
    </div>
  );
};

export default StockChart;