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
    category: investment?.category || '',
    initialAmount: investment?.initialAmount?.toString() || '',
    currentBalance: investment?.currentBalance?.toString() || '',
    StartDate: investment?.StartDate ? investment.StartDate.split('T')[0] : '',
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

    if (!formData.category) {
      newErrors.category = 'Investment category is required';
    }

    if (!formData.initialAmount || parseFloat(formData.initialAmount) <= 0) {
      newErrors.initialAmount = 'Initial amount must be greater than 0';
    }

    if (isEditMode && (!formData.currentBalance || parseFloat(formData.currentBalance) <= 0)) {
      newErrors.currentBalance = 'Current balance must be greater than 0';
    }

    if (!formData.StartDate) {
      newErrors.StartDate = 'Start date is required';
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
        category: formData.category as any,
        initialAmount: parseFloat(formData.initialAmount),
        startDate: formData.StartDate,
        returnRate: parseFloat(formData.returnRate),
        returnType: 'FIXED',//get this from the form,
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

        {/* Investment Category */}
        <div>
          <Label htmlFor="type">Investment Category *</Label>
          <Select
            id="type"
            options={INVESTMENT_TYPE_OPTIONS}
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="Select investment Category"
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

        {/* Start Date */}
        <div>
          <Label htmlFor="StartDate">Start Date *</Label>
          <Input
            id="StartDate"
            type="date"
            value={formData.StartDate}
            onChange={(e) => handleInputChange('StartDate', e.target.value)}
            className={errors.StartDate ? 'border-red-300' : ''}
            required
          />
          {errors.StartDate && <p className="text-sm text-red-600 mt-1">{errors.StartDate}</p>}
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
