import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Eye, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Modal } from '../../components/ui/modal';
import { 
  Investment, 
  InvestmentFilters, 
  INVESTMENT_TYPE_OPTIONS, 
  INVESTMENT_STATUS_OPTIONS, 
  CURRENCY_OPTIONS
} from '../../types/investment';
import { investmentService } from '../../services/investmentService';
import InvestmentForm from '../../components/investments/InvestmentForm';
import InvestmentDetail from '../../components/investments/InvestmentDetail';
import DeleteConfirmModal from '../../components/investments/DeleteConfirmModal';
import InterestActions from '../../components/investments/InterestActions';

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<InvestmentFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

  // Fetch investments
  const fetchInvestments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await investmentService.getInvestments(filters);
      setInvestments(response.data.investments);
      setPagination(response.data.pagination);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch investments:', error);
      setError('Failed to load investments');
      // Mock data for development
      const mockInvestments: Investment[] = [
        {
          id: '1',
          userId: 'user-1',
          name: 'Tech Growth Fund',
          currency: 'USD',
          category: 'STOCKS',
          initialAmount: 10000,
          currentBalance: 12500,
          startDate: '2024-01-01',
          interestRate: 15.2,
          returnType: 'VARIABLE',
          status: 'ACTIVE',
          description: 'Technology sector growth investment',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
        {
          id: '2',
          userId: 'user-1',
          name: 'Government Bonds',
          currency: 'USD',
          category: 'BONDS',
          initialAmount: 5000,
          currentBalance: 5200,
          startDate: '2024-01-02',
          interestRate: 4.2,
          returnType: 'FIXED',
          status: 'ACTIVE',
          description: 'Safe government bond investment',
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-10T14:20:00.000Z',
        },
        {
          id: '3',
          userId: 'user-1',
          name: 'Real Estate REIT',
          currency: 'NGN',
          category: 'REAL_ESTATE',
          initialAmount: 15000,
          currentBalance: 16800,
          startDate: '2024-01-03',
          interestRate: 8.5,
          returnType: 'VARIABLE',
          status: 'ACTIVE',
          description: 'Real estate investment trust',
          createdAt: '2024-01-03T00:00:00.000Z',
          updatedAt: '2024-01-12T09:15:00.000Z',
        },
      ];
      setInvestments(mockInvestments);
      setPagination({
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  // Handle filter changes
  const handleFilterChange = (key: keyof InvestmentFilters, value: any) => {
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
    fetchInvestments();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedInvestment(null);
    fetchInvestments();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setSelectedInvestment(null);
    fetchInvestments();
  };

  const handleViewDetails = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your investment portfolio and track performance.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search investments..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <Select
              options={[{ value: '', label: 'All Types' }, ...INVESTMENT_TYPE_OPTIONS]}
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              placeholder="Filter by type"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select
              options={[{ value: '', label: 'All Status' }, ...INVESTMENT_STATUS_OPTIONS]}
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              placeholder="Filter by status"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <Select
              options={[{ value: '', label: 'All Currencies' }, ...CURRENCY_OPTIONS]}
              value={filters.currency || ''}
              onChange={(e) => handleFilterChange('currency', e.target.value || undefined)}
              placeholder="Filter by currency"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex space-x-2">
              <Select
                options={[
                  { value: 'name', label: 'Name' },
                  { value: 'initialAmount', label: 'Initial Amount' },
                  { value: 'currentBalance', label: 'Current Balance' },
                  { value: 'interestRate', label: 'Interest Rate' },
                  { value: 'createdAt', label: 'Date Created' },
                ]}
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange(filters.sortBy || 'createdAt')}
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
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error && investments.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchInvestments}>Retry</Button>
            </div>
          </div>
        </div>
      ) : investments.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900">No investments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.category || filters.status
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first investment.'}
              </p>
              {!filters.search && !filters.category && !filters.status && (
                <div className="mt-6">
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Investment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Investments Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('name')}>
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        {filters.sortBy === 'name' && (
                          filters.sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('initialAmount')}>
                      <div className="flex items-center justify-end space-x-1">
                        <span>Initial Amount</span>
                        {filters.sortBy === 'initialAmount' && (
                          filters.sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('currentBalance')}>
                      <div className="flex items-center justify-end space-x-1">
                        <span>Current Balance</span>
                        {filters.sortBy === 'currentBalance' && (
                          filters.sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('interestRate')}>
                      <div className="flex items-center justify-end space-x-1">
                        <span>Interest Rate</span>
                        {filters.sortBy === 'interestRate' && (
                          filters.sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investments.map((investment) => {
                    const formatAmount = (amount: number, currency: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
                    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    const statusClasses = investment.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : investment.status === 'CLOSED'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800';
                    return (
                      <tr key={investment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex flex-col">
                            <span className="truncate max-w-[280px]">{investment.name}</span>
                            {investment.description && (
                              <span className="text-xs text-gray-500 truncate max-w-[320px]">{investment.description}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {investment.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}>
                            {investment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {investment.currency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatAmount(investment.initialAmount, investment.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatAmount(investment.currentBalance, investment.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {investment.interestRate != null ? `${investment.interestRate.toFixed(2)}%` : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(investment.startDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(investment)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <InterestActions investment={investment} onSuccess={fetchInvestments} />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(investment)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(investment)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
        title="Add New Investment"
        className="max-w-2xl"
      >
        <InvestmentForm onSuccess={handleAddSuccess} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Investment"
        className="max-w-2xl"
      >
        {selectedInvestment && (
          <InvestmentForm
            investment={selectedInvestment}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Investment Details"
        className="max-w-3xl"
      >
        {selectedInvestment && (
          <InvestmentDetail
            investment={selectedInvestment}
            onEdit={() => {
              setIsDetailModalOpen(false);
              handleEdit(selectedInvestment);
            }}
            onDelete={() => {
              setIsDetailModalOpen(false);
              handleDelete(selectedInvestment);
            }}
          />
        )}
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        investment={selectedInvestment}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
