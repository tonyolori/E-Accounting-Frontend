import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function Transactions() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track all your financial transactions across investments.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your transaction history will appear here once you start making transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
