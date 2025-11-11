import React from 'react';
import { Edit, Trash2, Calendar, DollarSign, TrendingUp, Tag, FileText, Clock } from 'lucide-react';
import { Investment } from '../../types/investment';
import { Button } from '../ui/button';

interface InvestmentDetailProps {
  investment: Investment;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InvestmentDetail({ investment, onEdit, onDelete }: InvestmentDetailProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  const getStatusColor = (status: Investment['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: Investment['category']) => {
    switch (type) {
      case 'STOCKS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BONDS':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REAL_ESTATE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CRYPTO':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'MUTUAL_FUNDS':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const profit = investment.currentBalance - investment.initialAmount;
  const profitPercentage = ((profit / investment.initialAmount) * 100);
  const isProfit = profit >= 0;

  const today = new Date();
  const maturityDate = new Date(investment.StartDate);
  const daysToMaturity = Math.ceil((maturityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{investment.name}</h2>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(investment.category)}`}>
              <Tag className="h-3 w-3 mr-1" />
              {investment.category.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(investment.status)}`}>
              {investment.status}
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

      {/* Description */}
      {investment.description && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 mr-1" />
            Description
          </div>
          <p className="text-gray-600">{investment.description}</p>
        </div>
      )}

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-gray-500">Initial Amount</dt>
              <dd className="text-2xl font-bold text-gray-900">
                {formatCurrency(investment.initialAmount)}
              </dd>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-gray-500">Current Balance</dt>
              <dd className="text-2xl font-bold text-gray-900">
                {formatCurrency(investment.currentBalance)}
              </dd>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className={`h-6 w-6 ${isProfit ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-gray-500">Profit/Loss</dt>
              <dd className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {isProfit ? '+' : ''}{formatCurrency(profit)}
              </dd>
              <dd className={`text-sm ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                ({isProfit ? '+' : ''}{profitPercentage.toFixed(2)}%)
              </dd>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-gray-500">Return Rate</dt>
              <dd className="text-2xl font-bold text-gray-900">
                {investment.returnRate.toFixed(2)}%
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Dates and Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Maturity Date</dt>
                <dd className="text-sm text-gray-900">{formatDate(investment.StartDate)}</dd>
                <dd className={`text-xs ${daysToMaturity > 0 ? 'text-gray-500' : 'text-red-600'}`}>
                  {daysToMaturity > 0 ? `${daysToMaturity} days remaining` : 'Matured'}
                </dd>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(investment.createdAt)}</dd>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(investment.updatedAt)}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Investment Period</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.ceil((new Date().getTime() - new Date(investment.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Growth Rate</span>
              <span className={`text-sm font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {profitPercentage.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Expected Return</span>
              <span className="text-sm font-medium text-gray-900">
                {investment.returnRate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Days to Maturity</span>
              <span className={`text-sm font-medium ${daysToMaturity > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                {daysToMaturity > 0 ? daysToMaturity : 'Matured'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
