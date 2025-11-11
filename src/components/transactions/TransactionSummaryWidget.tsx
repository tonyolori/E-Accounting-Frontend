import React from 'react';
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight, DollarSign, Hash, TrendingUp } from 'lucide-react';
import { TransactionSummary } from '../../types/transaction';

interface TransactionSummaryWidgetProps {
  summary: TransactionSummary;
}

export default function TransactionSummaryWidget({ summary }: TransactionSummaryWidgetProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {/* Total Transactions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Hash className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Transactions
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatNumber(summary.totalTransactions)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Total Deposits */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowDownRight className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Deposits
                </dt>
                <dd className="text-lg font-medium text-green-600">
                  {formatCurrency(summary.totalDeposits)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Total Withdrawals */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowUpRight className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Withdrawals
                </dt>
                <dd className="text-lg font-medium text-red-600">
                  {formatCurrency(summary.totalWithdrawals)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Total Transfers */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowLeftRight className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Transfers
                </dt>
                <dd className="text-lg font-medium text-blue-600">
                  {formatCurrency(summary.totalTransfers)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Net Amount */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className={`h-6 w-6 ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Net Amount
                </dt>
                <dd className={`text-lg font-medium ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.netAmount >= 0 ? '+' : ''}{formatCurrency(summary.netAmount)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Average Transaction */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Average Amount
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(summary.averageTransaction)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
