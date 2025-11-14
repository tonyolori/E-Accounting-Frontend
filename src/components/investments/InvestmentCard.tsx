import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Eye, Edit, Trash2, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { Investment } from '../../types/investment';

interface InvestmentCardProps {
  investment: Investment;
  onView: (investment: Investment) => void;
  onEdit: (investment: Investment) => void;
  onDelete: (investment: Investment) => void;
}

export default function InvestmentCard({ investment, onView, onEdit, onDelete }: InvestmentCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: investment.currency,
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

  const getStatusColor = (status: Investment['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Investment['category']) => {
    switch (type) {
      case 'STOCKS':
        return 'bg-blue-100 text-blue-800';
      case 'BONDS':
        return 'bg-green-100 text-green-800';
      case 'REAL_ESTATE':
        return 'bg-purple-100 text-purple-800';
      case 'CRYPTO':
        return 'bg-yellow-100 text-yellow-800';
      case 'MUTUAL_FUNDS':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const profit = investment.currentBalance - investment.initialAmount;
  const profitPercentage = ((profit / investment.initialAmount) * 100);
  const isProfit = profit >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {investment.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {investment.description || 'No description provided'}
            </p>
          </div>
          <div className="flex space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView(investment);
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
                onEdit(investment);
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
                onDelete(investment);
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(investment.category)}`}>
            {investment.category.replace('_', ' ')}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
            {investment.status}
          </span>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Initial Amount
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(investment.initialAmount)}
            </div>
          </div>
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Current Balance
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(investment.currentBalance)}
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {isProfit ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? '+' : ''}{formatCurrency(profit)}
            </span>
            <span className={`text-sm ml-2 ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              ({isProfit ? '+' : ''}{profitPercentage.toFixed(2)}%)
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {investment.returnType === 'FIXED' ? (
              <span className="flex items-center">
                <Target className="h-3 w-3 mr-1" />
                {investment.returnRate?.toFixed(2) || '0.00'}% fixed
              </span>
            ) : (
              <span className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {investment.returnRate?.toFixed(2) || 'Variable'}% variable
              </span>
            )}
          </div>
        </div>

        {/* Start Date */}
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Started {formatDate(investment.startDate)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Created {formatDate(investment.createdAt)}</span>
          <span>Updated {formatDate(investment.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
