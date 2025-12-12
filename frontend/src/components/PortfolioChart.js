import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { chartAPI } from '../api/api';
import { STOCK_COLORS } from '../utils/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioChart = ({ subscriptions, stockPrices }) => {
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    if (!subscriptions || subscriptions.length === 0 || !stockPrices) {
      return;
    }

    // Calculate portfolio distribution
    const validStocks = subscriptions.filter(symbol => stockPrices[symbol]);
    
    if (validStocks.length === 0) return;

    const data = {
      labels: validStocks,
      datasets: [
        {
          label: 'Portfolio Distribution',
          data: validStocks.map(symbol => stockPrices[symbol].price),
          backgroundColor: validStocks.map(symbol => STOCK_COLORS[symbol] || '#007bff'),
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 15
        }
      ]
    };

    setPortfolioData(data);
  }, [subscriptions, stockPrices]);

  if (!portfolioData || subscriptions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Portfolio Overview</h3>
        <p style={{ color: '#666', marginTop: '10px' }}>
          {subscriptions.length === 0 
            ? 'Subscribe to stocks to see portfolio distribution'
            : 'Loading portfolio data...'
          }
        </p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px' }}>Portfolio Distribution</h3>
      <div style={{ height: '250px', position: 'relative' }}>
        <Doughnut data={portfolioData} options={options} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Stocks</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{subscriptions.length}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Value</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            ${Object.values(stockPrices)
              .filter((_, index) => subscriptions[index])
              .reduce((sum, priceData) => sum + (priceData?.price || 0), 0)
              .toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;