import React from 'react';
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
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Chart } from 'react-chartjs-2';

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
  Filler
);

const TechnicalChart = ({ data, symbol, timeframe, indicator = 'rsi' }) => {
  
  const getIndicatorData = () => {
    if (!data?.candles || !data?.indicators) {
      return { datasets: [] };
    }

    const candles = data.candles;
    
    switch(indicator) {
      case 'rsi':
        return getRSIData(candles, data.indicators);
      case 'macd':
        return getMACDData(candles, data.indicators);
      case 'volume':
        return getVolumeData(candles);
      default:
        return getRSIData(candles, data.indicators);
    }
  };

  const getRSIData = (candles, indicators) => {
    // Generate RSI-like data
    const rsiData = candles.map((candle, index) => ({
      x: new Date(candle.x).getTime(),
      y: 50 + Math.sin(index / 10) * 20 + (Math.random() - 0.5) * 10
    }));

    return {
      datasets: [
        {
          label: 'RSI',
          data: rsiData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1
        },
        {
          label: 'Overbought (70)',
          data: rsiData.map(d => ({ x: d.x, y: 70 })),
          borderColor: 'rgba(239, 83, 80, 0.5)',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Oversold (30)',
          data: rsiData.map(d => ({ x: d.x, y: 30 })),
          borderColor: 'rgba(38, 166, 154, 0.5)',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    };
  };

  const getMACDData = (candles, indicators) => {
    const macdData = candles.map((candle, index) => ({
      x: new Date(candle.x).getTime(),
      macd: Math.sin(index / 20) * 2 + (Math.random() - 0.5) * 0.5,
      signal: Math.cos(index / 20) * 1.5 + (Math.random() - 0.5) * 0.3,
      histogram: Math.sin(index / 20) * 1 - Math.cos(index / 20) * 0.5
    }));

    return {
      datasets: [
        {
          label: 'MACD',
          data: macdData.map(d => ({ x: d.x, y: d.macd })),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        },
        {
          label: 'Signal',
          data: macdData.map(d => ({ x: d.x, y: d.signal })),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        },
        {
          label: 'Histogram',
          data: macdData.map(d => ({ x: d.x, y: d.histogram })),
          type: 'bar',
          backgroundColor: macdData.map(d => d.histogram >= 0 ? 
            'rgba(38, 166, 154, 0.6)' : 'rgba(239, 83, 80, 0.6)'),
          borderColor: macdData.map(d => d.histogram >= 0 ? 
            'rgb(38, 166, 154)' : 'rgb(239, 83, 80)'),
          borderWidth: 1
        }
      ]
    };
  };

  const getVolumeData = (candles) => {
    const volumeData = candles.map(candle => ({
      x: new Date(candle.x).getTime(),
      y: candle.v || 0
    }));

    return {
      datasets: [
        {
          label: 'Volume',
          data: volumeData,
          type: 'bar',
          backgroundColor: candles.map(c => 
            c.c >= c.o ? 'rgba(38, 166, 154, 0.6)' : 'rgba(239, 83, 80, 0.6)'),
          borderColor: candles.map(c => 
            c.c >= c.o ? 'rgb(38, 166, 154)' : 'rgb(239, 83, 80)'),
          borderWidth: 1
        }
      ]
    };
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
        text: `${symbol} - ${indicator.toUpperCase()} (${timeframe})`,
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour'
        }
      },
      y: {
        beginAtZero: indicator === 'volume'
      }
    }
  };

  return (
    <div style={{ height: '250px' }}>
      <Chart type='line' data={getIndicatorData()} options={options} />
    </div>
  );
};

export default TechnicalChart;