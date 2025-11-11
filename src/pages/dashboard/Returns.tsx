import React from 'react';
import { TrendingUp, Calculator } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function Returns() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Returns</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track investment returns and calculate future projections.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Returns
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <TrendingUp className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No returns data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Returns tracking will appear here once you have active investments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
