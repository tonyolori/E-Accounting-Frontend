import React from 'react';
import { TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { Investment } from '../../types/investment';

interface ReturnProjectionsProps {
  investments: Investment[];
}

export default function ReturnProjections({ investments }: ReturnProjectionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(1)}%`;
  };

  const calculateProjection = (investment: Investment, years: number, returnRate: number) => {
    return investment.currentBalance * Math.pow(1 + returnRate / 100, years);
  };

  const projectionScenarios = [
    { name: 'Conservative', rate: 6, color: 'text-blue-600' },
    { name: 'Moderate', rate: 10, color: 'text-green-600' },
    { name: 'Aggressive', rate: 15, color: 'text-purple-600' },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Return Projections (5 Years)</h3>
      
      {investments.length > 0 ? (
        <div className="space-y-6">
          {investments.slice(0, 3).map((investment) => (
            <div key={investment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">{investment.name}</h4>
                  <p className="text-sm text-gray-500">
                    Current: {formatCurrency(investment.currentBalance)}
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projectionScenarios.map((scenario) => {
                  const projectedValue = calculateProjection(investment, 5, scenario.rate);
                  const totalGain = projectedValue - investment.currentBalance;
                  
                  return (
                    <div key={scenario.name} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        {scenario.name} ({formatPercent(scenario.rate)})
                      </div>
                      <div className={`text-lg font-semibold ${scenario.color}`}>
                        {formatCurrency(projectedValue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        +{formatCurrency(totalGain)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-sm font-medium text-gray-900">No projections available</h4>
          <p className="text-sm text-gray-500 mt-1">
            Add investments to see return projections.
          </p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
          <div className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These projections are estimates based on historical data and should not be considered as investment advice. Actual returns may vary significantly.
          </div>
        </div>
      </div>
    </div>
  );
}
