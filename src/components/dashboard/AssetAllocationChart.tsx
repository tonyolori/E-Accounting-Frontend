import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AssetAllocationChartProps {
  data: {
    [key: string]: number;
  };
}

export default function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  const colors = [
    'rgb(59, 130, 246)',   // Blue
    'rgb(16, 185, 129)',   // Green
    'rgb(245, 158, 11)',   // Yellow
    'rgb(239, 68, 68)',    // Red
    'rgb(139, 92, 246)',   // Purple
    'rgb(236, 72, 153)',   // Pink
  ];

  const chartData = {
    labels: Object.keys(data).map(key => {
      // Format the asset type names
      return key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: colors.slice(0, Object.keys(data).length),
        borderColor: colors.slice(0, Object.keys(data).length),
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}%`;
          },
        },
      },
    },
    cutout: '60%',
  };

  const totalValue = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <div className="relative">
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
      
      {/* Center text showing total */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalValue}%</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>
      
      {/* Asset breakdown */}
      <div className="mt-4 grid grid-cols-1 gap-2">
        {Object.entries(data).map(([key, value], index) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="text-gray-700">
                {key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <span className="font-medium text-gray-900">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
