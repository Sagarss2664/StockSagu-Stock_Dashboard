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