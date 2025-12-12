import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MarketDepthChart = ({ symbol, currentPrice }) => {
  // Generate mock market depth data
  const generateDepthData = () => {
    const bids = [];
    const asks = [];
    const levels = 20;
    const spread = currentPrice * 0.02; // 2% spread
    
    // Generate bids (below current price)
    for (let i = levels; i > 0; i--) {
      const price = currentPrice - (spread * (i / levels));
      const volume = Math.random() * 1000 * i;
      bids.push({ price, volume });
    }
    
    // Generate asks (above current price)
    for (let i = 1; i <= levels; i++) {
      const price = currentPrice + (spread * (i / levels));
      const volume = Math.random() * 1000 * i;
      asks.push({ price, volume });
    }
    
    return { bids, asks };
  };

  const { bids, asks } = generateDepthData();
  
  const data = {
    labels: [
      ...bids.map(b => b.price.toFixed(2)).reverse(),
      'Current',
      ...asks.map(a => a.price.toFixed(2))
    ],
    datasets: [
      {
        label: 'Bids',
        data: [
          ...bids.map(b => b.volume).reverse(),
          0,
          ...new Array(asks.length).fill(0)
        ],
        backgroundColor: 'rgba(38, 166, 154, 0.7)',
        borderColor: 'rgb(38, 166, 154)',
        borderWidth: 1
      },
      {
        label: 'Asks',
        data: [
          ...new Array(bids.length).fill(0),
          0,
          ...asks.map(a => a.volume)
        ],
        backgroundColor: 'rgba(239, 83, 80, 0.7)',
        borderColor: 'rgb(239, 83, 80)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: `${symbol} Market Depth`,
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label;
            const value = context.parsed.x;
            const price = data.labels[context.dataIndex];
            return `${label}: ${value.toFixed(0)} @ $${price}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Volume'
        }
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value, index) => {
            if (index === bids.length) return 'Current';
            return `$${data.labels[index]}`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MarketDepthChart;