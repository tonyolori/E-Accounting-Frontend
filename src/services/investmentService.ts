import { apiService } from './api';
import { 
  Investment, 
  CreateInvestmentData, 
  UpdateInvestmentData, 
  InvestmentFilters, 
  InvestmentListResponse 
} from '../types/investment';

export const investmentService = {
  // Get all investments with pagination and filtering
  async getInvestments(filters: InvestmentFilters = {}): Promise<InvestmentListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/api/investments${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<InvestmentListResponse>(url);
    return response.data;
  },

  // Get a single investment by ID
  async getInvestmentById(id: string): Promise<Investment> {
    const response = await apiService.get<{success: boolean; data: Investment}>(`/api/investments/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch investment');
  },

  // Create a new investment
  async createInvestment(data: CreateInvestmentData): Promise<Investment> {
    const response = await apiService.post<{success: boolean; data: Investment}>('/api/investments', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to create investment');
  },

  // Update an existing investment
  async updateInvestment(id: string, data: UpdateInvestmentData): Promise<Investment> {
    const response = await apiService.put<{success: boolean; data: Investment}>(`/api/investments/${id}`, data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update investment');
  },

  // Delete an investment
  async deleteInvestment(id: string): Promise<void> {
    const response = await apiService.delete<{success: boolean}>(`/api/investments/${id}`);
    if (!response.data.success) {
      throw new Error('Failed to delete investment');
    }
  },

  // Update investment status
  async updateInvestmentStatus(id: string, status: 'ACTIVE' | 'CLOSED' | 'PENDING'): Promise<Investment> {
    return this.updateInvestment(id, { status });
  },

  // Update investment balance
  async updateInvestmentBalance(id: string, currentBalance: number): Promise<Investment> {
    return this.updateInvestment(id, { currentBalance });
  }
};
