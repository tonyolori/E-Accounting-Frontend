import React from 'react';
import { TrendingUp, DollarSign, Target, Award, TrendingDown } from 'lucide-react';
import { PerformanceAnalytics } from '../../types/returns';

interface PerformanceOverviewProps {
  analytics: PerformanceAnalytics;
}

export default function PerformanceOverview({ analytics }: PerformanceOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Portfolio Value */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Portfolio Value
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(analytics.totalValue)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Total Returns */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {analytics.totalReturns >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Returns
                </dt>
                <dd className={`text-lg font-medium ${analytics.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.totalReturns >= 0 ? '+' : ''}{formatCurrency(analytics.totalReturns)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Average Return Rate */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Average Return Rate
                </dt>
                <dd className={`text-lg font-medium ${analytics.averageReturnRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(analytics.averageReturnRate)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Best Performer */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Best Performer
                </dt>
                <dd className="text-sm font-medium text-gray-900 truncate">
                  {analytics.bestPerformer.name}
                </dd>
                <dd className="text-sm text-green-600">
                  {formatPercent(analytics.bestPerformer.returnRate)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
