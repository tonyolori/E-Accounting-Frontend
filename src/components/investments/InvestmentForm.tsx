import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { 
  Investment, 
  CreateInvestmentData, 
  INVESTMENT_TYPE_OPTIONS, 
  INVESTMENT_STATUS_OPTIONS 
} from '../../types/investment';
import { investmentService } from '../../services/investmentService';

interface InvestmentFormProps {
  investment?: Investment;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InvestmentForm({ investment, onSuccess, onCancel }: InvestmentFormProps) {
  const isEditMode = !!investment;
  
  const [formData, setFormData] = useState({
    name: investment?.name || '',
    type: investment?.type || '',
    initialAmount: investment?.initialAmount?.toString() || '',
    currentBalance: investment?.currentBalance?.toString() || '',
    maturityDate: investment?.maturityDate ? investment.maturityDate.split('T')[0] : '',
    returnRate: investment?.returnRate?.toString() || '',
    status: investment?.status || 'ACTIVE',
    description: investment?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Investment name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Investment type is required';
    }

    if (!formData.initialAmount || parseFloat(formData.initialAmount) <= 0) {
      newErrors.initialAmount = 'Initial amount must be greater than 0';
    }

    if (isEditMode && (!formData.currentBalance || parseFloat(formData.currentBalance) <= 0)) {
      newErrors.currentBalance = 'Current balance must be greater than 0';
    }

    if (!formData.maturityDate) {
      newErrors.maturityDate = 'Maturity date is required';
    } else {
      const maturityDate = new Date(formData.maturityDate);
      const today = new Date();
      if (maturityDate <= today) {
        newErrors.maturityDate = 'Maturity date must be in the future';
      }
    }

    if (!formData.returnRate || parseFloat(formData.returnRate) < 0) {
      newErrors.returnRate = 'Return rate must be 0 or greater';
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
      const submitData: CreateInvestmentData = {
        name: formData.name.trim(),
        type: formData.type as any,
        initialAmount: parseFloat(formData.initialAmount),
        maturityDate: formData.maturityDate,
        returnRate: parseFloat(formData.returnRate),
        description: formData.description.trim() || undefined,
      };

      if (isEditMode && investment) {
        await investmentService.updateInvestment(investment.id, {
          ...submitData,
          currentBalance: parseFloat(formData.currentBalance),
          status: formData.status as any,
        });
      } else {
        await investmentService.createInvestment(submitData);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save investment:', error);
      setErrors({ submit: 'Failed to save investment. Please try again.' });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-600">{errors.submit}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investment Name */}
        <div className="md:col-span-2">
          <Label htmlFor="name">Investment Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter investment name"
            className={errors.name ? 'border-red-300' : ''}
            required
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Investment Type */}
        <div>
          <Label htmlFor="type">Investment Type *</Label>
          <Select
            id="type"
            options={INVESTMENT_TYPE_OPTIONS}
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            placeholder="Select investment type"
            className={errors.type ? 'border-red-300' : ''}
            required
          />
          {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
        </div>

        {/* Status (Edit mode only) */}
        {isEditMode && (
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              options={INVESTMENT_STATUS_OPTIONS}
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              placeholder="Select status"
            />
          </div>
        )}

        {/* Initial Amount */}
        <div>
          <Label htmlFor="initialAmount">Initial Amount ($) *</Label>
          <Input
            id="initialAmount"
            type="number"
            step="0.01"
            min="0"
            value={formData.initialAmount}
            onChange={(e) => handleInputChange('initialAmount', e.target.value)}
            placeholder="0.00"
            className={errors.initialAmount ? 'border-red-300' : ''}
            required
          />
          {errors.initialAmount && <p className="text-sm text-red-600 mt-1">{errors.initialAmount}</p>}
        </div>

        {/* Current Balance (Edit mode only) */}
        {isEditMode && (
          <div>
            <Label htmlFor="currentBalance">Current Balance ($) *</Label>
            <Input
              id="currentBalance"
              type="number"
              step="0.01"
              min="0"
              value={formData.currentBalance}
              onChange={(e) => handleInputChange('currentBalance', e.target.value)}
              placeholder="0.00"
              className={errors.currentBalance ? 'border-red-300' : ''}
              required
            />
            {errors.currentBalance && <p className="text-sm text-red-600 mt-1">{errors.currentBalance}</p>}
          </div>
        )}

        {/* Maturity Date */}
        <div>
          <Label htmlFor="maturityDate">Maturity Date *</Label>
          <Input
            id="maturityDate"
            type="date"
            value={formData.maturityDate}
            onChange={(e) => handleInputChange('maturityDate', e.target.value)}
            className={errors.maturityDate ? 'border-red-300' : ''}
            required
          />
          {errors.maturityDate && <p className="text-sm text-red-600 mt-1">{errors.maturityDate}</p>}
        </div>

        {/* Return Rate */}
        <div>
          <Label htmlFor="returnRate">Expected Return Rate (%) *</Label>
          <Input
            id="returnRate"
            type="number"
            step="0.01"
            min="0"
            value={formData.returnRate}
            onChange={(e) => handleInputChange('returnRate', e.target.value)}
            placeholder="0.00"
            className={errors.returnRate ? 'border-red-300' : ''}
            required
          />
          {errors.returnRate && <p className="text-sm text-red-600 mt-1">{errors.returnRate}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter investment description (optional)"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
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
            isEditMode ? 'Update Investment' : 'Create Investment'
          )}
        </Button>
      </div>
    </form>
  );
}
