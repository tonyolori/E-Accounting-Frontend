import React from 'react';
import { Eye, Edit, Trash2, ArrowDownRight, ArrowUpRight, ArrowLeftRight, Calendar, Building2 } from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { Button } from '../ui/button';

interface TransactionCardProps {
  transaction: Transaction;
  onView: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionCard({ transaction, onView, onEdit, onDelete }: TransactionCardProps) {
  const currencyCode = (transaction.investment?.currency as string) || 'NGN';
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownRight className="h-5 w-5 text-green-600" />;
      case 'RETURN':
        return <ArrowDownRight className="h-5 w-5 text-green-600" />;
      case 'DIVIDEND':
        return <ArrowDownRight className="h-5 w-5 text-green-600" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      case 'TRANSFER':
        return <ArrowLeftRight className="h-5 w-5 text-blue-600" />;
      default:
        return <ArrowLeftRight className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-600';
      case 'RETURN':
        return 'text-green-600';
      case 'DIVIDEND':
        return 'text-green-600';
      case 'WITHDRAWAL':
        return 'text-red-600';
      case 'TRANSFER':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Deposit';
      case 'RETURN':
        return 'Return';
      case 'DIVIDEND':
        return 'Dividend';
      case 'WITHDRAWAL':
        return 'Withdrawal';
      case 'TRANSFER':
        return 'Transfer';
      default:
        return type;
    }
  };

  const getAmountDisplay = (type: Transaction['type'], amount: number) => {
    switch (type) {
      case 'DEPOSIT':
        return `+${formatCurrency(amount)}`;
      case 'RETURN':
        return `+${formatCurrency(amount)}`;
      case 'DIVIDEND':
        return `+${formatCurrency(amount)}`;
      case 'WITHDRAWAL':
        return `-${formatCurrency(amount)}`;
      case 'TRANSFER':
        return formatCurrency(amount);
      default:
        return formatCurrency(amount);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Left side - Transaction info */}
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              {getTransactionIcon(transaction.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getTypeLabel(transaction.type)}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 ${getTransactionColor(transaction.type)}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                  {getAmountDisplay(transaction.type, transaction.amount)}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {transaction.description || 'No description provided'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(transaction.transactionDate)}</span>
                </div>
                
                {transaction.investment && (
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span className="truncate">{transaction.investment.name}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="font-medium">Balance: {formatCurrency(transaction.balance)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView(transaction);
              }}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(transaction);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(transaction);
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer with metadata */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Transaction ID: {transaction.id}</span>
          <span>Created {formatDate(transaction.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
