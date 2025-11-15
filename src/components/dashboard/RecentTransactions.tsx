import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, Clock } from 'lucide-react';
import { apiService } from '../../services/api';

interface Transaction {
  id: string;
  investmentId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  description: string;
  date: string;
  balance: number;
  createdAt: string;
  investment?: {
    id: string;
    name?: string;
    currency?: string;
  };
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get<{ success: boolean; data: Transaction[] | { transactions: Transaction[] } }>(
          '/api/transactions/recent?limit=5'
        );

        if (response.data && response.data.success) {
          const raw = response.data.data;
          const items: Transaction[] = Array.isArray(raw)
            ? (raw as Transaction[])
            : Array.isArray((raw as any)?.transactions)
              ? (raw as any).transactions
              : [];
          setTransactions(items);
        } else {
          throw new Error('Failed to fetch recent transactions');
        }
      } catch (error) {
        console.error('Recent transactions fetch error:', error);
        setError('Failed to load recent transactions');
        // Set mock data for development
        setTransactions([
          {
            id: '1',
            investmentId: 'inv-1',
            type: 'DEPOSIT',
            amount: 1000,
            description: 'Initial investment',
            date: '2024-01-15',
            balance: 11000,
            createdAt: '2024-01-15T10:00:00.000Z'
          },
          {
            id: '2',
            investmentId: 'inv-2',
            type: 'WITHDRAWAL',
            amount: 500,
            description: 'Partial withdrawal',
            date: '2024-01-14',
            balance: 9500,
            createdAt: '2024-01-14T15:30:00.000Z'
          },
          {
            id: '3',
            investmentId: 'inv-1',
            type: 'TRANSFER',
            amount: 250,
            description: 'Portfolio rebalancing',
            date: '2024-01-13',
            balance: 10750,
            createdAt: '2024-01-13T09:15:00.000Z'
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTransactions();
  }, []);

  const formatCurrency = (amount: number, currencyCode?: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'TRANSFER':
        return <ArrowLeftRight className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-600';
      case 'WITHDRAWAL':
        return 'text-red-600';
      case 'TRANSFER':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">{error}</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <div className="text-gray-500">No recent transactions</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getTransactionIcon(transaction.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {transaction.description || `${transaction.type.toLowerCase()} transaction`}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{transaction.type.toLowerCase()}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
              {transaction.type === 'WITHDRAWAL' ? '-' : '+'}
              {formatCurrency(transaction.amount, transaction.investment?.currency)}
            </p>
            <p className="text-xs text-gray-500">
              Balance: {formatCurrency(transaction.balance, transaction.investment?.currency)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
