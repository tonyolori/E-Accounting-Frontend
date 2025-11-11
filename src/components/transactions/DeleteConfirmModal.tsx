import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { transactionService } from '../../services/transactionService';
import { Button } from '../ui/button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({ isOpen, onClose, transaction, onSuccess }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!transaction) return;

    setIsDeleting(true);
    setError(null);

    try {
      await transactionService.deleteTransaction(transaction.id);
      onSuccess();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setError('Failed to delete transaction. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Delete Transaction
          </h3>

          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            
            {/* Transaction Summary */}
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Type:</span>
                  <span className="text-sm text-gray-900">{getTypeLabel(transaction.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Amount:</span>
                  <span className="text-sm text-gray-900">{getAmountDisplay(transaction.type, transaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Date:</span>
                  <span className="text-sm text-gray-900">{formatDate(transaction.date)}</span>
                </div>
                {transaction.investment && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Investment:</span>
                    <span className="text-sm text-gray-900">{transaction.investment.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Description:</span>
                  <span className="text-sm text-gray-900 truncate max-w-32" title={transaction.description}>
                    {transaction.description}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                'Delete Transaction'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
