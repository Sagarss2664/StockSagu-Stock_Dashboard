import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceChart = ({ portfolioData, benchmark = 'SPY' }) => {
  // Generate performance data
  const generatePerformanceData = () => {
    const days = 30;
    const portfolioValues = [];
    const benchmarkValues = [];
    
    let portfolioValue = 10000; // Starting value
    let benchmarkValue = 10000;
    
    for (let i = 0; i < days; i++) {
      // Portfolio return (random with some correlation to benchmark)
      const marketReturn = (Math.random() - 0.5) * 0.03;
      const alpha = (Math.random() - 0.5) * 0.01;
      portfolioValue *= (1 + marketReturn + alpha);
      portfolioValues.push(portfolioValue);
      
      // Benchmark return
      benchmarkValue *= (1 + marketReturn);
      benchmarkValues.push(benchmarkValue);
    }
    
    return { portfolioValues, benchmarkValues };
  };

  const { portfolioValues, benchmarkValues } = generatePerformanceData();
  const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: 'Your Portfolio',
        data: portfolioValues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1
      },
      {
        label: `Benchmark (${benchmark})`,
        data: benchmarkValues,
        borderColor: 'rgb(107, 114, 128)',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Portfolio Performance (30 Days)',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label;
            const value = context.parsed.y;
            const returnPct = ((value / 10000 - 1) * 100).toFixed(2);
            return `${label}: $${value.toFixed(2)} (${returnPct}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value.toFixed(0)}`
        },
        title: {
          display: true,
          text: 'Portfolio Value'
        }
      }
    }
  };

  // Calculate statistics
  const finalValue = portfolioValues[portfolioValues.length - 1];
  const totalReturn = ((finalValue / 10000 - 1) * 100).toFixed(2);
  const volatility = calculateVolatility(portfolioValues);
  const sharpeRatio = (totalReturn / volatility).toFixed(2);

  return (
    <div>
      <div style={{ height: '250px', marginBottom: '20px' }}>
        <Line data={data} options={options} />
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
        marginTop: '20px'
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Return</div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: totalReturn >= 0 ? '#26a69a' : '#ef5350'
          }}>
            {totalReturn}%
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Final Value</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            ${finalValue.toFixed(2)}
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Volatility</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {volatility.toFixed(2)}%
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Sharpe Ratio</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {sharpeRatio}
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateVolatility(values) {
  const returns = [];
  for (let i = 1; i < values.length; i++) {
    returns.push((values[i] - values[i-1]) / values[i-1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * 100; // Convert to percentage
}

export default PerformanceChart;