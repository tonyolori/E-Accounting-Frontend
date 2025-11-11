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
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { InvestmentPerformance } from '../../types/returns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  performances: InvestmentPerformance[];
}

export default function PerformanceChart({ performances }: PerformanceChartProps) {
  const colors = [
    'rgb(59, 130, 246)',   // Blue
    'rgb(16, 185, 129)',   // Green
    'rgb(245, 158, 11)',   // Yellow
    'rgb(239, 68, 68)',    // Red
    'rgb(139, 92, 246)',   // Purple
  ];

  const data = {
    labels: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'],
    datasets: performances.map((perf, index) => ({
      label: perf.investmentName,
      data: [
        perf.dailyReturn,
        perf.weeklyReturn,
        perf.monthlyReturn,
        perf.quarterlyReturn,
        perf.yearlyReturn
      ],
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      tension: 0.4,
    }))
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y?.toFixed(2) || '0'}%`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time Period'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Return (%)'
        },
        ticks: {
          callback: function(value) {
            return Number(value).toFixed(1) + '%';
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}
