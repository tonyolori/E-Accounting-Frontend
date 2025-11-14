import React, { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { 
  Investment, 
  CreateInvestmentData, 
  INVESTMENT_TYPE_OPTIONS, 
  INVESTMENT_RETURN_TYPE_OPTIONS,
  INVESTMENT_STATUS_OPTIONS,
  CURRENCY_OPTIONS 
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
    currency: investment?.currency || 'NGN',
    category: investment?.category || '',
    initialAmount: investment?.initialAmount?.toString() || '',
    currentBalance: investment?.currentBalance?.toString() || '',
    startDate: investment?.startDate ? investment.startDate.split('T')[0] : '',
    returnRate: investment?.returnRate?.toString() || '',
    returnType: investment?.returnType || 'FIXED',
    status: investment?.status || 'ACTIVE',
    description: investment?.description || '',
  });

  type FieldErrors = Record<string, string>;
  type FormErrors = { fields: FieldErrors; submit?: string; global?: string[] };
  const [errors, setErrors] = useState<FormErrors>({ fields: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: FieldErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Investment name is required';
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }

    if (!formData.category) {
      newErrors.category = 'Investment category is required';
    }

    if (!formData.initialAmount || parseFloat(formData.initialAmount) <= 0) {
      newErrors.initialAmount = 'Initial amount must be greater than 0';
    }

    // Only validate currentBalance in edit mode
    if (isEditMode && (!formData.currentBalance || parseFloat(formData.currentBalance) <= 0)) {
      newErrors.currentBalance = 'Current balance must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.returnType) {
      newErrors.returnType = 'Return type is required';
    }

    // Only validate returnRate if returnType is FIXED
    if (formData.returnType === 'FIXED') {
      if (!formData.returnRate || formData.returnRate.trim() === '') {
        newErrors.returnRate = 'Interest rate is required for fixed return investments';
      } else if (parseFloat(formData.returnRate) < 0) {
        newErrors.returnRate = 'Interest rate cannot be negative';
      } else if (parseFloat(formData.returnRate) > 100) {
        newErrors.returnRate = 'Interest rate cannot exceed 100%';
      }
    } else if (formData.returnRate && formData.returnRate.trim() !== '') {
      // For VARIABLE type, if provided, still validate range
      if (parseFloat(formData.returnRate) < 0) {
        newErrors.returnRate = 'Interest rate cannot be negative';
      } else if (parseFloat(formData.returnRate) > 100) {
        newErrors.returnRate = 'Interest rate cannot exceed 100%';
      }
    }

    setErrors({ fields: newErrors });
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
        currency: formData.currency as any,
        category: formData.category as any,
        initialAmount: parseFloat(formData.initialAmount),
        startDate: formData.startDate,
        returnType: formData.returnType as any,
        returnRate: formData.returnRate && formData.returnRate.trim() !== '' 
          ? parseFloat(formData.returnRate) 
          : null,
        description: formData.description.trim() || undefined,
      };

      if (isEditMode && investment) {
        await investmentService.updateInvestment(investment.id, {
          ...submitData,
          currentBalance: parseFloat(formData.currentBalance),
          status: formData.status as any,
        });
      } else {
        // For new investments, set currentBalance to initialAmount
        const createData = {
          ...submitData,
          currentBalance: parseFloat(formData.initialAmount)
        };
        await investmentService.createInvestment(createData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Failed to save investment:', error);
      const defaultMessage = 'Failed to save investment. Please fix the errors and try again.';
      if (isAxiosError(error)) {
        const data: any = error.response?.data;
        const serverMessage: string | undefined = data?.message || data?.error;
        const details: Array<{ field?: string; message?: string }> = Array.isArray(data?.details) ? data.details : [];

        const fieldErrors: FieldErrors = {};
        const globalMessages: string[] = [];

        if (serverMessage) {
          globalMessages.push(serverMessage);
        }

        for (const d of details) {
          if (d?.field && d?.message) {
            fieldErrors[d.field] = d.message;
            globalMessages.push(d.message);
          } else if (d?.message) {
            globalMessages.push(d.message);
          }
        }

        setErrors({
          fields: fieldErrors,
          submit: serverMessage || defaultMessage,
          global: globalMessages.length ? globalMessages : undefined,
        });
      } else {
        setErrors({ fields: {}, submit: defaultMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.fields[field]) {
      setErrors(prev => ({ ...prev, fields: { ...prev.fields, [field]: '' } }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(errors.submit || (errors.global && errors.global.length)) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          {errors.submit && (
            <div className="text-sm text-red-600">{errors.submit}</div>
          )}
          {errors.global && errors.global.length > 0 && (
            <ul className="list-disc pl-5 mt-2 text-sm text-red-600">
              {errors.global.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}
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
            className={errors.fields.name ? 'border-red-300' : ''}
            required
          />
          {errors.fields.name && <p className="text-sm text-red-600 mt-1">{errors.fields.name}</p>}
        </div>


        {/* Investment Currency */}
        <div>
          <Label htmlFor="currency">Currency *</Label>
          <Select
            id="currency"
            options={CURRENCY_OPTIONS}
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            placeholder="Select currency"
            className={errors.fields.currency ? 'border-red-300' : ''}
            required
          />
          {errors.fields.currency && <p className="text-sm text-red-600 mt-1">{errors.fields.currency}</p>}
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
            className={errors.fields.category ? 'border-red-300' : ''}
            required
          />
          {errors.fields.category && <p className="text-sm text-red-600 mt-1">{errors.fields.category}</p>}
        </div>

        {/* Return Type */}
        <div>
          <Label htmlFor="returnType">Return Type *</Label>
          <Select
            id="returnType"
            options={INVESTMENT_RETURN_TYPE_OPTIONS}
            value={formData.returnType}
            onChange={(e) => handleInputChange('returnType', e.target.value)}
            placeholder="Select return type"
            className={errors.fields.returnType ? 'border-red-300' : ''}
            required
          />
          {errors.fields.returnType && <p className="text-sm text-red-600 mt-1">{errors.fields.returnType}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {formData.returnType === 'FIXED' 
              ? 'Fixed return investments require a specific interest rate.'
              : 'Variable return investments have fluctuating returns.'}
          </p>
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
          <Label htmlFor="initialAmount">Initial Amount *</Label>
          <Input
            id="initialAmount"
            type="number"
            step="0.01"
            min="0"
            value={formData.initialAmount}
            onChange={(e) => handleInputChange('initialAmount', e.target.value)}
            placeholder="0.00"
            className={errors.fields.initialAmount ? 'border-red-300' : ''}
            required
          />
          {errors.fields.initialAmount && <p className="text-sm text-red-600 mt-1">{errors.fields.initialAmount}</p>}
        </div>

        {/* Current Balance (Edit mode only) */}
        {isEditMode && (
          <div>
            <Label htmlFor="currentBalance">Current Balance *</Label>
            <Input
              id="currentBalance"
              type="number"
              step="0.01"
              min="0"
              value={formData.currentBalance}
              onChange={(e) => handleInputChange('currentBalance', e.target.value)}
              placeholder="0.00"
              className={errors.fields.currentBalance ? 'border-red-300' : ''}
              required
            />
            {errors.fields.currentBalance && <p className="text-sm text-red-600 mt-1">{errors.fields.currentBalance}</p>}
          </div>
        )}

        {/* Start Date */}
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={errors.fields.startDate ? 'border-red-300' : ''}
            required
          />
          {errors.fields.startDate && <p className="text-sm text-red-600 mt-1">{errors.fields.startDate}</p>}
        </div>

        {/* Return Rate */}
        <div>
          <Label htmlFor="returnRate">
            {formData.returnType === 'FIXED' ? 'Interest Rate (%) *' : 'Expected Return Rate (%)'}
            {formData.returnType === 'FIXED' && (
              <span className="text-xs text-gray-500 ml-1">(Required for fixed returns)</span>
            )}
          </Label>
          <Input
            id="returnRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.returnRate}
            onChange={(e) => handleInputChange('returnRate', e.target.value)}
            placeholder={formData.returnType === 'FIXED' ? 'Enter interest rate' : 'Optional - leave empty for variable returns'}
            className={errors.fields.returnRate ? 'border-red-300' : ''}
            required={formData.returnType === 'FIXED'}
          />
          {errors.fields.returnRate && <p className="text-sm text-red-600 mt-1">{errors.fields.returnRate}</p>}
          {formData.returnType === 'VARIABLE' && (
            <p className="text-xs text-gray-500 mt-1">
              Optional: Provide an estimated return rate for reference. Variable returns fluctuate based on market conditions.
            </p>
          )}
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
