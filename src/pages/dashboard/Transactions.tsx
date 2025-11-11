import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, DollarSign, BarChart3, SortAsc, SortDesc, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Modal } from '../../components/ui/modal';
import { 
  Transaction, 
  TransactionFilters, 
  TransactionSummary,
  TRANSACTION_TYPE_OPTIONS, 
  TRANSACTION_SORT_OPTIONS 
} from '../../types/transaction';
import { transactionService } from '../../services/transactionService';
import { investmentService } from '../../services/investmentService';
import { Investment } from '../../types/investment';
import TransactionCard from '../../components/transactions/TransactionCard';
import TransactionForm from '../../components/transactions/TransactionForm';
import TransactionDetail from '../../components/transactions/TransactionDetail';
import TransactionSummaryWidget from '../../components/transactions/TransactionSummaryWidget';
import DeleteConfirmModal from '../../components/transactions/DeleteConfirmModal';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 20,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await transactionService.getTransactions(filters);
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
      if (response.data.summary) {
        setSummary({
          totalTransactions: response.data.summary.totalTransactions || transactions.length,
          totalDeposits: response.data.summary.totalDeposits || 0,
          totalWithdrawals: response.data.summary.totalWithdrawals || 0,
          totalTransfers: response.data.summary.totalTransfers || 0,
          netAmount: response.data.summary.netAmount || 0,
          averageTransaction: response.data.summary.averageTransaction || 0,
          largestDeposit: response.data.summary.largestDeposit || 0,
          largestWithdrawal: response.data.summary.largestWithdrawal || 0,
        });
      }
      setError(null);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions');
      // Mock data for development
      setTransactions([
        {
          id: '1',
          investmentId: 'inv-1',
          userId: 'user-1',
          type: 'DEPOSIT',
          amount: 1000,
          description: 'Initial investment deposit',
          date: '2024-01-15',
          balance: 11000,
          createdAt: '2024-01-15T10:00:00.000Z',
          updatedAt: '2024-01-15T10:00:00.000Z',
          investment: {
            id: 'inv-1',
            name: 'Tech Growth Fund',
            type: 'STOCKS'
          }
        },
        {
          id: '2',
          investmentId: 'inv-2',
          userId: 'user-1',
          type: 'WITHDRAWAL',
          amount: 500,
          description: 'Partial withdrawal for expenses',
          date: '2024-01-14',
          balance: 9500,
          createdAt: '2024-01-14T15:30:00.000Z',
          updatedAt: '2024-01-14T15:30:00.000Z',
          investment: {
            id: 'inv-2',
            name: 'Government Bonds',
            type: 'BONDS'
          }
        },
        {
          id: '3',
          investmentId: 'inv-1',
          userId: 'user-1',
          type: 'TRANSFER',
          amount: 250,
          description: 'Portfolio rebalancing transfer',
          date: '2024-01-13',
          balance: 10750,
          createdAt: '2024-01-13T09:15:00.000Z',
          updatedAt: '2024-01-13T09:15:00.000Z',
          investment: {
            id: 'inv-1',
            name: 'Tech Growth Fund',
            type: 'STOCKS'
          }
        },
      ]);
      setPagination({
        page: 1,
        limit: 20,
        total: 3,
        totalPages: 1
      });
      setSummary({
        totalTransactions: 3,
        totalDeposits: 1000,
        totalWithdrawals: 500,
        totalTransfers: 250,
        netAmount: 750,
        averageTransaction: 583.33,
        largestDeposit: 1000,
        largestWithdrawal: 500
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch investments for the form
  const fetchInvestments = async () => {
    try {
      const response = await investmentService.getInvestments({ limit: 100 });
      setInvestments(response.data.investments);
    } catch (error) {
      console.error('Failed to fetch investments:', error);
      // Mock investments
      setInvestments([
        {
          id: 'inv-1',
          userId: 'user-1',
          name: 'Tech Growth Fund',
          category: 'STOCKS',
          initialAmount: 10000,
          currentBalance: 12500,
          startDate: '2024-01-01',
          returnRate: 15.2,
          returnType: 'VARIABLE',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 'inv-2',
          userId: 'user-1',
          name: 'Government Bonds',
          category: 'BONDS',
          initialAmount: 5000,
          currentBalance: 5200,
          startDate: '2024-01-02',
          returnRate: 4.2,
          returnType: 'FIXED',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchInvestments();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset to page 1 when changing filters
    }));
  };

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: newSortOrder,
    }));
  };

  // Modal handlers
  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchTransactions();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
    fetchTransactions();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setSelectedTransaction(null);
    fetchTransactions();
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track all your financial transactions across investments.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="mb-8">
          <TransactionSummaryWidget summary={summary} />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search transactions..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <Select
              options={[{ value: '', label: 'All Types' }, ...TRANSACTION_TYPE_OPTIONS]}
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              placeholder="Filter by type"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment</label>
            <Select
              options={[
                { value: '', label: 'All Investments' },
                ...investments.map(inv => ({ value: inv.id, label: inv.name }))
              ]}
              value={filters.investmentId || ''}
              onChange={(e) => handleFilterChange('investmentId', e.target.value || undefined)}
              placeholder="Filter by investment"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex space-x-2">
              <Select
                options={TRANSACTION_SORT_OPTIONS}
                value={filters.sortBy || 'date'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange(filters.sortBy || 'date')}
                className="px-2"
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <Input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <Input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.minAmount || ''}
              onChange={(e) => handleFilterChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.maxAmount || ''}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error && transactions.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchTransactions}>Retry</Button>
            </div>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.type || filters.investmentId || filters.startDate || filters.endDate
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first transaction.'}
              </p>
              {!filters.search && !filters.type && !filters.investmentId && (
                <div className="mt-6">
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Transaction
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Transaction List */}
          <div className="space-y-4 mb-8">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onView={() => handleViewDetails(transaction)}
                onEdit={() => handleEdit(transaction)}
                onDelete={() => handleDelete(transaction)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange('page', pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange('page', pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="rounded-r-none"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="rounded-l-none"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Transaction"
        className="max-w-2xl"
      >
        <TransactionForm 
          investments={investments}
          onSuccess={handleAddSuccess} 
          onCancel={() => setIsAddModalOpen(false)} 
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Transaction"
        className="max-w-2xl"
      >
        {selectedTransaction && (
          <TransactionForm
            transaction={selectedTransaction}
            investments={investments}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Transaction Details"
        className="max-w-3xl"
      >
        {selectedTransaction && (
          <TransactionDetail
            transaction={selectedTransaction}
            onEdit={() => {
              setIsDetailModalOpen(false);
              handleEdit(selectedTransaction);
            }}
            onDelete={() => {
              setIsDetailModalOpen(false);
              handleDelete(selectedTransaction);
            }}
          />
        )}
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        transaction={selectedTransaction}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
