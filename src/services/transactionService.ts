import { apiService } from './api';
import { 
  Transaction, 
  CreateTransactionData, 
  UpdateTransactionData, 
  TransactionFilters, 
  TransactionListResponse,
  TransactionSummary
} from '../types/transaction';

export const transactionService = {
  // Get all transactions with pagination and filtering
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.investmentId) params.append('investmentId', filters.investmentId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
    if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/api/transactions${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<TransactionListResponse>(url);
    return response.data;
  },

  // Get recent transactions (for dashboard)
  async getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
    const response = await apiService.get<{success: boolean; data: Transaction[]}>(`/api/transactions/recent?limit=${limit}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch recent transactions');
  },

  // Get a single transaction by ID
  async getTransactionById(id: string): Promise<Transaction> {
    const response = await apiService.get<{success: boolean; data: Transaction}>(`/api/transactions/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch transaction');
  },

  // Create a new transaction
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const response = await apiService.post<{success: boolean; data: Transaction}>('/api/transactions', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to create transaction');
  },

  // Update an existing transaction
  async updateTransaction(id: string, data: UpdateTransactionData): Promise<Transaction> {
    const response = await apiService.put<{success: boolean; data: Transaction}>(`/api/transactions/${id}`, data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update transaction');
  },

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    const response = await apiService.delete<{success: boolean}>(`/api/transactions/${id}`);
    if (!response.data.success) {
      throw new Error('Failed to delete transaction');
    }
  },

  // Get transaction summary/analytics
  async getTransactionSummary(filters?: Omit<TransactionFilters, 'page' | 'limit' | 'sortBy' | 'sortOrder'>): Promise<TransactionSummary> {
    const params = new URLSearchParams();
    
    if (filters?.investmentId) params.append('investmentId', filters.investmentId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.type) params.append('type', filters.type);

    const queryString = params.toString();
    const url = `/api/transactions/summary${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<{success: boolean; data: TransactionSummary}>(url);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch transaction summary');
  },

  // Get transactions by investment ID
  async getTransactionsByInvestment(investmentId: string, limit?: number): Promise<Transaction[]> {
    const params = new URLSearchParams();
    params.append('investmentId', investmentId);
    if (limit) params.append('limit', limit.toString());

    const response = await apiService.get<{success: boolean; data: Transaction[]}>(`/api/transactions?${params.toString()}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch investment transactions');
  }
};
