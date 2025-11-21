import React, { useState } from 'react';
import { Calculator, History, Settings, RefreshCw, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { Investment } from '../../types/investment';
import { interestService, PreviewCalculationResponse, InterestCalculation } from '../../services/interestService';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

interface InterestActionsProps {
  investment: Investment;
  onSuccess: () => void;
}

export default function InterestActions({ investment, onSuccess }: InterestActionsProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isVariablePercentOpen, setIsVariablePercentOpen] = useState(false);
  const [isVariableBalanceOpen, setIsVariableBalanceOpen] = useState(false);

  const [preview, setPreview] = useState<PreviewCalculationResponse['data'] | null>(null);
  const [history, setHistory] = useState<InterestCalculation[]>([]);
  const [historyPagination, setHistoryPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Schedule form state
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [compoundingFrequency, setCompoundingFrequency] = useState<'DAILY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY'>('MONTHLY');

  // Variable percentage form state
  const [percentage, setPercentage] = useState('');
  const [percentEffectiveDate, setPercentEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [percentDescription, setPercentDescription] = useState('');

  // Variable balance form state
  const [newBalance, setNewBalance] = useState('');
  const [balanceEffectiveDate, setBalanceEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [balanceDescription, setBalanceDescription] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: investment.currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePreview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await interestService.previewCalculation(investment.id);
      setPreview(response.data);
      setIsPreviewOpen(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to load preview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await interestService.calculateInterest(investment.id);
      setSuccessMessage(`Interest calculated: ${formatCurrency(response.data.transaction.amount)}`);
      setIsPreviewOpen(false);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to calculate interest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = async () => {
    if (!window.confirm('Are you sure you want to revert the last interest calculation? This action cannot be undone.')) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await interestService.revertCalculation(investment.id);
      setSuccessMessage('Interest calculation reverted successfully');
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to revert calculation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadHistory = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await interestService.getCalculationHistory(investment.id, page, 10);
      setHistory(response.data.items);
      setHistoryPagination(response.data.pagination);
      setIsHistoryOpen(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSchedule = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await interestService.updateSchedule(investment.id, {
        autoCalculate,
        compoundingFrequency,
      });
      setSuccessMessage('Schedule updated successfully');
      setIsScheduleOpen(false);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to update schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateByPercentage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await interestService.updateByPercentage(investment.id, {
        percentage: parseFloat(percentage),
        effectiveDate: percentEffectiveDate,
        description: percentDescription || undefined,
      });
      setSuccessMessage(`Return updated: ${formatCurrency(response.data.calculatedAmount)} (${percentage}%)`);
      setIsVariablePercentOpen(false);
      setPercentage('');
      setPercentDescription('');
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to update return percentage');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateByBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await interestService.updateByBalance(investment.id, {
        newBalance: parseFloat(newBalance),
        effectiveDate: balanceEffectiveDate,
        description: balanceDescription || undefined,
      });
      setSuccessMessage(`Balance updated: ${formatCurrency(parseFloat(newBalance))} (${response.data.calculatedPercentage.toFixed(2)}% return)`);
      setIsVariableBalanceOpen(false);
      setNewBalance('');
      setBalanceDescription('');
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to update balance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {investment.returnType === 'FIXED' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="h-8 w-8 p-0"
              title="Preview Interest"
            >
              <Calculator className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsScheduleOpen(true)}
              className="h-8 w-8 p-0"
              title="Schedule Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRevert}
              className="h-8 w-8 p-0"
              title="Revert Last Calculation"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
        )}
        {investment.returnType === 'VARIABLE' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVariablePercentOpen(true)}
              className="h-8 w-8 p-0"
              title="Update by Percentage"
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVariableBalanceOpen(true)}
              className="h-8 w-8 p-0"
              title="Update Balance"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleLoadHistory(1)}
          className="h-8 w-8 p-0"
          title="View History"
        >
          <History className="h-4 w-4" />
        </Button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50">
          {error}
        </div>
      )}

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Interest Calculation Preview">
        {preview && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-700 mb-2">This is a preview. No changes will be made until you confirm.</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Period</div>
                <div className="font-medium">{preview.days} days</div>
                <div className="text-xs text-gray-500">{formatDate(preview.periodStart)} - {formatDate(preview.periodEnd)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Interest Earned</div>
                <div className="font-medium text-green-600">{formatCurrency(preview.interest)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Current Balance</div>
                <div className="font-medium">{formatCurrency(investment.currentBalance)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">New Balance</div>
                <div className="font-medium text-blue-600">{formatCurrency(preview.newBalance)}</div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleCalculate} disabled={isLoading}>
                {isLoading ? 'Calculating...' : 'Confirm & Calculate'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* History Modal */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Interest Calculation History" className="max-w-4xl">
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No calculation history found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Interest</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">New Balance</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((calc) => (
                      <tr key={calc.id} className={calc.isReverted ? 'bg-red-50' : ''}>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDate(calc.calculatedAt)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div>{formatDate(calc.periodStart)}</div>
                          <div className="text-xs text-gray-500">to {formatDate(calc.periodEnd)}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(calc.interestEarned)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(calc.newBalance)}</td>
                        <td className="px-4 py-3 text-center">
                          {calc.isReverted ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Reverted
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Applied
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {historyPagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-700">
                    Page {historyPagination.page} of {historyPagination.totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadHistory(historyPagination.page - 1)}
                      disabled={historyPagination.page <= 1 || isLoading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadHistory(historyPagination.page + 1)}
                      disabled={historyPagination.page >= historyPagination.totalPages || isLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* Schedule Settings Modal */}
      <Modal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title="Auto-Calculation Schedule">
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoCalculate}
                onChange={(e) => setAutoCalculate(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Enable Auto-Calculate</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">Automatically calculate interest based on the schedule below</p>
          </div>

          {autoCalculate && (
            <div>
              <Label htmlFor="frequency">Compounding Frequency</Label>
              <Select
                id="frequency"
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(e.target.value as any)}
                options={[
                  { value: 'DAILY', label: 'Daily' },
                  { value: 'MONTHLY', label: 'Monthly' },
                  { value: 'QUARTERLY', label: 'Quarterly' },
                  { value: 'ANNUALLY', label: 'Annually' },
                ]}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSchedule} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Schedule'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Variable: Update by Percentage Modal */}
      <Modal isOpen={isVariablePercentOpen} onClose={() => setIsVariablePercentOpen(false)} title="Update Return by Percentage">
        <div className="space-y-4">
          <div>
            <Label htmlFor="percentage">Return Percentage *</Label>
            <Input
              id="percentage"
              type="number"
              step="0.01"
              placeholder="e.g. 2.5"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">Enter the percentage return (e.g., 2.5 for 2.5%)</p>
          </div>

          <div>
            <Label htmlFor="percentDate">Effective Date</Label>
            <Input
              id="percentDate"
              type="date"
              value={percentEffectiveDate}
              onChange={(e) => setPercentEffectiveDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="percentDesc">Description (optional)</Label>
            <Input
              id="percentDesc"
              type="text"
              placeholder="e.g. Monthly variable return"
              value={percentDescription}
              onChange={(e) => setPercentDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsVariablePercentOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateByPercentage} disabled={isLoading || !percentage}>
              {isLoading ? 'Updating...' : 'Update Return'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Variable: Update by Balance Modal */}
      <Modal isOpen={isVariableBalanceOpen} onClose={() => setIsVariableBalanceOpen(false)} title="Update Balance (Calculate Return)">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-700">
              Current balance: {formatCurrency(investment.currentBalance)}
            </div>
          </div>

          <div>
            <Label htmlFor="newBalance">New Balance *</Label>
            <Input
              id="newBalance"
              type="number"
              step="0.01"
              placeholder={`e.g. ${investment.currentBalance * 1.05}`}
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">The return percentage will be calculated automatically</p>
          </div>

          <div>
            <Label htmlFor="balanceDate">Effective Date</Label>
            <Input
              id="balanceDate"
              type="date"
              value={balanceEffectiveDate}
              onChange={(e) => setBalanceEffectiveDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="balanceDesc">Description (optional)</Label>
            <Input
              id="balanceDesc"
              type="text"
              placeholder="e.g. Mark to market"
              value={balanceDescription}
              onChange={(e) => setBalanceDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsVariableBalanceOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateByBalance} disabled={isLoading || !newBalance}>
              {isLoading ? 'Updating...' : 'Update Balance'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
