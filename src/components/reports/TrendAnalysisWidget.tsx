import React from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { TrendAnalysis } from '../../types/reports';

interface TrendAnalysisWidgetProps {
  trend: TrendAnalysis;
}

export default function TrendAnalysisWidget({ trend }: TrendAnalysisWidgetProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const isPositive = trend.change >= 0;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{trend.metric}</h4>
        {isPositive ? (
          <TrendingUp className="h-6 w-6 text-green-600" />
        ) : (
          <TrendingDown className="h-6 w-6 text-red-600" />
        )}
      </div>

      <div className="space-y-4">
        {/* Current Value */}
        <div>
          <div className="text-sm text-gray-500">Current Value</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(trend.currentValue)}
          </div>
        </div>

        {/* Change */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Change</div>
            <div className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{formatCurrency(trend.change)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Percentage</div>
            <div className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(trend.changePercent)}
            </div>
          </div>
        </div>

        {/* Prediction */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center mb-2">
            <Target className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Prediction</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Next Period</div>
              <div className="text-lg font-semibold text-blue-600">
                {formatCurrency(trend.prediction.nextPeriod)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Confidence</div>
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(trend.prediction.confidence * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center pt-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            trend.trend === 'UP' ? 'bg-green-100 text-green-800' :
            trend.trend === 'DOWN' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {trend.trend === 'UP' && <TrendingUp className="h-3 w-3 mr-1" />}
            {trend.trend === 'DOWN' && <TrendingDown className="h-3 w-3 mr-1" />}
            Trending {trend.trend.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
