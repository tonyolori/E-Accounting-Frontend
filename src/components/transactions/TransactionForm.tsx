import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { 
  Transaction, 
  CreateTransactionData, 
  TRANSACTION_TYPE_OPTIONS 
} from '../../types/transaction';
import { Investment } from '../../types/investment';
import { transactionService } from '../../services/transactionService';

interface TransactionFormProps {
  transaction?: Transaction;
  investments: Investment[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransactionForm({ transaction, investments, onSuccess, onCancel }: TransactionFormProps) {
  const isEditMode = !!transaction;
  
  const [formData, setFormData] = useState({
    investmentId: transaction?.investmentId || '',
    type: transaction?.type || 'DEPOSIT',
    amount: transaction?.amount?.toString() || '',
    description: transaction?.description || '',
    date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.investmentId) {
      newErrors.investmentId = 'Investment is required';
    }

    if (!formData.type) {
      newErrors.type = 'Transaction type is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Transaction date is required';
    } else {
      const transactionDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (transactionDate > today) {
        newErrors.date = 'Transaction date cannot be in the future';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: CreateTransactionData = {
        investmentId: formData.investmentId,
        type: formData.type as any,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        date: formData.date,
      };

      if (isEditMode && transaction) {
        await transactionService.updateTransaction(transaction.id, submitData);
      } else {
        await transactionService.createTransaction(submitData);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      setErrors({ submit: 'Failed to save transaction. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedInvestment = investments.find(inv => inv.id === formData.investmentId);
  const currencyCode = (selectedInvestment?.currency as string) || 'NGN';
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-600">{errors.submit}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investment Selection */}
        <div className="md:col-span-2">
          <Label htmlFor="investmentId">Investment *</Label>
          <Select
            id="investmentId"
            options={[
              { value: '', label: 'Select an investment' },
              ...investments.map(inv => ({ value: inv.id, label: `${inv.name} (${inv.category})` }))
            ]}
            value={formData.investmentId}
            onChange={(e) => handleInputChange('investmentId', e.target.value)}
            className={errors.investmentId ? 'border-red-300' : ''}
            required
          />
          {errors.investmentId && <p className="text-sm text-red-600 mt-1">{errors.investmentId}</p>}
          {selectedInvestment && (
            <p className="text-sm text-gray-500 mt-2">
              Current balance: {formatCurrency(selectedInvestment.currentBalance)}
            </p>
          )}
        </div>

        {/* Transaction Type */}
        <div>
          <Label htmlFor="type">Transaction Type *</Label>
          <Select
            id="type"
            options={TRANSACTION_TYPE_OPTIONS}
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className={errors.type ? 'border-red-300' : ''}
            required
          />
          {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount">Amount ({currencyCode}) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="0.00"
            className={errors.amount ? 'border-red-300' : ''}
            required
          />
          {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
        </div>

        {/* Transaction Date */}
        <div className="md:col-span-2">
          <Label htmlFor="date">Transaction Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={errors.date ? 'border-red-300' : ''}
            required
          />
          {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter transaction description"
            className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.description ? 'border-red-300' : ''
            }`}
            required
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Transaction Type Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Transaction Type Information:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Deposit:</strong> Add money to your investment (increases balance)</p>
          <p><strong>Withdrawal:</strong> Remove money from your investment (decreases balance)</p>
          <p><strong>Transfer:</strong> Move money between investments or accounts</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditMode ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            isEditMode ? 'Update Transaction' : 'Create Transaction'
          )}
        </Button>
      </div>
    </form>
  );
}
