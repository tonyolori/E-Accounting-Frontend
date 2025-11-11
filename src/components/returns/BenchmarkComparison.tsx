import React from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { InvestmentPerformance } from '../../types/returns';

interface BenchmarkComparisonProps {
  performances: InvestmentPerformance[];
}

export default function BenchmarkComparison({ performances }: BenchmarkComparisonProps) {
  const benchmarks = [
    { name: 'S&P 500', return: 12.5 },
    { name: 'NASDAQ', return: 15.2 },
    { name: '10-Year Treasury', return: 4.8 },
  ];

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Benchmark Comparison</h3>
      
      <div className="space-y-4">
        {benchmarks.map((benchmark) => (
          <div key={benchmark.name} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{benchmark.name}</h4>
              <span className={`font-semibold ${benchmark.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(benchmark.return)}
              </span>
            </div>
            
            <div className="space-y-2">
              {performances.map((perf) => {
                const outperformance = perf.yearlyReturn - benchmark.return;
                const isOutperforming = outperformance > 0;
                
                return (
                  <div key={perf.investmentId} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{perf.investmentName}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${isOutperforming ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercent(outperformance)}
                      </span>
                      {isOutperforming ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
