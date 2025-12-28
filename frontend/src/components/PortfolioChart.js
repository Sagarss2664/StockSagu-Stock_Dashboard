import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { STOCK_COLORS } from '../utils/constants';
import { getStockInfo } from '../utils/stockLogos';
import './PortfolioChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioChart = ({ subscriptions, stockPrices }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0 || !stockPrices) {
      return null;
    }

    const validStocks = subscriptions.filter(symbol => stockPrices[symbol]);
    
    if (validStocks.length === 0) return null;

    const totalValue = validStocks.reduce(
      (sum, symbol) => sum + (stockPrices[symbol]?.price || 0), 
      0
    );

    const stocksWithMetrics = validStocks.map(symbol => {
      const price = stockPrices[symbol]?.price || 0;
      const change = stockPrices[symbol]?.change || 0;
      const percentage = totalValue > 0 ? (price / totalValue) * 100 : 0;
      
      return {
        symbol,
        price,
        change,
        percentage,
        info: getStockInfo(symbol)
      };
    });

    // Sort by percentage (largest first)
    stocksWithMetrics.sort((a, b) => b.percentage - a.percentage);

    const averageChange = validStocks.reduce(
      (sum, symbol) => sum + (stockPrices[symbol]?.change || 0), 
      0
    ) / validStocks.length;

    const positiveStocks = validStocks.filter(
      symbol => (stockPrices[symbol]?.change || 0) >= 0
    ).length;

    return {
      totalValue,
      stockCount: validStocks.length,
      averageChange,
      positiveStocks,
      stocksWithMetrics
    };
  }, [subscriptions, stockPrices]);

  useEffect(() => {
    if (!portfolioMetrics) {
      setPortfolioData(null);
      return;
    }

    const { stocksWithMetrics } = portfolioMetrics;

    const data = {
      labels: stocksWithMetrics.map(s => s.symbol),
      datasets: [
        {
          label: 'Portfolio Distribution',
          data: stocksWithMetrics.map(s => s.price),
          backgroundColor: stocksWithMetrics.map(
            s => STOCK_COLORS[s.symbol] || s.info.color || '#0072E5'
          ),
          borderColor: '#FFFFFF',
          borderWidth: 3,
          hoverOffset: 8,
          hoverBorderWidth: 4
        }
      ]
    };

    setPortfolioData(data);
  }, [portfolioMetrics]);

  const handleSegmentClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const stock = portfolioMetrics.stocksWithMetrics[index];
      setSelectedStock(stock);
    }
  };

  if (!portfolioMetrics || subscriptions.length === 0) {
    return (
      <div className="portfolio-chart">
        <div className="pc-header">
          <div className="pc-title-section">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="pc-icon">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
            <div>
              <h2 className="pc-title">Portfolio Overview</h2>
              <p className="pc-subtitle">Track your portfolio distribution</p>
            </div>
          </div>
        </div>

        <div className="pc-empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <h3 className="pc-empty-title">No Portfolio Data</h3>
          <p className="pc-empty-text">
            {subscriptions.length === 0 
              ? 'Subscribe to stocks to visualize your portfolio distribution and track performance metrics.'
              : 'Loading portfolio data...'
            }
          </p>
        </div>
      </div>
    );
  }

  const { totalValue, stockCount, averageChange, positiveStocks, stocksWithMetrics } = portfolioMetrics;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleSegmentClick,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#FFFFFF',
        bodyColor: '#E2E8F0',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
        callbacks: {
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / totalValue) * 100).toFixed(1);
            return [
              `Value: $${value.toFixed(2)}`,
              `Share: ${percentage}%`
            ];
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  return (
    <div className="portfolio-chart">
      {/* Header */}
      <div className="pc-header">
        <div className="pc-title-section">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="pc-icon">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
          </svg>
          <div>
            <h2 className="pc-title">Portfolio Distribution</h2>
            <p className="pc-subtitle">Real-time allocation breakdown</p>
          </div>
        </div>
        <div className={`pc-performance-badge ${averageChange >= 0 ? 'positive' : 'negative'}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            {averageChange >= 0 ? (
              <path d="M6 2L10 8H2z"/>
            ) : (
              <path d="M6 10L2 4h8z"/>
            )}
          </svg>
          {averageChange >= 0 ? '+' : ''}{averageChange.toFixed(2)}%
        </div>
      </div>

      {/* Chart Section */}
   <div className="pc-chart-container">
  <div className="pc-chart-wrapper">
    {portfolioData ? (
      <>
        <Doughnut data={portfolioData} options={chartOptions} />
        <div className="pc-chart-center">
          <div className="pc-center-value">${totalValue.toFixed(2)}</div>
          <div className="pc-center-label">Total Value</div>
        </div>
      </>
    ) : (
      <div className="pc-chart-placeholder">
        <div className="pc-chart-center">
          <div className="pc-center-value">$--.--</div>
          <div className="pc-center-label">Loading...</div>
        </div>
      </div>
    )}
  </div>
</div>

      {/* Metrics Grid */}
      <div className="pc-metrics">
        <div className="pc-metric-item">
          <div className="pc-metric-icon stocks">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 3h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z"/>
            </svg>
          </div>
          <div className="pc-metric-content">
            <div className="pc-metric-label">Total Stocks</div>
            <div className="pc-metric-value">{stockCount}</div>
          </div>
        </div>

        <div className="pc-metric-item">
          <div className="pc-metric-icon value">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.5 1a.5.5 0 00-1 0v1h-1a.5.5 0 000 1h1v1a.5.5 0 001 0V3h1a.5.5 0 000-1h-1V1zM3 7a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
            </svg>
          </div>
          <div className="pc-metric-content">
            <div className="pc-metric-label">Avg Change</div>
            <div className={`pc-metric-value ${averageChange >= 0 ? 'positive' : 'negative'}`}>
              {averageChange >= 0 ? '+' : ''}{averageChange.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="pc-metric-item">
          <div className="pc-metric-icon performance">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 12l3-3 2 2 5-5"/>
              <circle cx="13" cy="6" r="2"/>
            </svg>
          </div>
          <div className="pc-metric-content">
            <div className="pc-metric-label">Positive</div>
            <div className="pc-metric-value">{positiveStocks}/{stockCount}</div>
          </div>
        </div>
      </div>

      {/* Stock Breakdown */}
      <div className="pc-breakdown">
        <div className="pc-breakdown-header">
          <h3 className="pc-breakdown-title">Holdings Breakdown</h3>
          <span className="pc-breakdown-count">{stockCount} stocks</span>
        </div>
        <div className="pc-breakdown-list">
          {stocksWithMetrics.map((stock, index) => (
            <div 
              key={stock.symbol} 
              className={`pc-breakdown-item ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
              onClick={() => setSelectedStock(stock)}
            >
              <div className="pc-breakdown-rank">{index + 1}</div>
              <div 
                className="pc-breakdown-color" 
                style={{ 
                  backgroundColor: STOCK_COLORS[stock.symbol] || stock.info.color || '#0072E5' 
                }}
              ></div>
              <div className="pc-breakdown-info">
                {stock.info.logo && (
                  <img 
                    src={stock.info.logo} 
                    alt={stock.symbol} 
                    className="pc-breakdown-logo"
                  />
                )}
                <div className="pc-breakdown-details">
                  <div className="pc-breakdown-symbol">{stock.symbol}</div>
                  <div className="pc-breakdown-percentage">{stock.percentage.toFixed(1)}%</div>
                </div>
              </div>
              <div className="pc-breakdown-values">
                <div className="pc-breakdown-price">${stock.price.toFixed(2)}</div>
                <div className={`pc-breakdown-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Tip */}
      <div className="pc-footer">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="7" cy="7" r="6"/>
          <path d="M7 5v4M7 3h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Click on a segment or stock to view detailed information</span>
      </div>
    </div>
  );
};

export default PortfolioChart;