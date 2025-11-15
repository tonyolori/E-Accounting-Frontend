import React from 'react';
import { Edit, Trash2, Calendar, DollarSign, Building2, FileText, Clock, Hash } from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { Button } from '../ui/button';

interface TransactionDetailProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TransactionDetail({ transaction, onEdit, onDelete }: TransactionDetailProps) {
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'WITHDRAWAL':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'TRANSFER':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Deposit';
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
      case 'WITHDRAWAL':
        return `-${formatCurrency(amount)}`;
      case 'TRANSFER':
        return formatCurrency(amount);
      default:
        return formatCurrency(amount);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{getTypeLabel(transaction.type)}</h2>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTransactionColor(transaction.type)}`}>
              {transaction.type}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={onDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Transaction Amount */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <div className={`text-4xl font-bold mb-2 ${getTransactionColor(transaction.type).split(' ')[0]}`}>
            {getAmountDisplay(transaction.type, transaction.amount)}
          </div>
          <div className="text-sm text-gray-500">Transaction Amount</div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Information</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Hash className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                <dd className="text-sm text-gray-900 font-mono">{transaction.id}</dd>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Transaction Date</dt>
                <dd className="text-sm text-gray-900">{formatDate(transaction.date)}</dd>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Balance After Transaction</dt>
                <dd className="text-sm text-gray-900">{formatCurrency(transaction.balance)}</dd>
              </div>
            </div>
            {transaction.investment && (
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Investment</dt>
                  <dd className="text-sm text-gray-900">
                    {transaction.investment.name} ({transaction.investment.type})
                  </dd>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(transaction.createdAt)}</dd>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(transaction.updatedAt)}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center text-lg font-medium text-gray-900 mb-4">
          <FileText className="h-5 w-5 mr-2" />
          Description
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">
          {transaction.description || 'No description provided'}
        </p>
      </div>

      {/* Transaction Impact */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{getTypeLabel(transaction.type)}</div>
            <div className="text-sm text-gray-500">Transaction Type</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTransactionColor(transaction.type).split(' ')[0]}`}>
              {getAmountDisplay(transaction.type, transaction.amount)}
            </div>
            <div className="text-sm text-gray-500">Amount</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(transaction.balance)}</div>
            <div className="text-sm text-gray-500">Resulting Balance</div>
          </div>
        </div>
      </div>
    </div>
  );
}
