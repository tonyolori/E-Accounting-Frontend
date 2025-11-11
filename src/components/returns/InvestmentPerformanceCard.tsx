import React from 'react';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { InvestmentPerformance } from '../../types/returns';

interface InvestmentPerformanceCardProps {
  performance: InvestmentPerformance;
}

export default function InvestmentPerformanceCard({ performance }: InvestmentPerformanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const isPositive = performance.totalReturnRate >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{performance.investmentName}</h3>
            <p className="text-sm text-gray-500">{performance.investmentType}</p>
          </div>
          <div className="flex items-center">
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-green-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600" />
            )}
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Current Value</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(performance.currentValue)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Return</div>
            <div className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(performance.totalReturn)}
            </div>
          </div>
        </div>

        {/* Return Rate */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Return Rate</span>
            <span className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(performance.totalReturnRate)}
            </span>
          </div>
        </div>

        {/* Period Returns */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <div className="text-gray-500">Monthly</div>
            <div className={`font-medium ${performance.monthlyReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(performance.monthlyReturn)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Quarterly</div>
            <div className={`font-medium ${performance.quarterlyReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(performance.quarterlyReturn)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Yearly</div>
            <div className={`font-medium ${performance.yearlyReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(performance.yearlyReturn)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Volatility: {performance.metrics.volatility.toFixed(1)}%</span>
          <span>Sharpe: {performance.metrics.sharpeRatio.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
