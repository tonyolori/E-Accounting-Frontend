import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import { AnalyticsWidget } from '../../types/reports';

interface AnalyticsDashboardProps {
  widgets: AnalyticsWidget[];
}

export default function AnalyticsDashboard({ widgets }: AnalyticsDashboardProps) {
  // Mock widgets if none provided
  const mockWidgets = [
    {
      id: '1',
      title: 'Portfolio Growth',
      type: 'CHART' as const,
      data: { value: '+12.5%', trend: 'up' },
      size: 'MEDIUM' as const,
      position: { x: 0, y: 0 }
    },
    {
      id: '2',
      title: 'Active Investments',
      type: 'METRIC_CARD' as const,
      data: { value: 8, label: 'investments' },
      size: 'SMALL' as const,
      position: { x: 1, y: 0 }
    }
  ];

  const displayWidgets = widgets.length > 0 ? widgets : mockWidgets;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard</h3>
      
      {displayWidgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayWidgets.map((widget) => (
            <div key={widget.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">{widget.title}</h4>
                {widget.type === 'CHART' && <BarChart3 className="h-4 w-4 text-gray-400" />}
                {widget.type === 'METRIC_CARD' && <TrendingUp className="h-4 w-4 text-gray-400" />}
                {widget.type === 'TREND' && <Activity className="h-4 w-4 text-gray-400" />}
                {widget.type === 'TABLE' && <PieChart className="h-4 w-4 text-gray-400" />}
              </div>
              
              <div className="text-2xl font-bold text-gray-900">
                {widget.data?.value || 'N/A'}
              </div>
              
              {widget.data?.label && (
                <div className="text-sm text-gray-500">{widget.data.label}</div>
              )}
              
              {widget.data?.trend && (
                <div className={`text-xs ${widget.data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {widget.data.trend === 'up' ? '↗' : '↘'} Trending {widget.data.trend}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-sm font-medium text-gray-900">No analytics widgets</h4>
          <p className="text-sm text-gray-500 mt-1">
            Analytics widgets will appear here once configured.
          </p>
        </div>
      )}
    </div>
  );
}
