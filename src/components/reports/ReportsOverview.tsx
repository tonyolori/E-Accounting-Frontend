import React from 'react';
import { FileText, Calendar, Clock, TrendingUp } from 'lucide-react';

interface ReportsOverviewProps {
  analytics: {
    totalReports: number;
    scheduledReports: number;
    recentReports: any[];
    popularTemplates: any[];
  };
}

export default function ReportsOverview({ analytics }: ReportsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Reports
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {analytics.totalReports}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Scheduled Reports
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {analytics.scheduledReports}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Recent Reports
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {analytics.recentReports.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Templates
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {analytics.popularTemplates.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
