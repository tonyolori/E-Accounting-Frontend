import { apiService } from './api';
import { 
  Investment, 
  CreateInvestmentData, 
  UpdateInvestmentData, 
  InvestmentFilters, 
  InvestmentListResponse 
} from '../types/investment';

export const investmentService = {
  // Map API investment to frontend Investment shape
  mapFromApi(item: any): Investment {
    const mapStatus = (status: string | undefined): Investment['status'] => {
      switch (status) {
        case 'ACTIVE':
          return 'ACTIVE';
        case 'COMPLETED':
        case 'CANCELLED':
          return 'CLOSED';
        case 'SUSPENDED':
          return 'PENDING';
        default:
          return 'ACTIVE';
      }
    };

    return {
      id: item.id,
      userId: item.userId || '',
      name: item.name,
      currency: item.currency || 'NGN',
      // Use API 'type' (e.g., STOCKS, BONDS) as our category
      category: item.type || item.category,
      initialAmount: item.initialAmount,
      // API uses currentAmount
      currentBalance: item.currentAmount ?? item.currentBalance ?? 0,
      startDate: item.startDate,
      // Map expectedReturn to our returnRate if present
      returnRate: typeof item.expectedReturn === 'number' ? item.expectedReturn : (typeof item.returnRate === 'number' ? item.returnRate : null),
      // API has no returnType; default to VARIABLE so manual updates are allowed for variable flows
      returnType: item.returnType === 'FIXED' || item.returnType === 'VARIABLE' ? item.returnType : 'VARIABLE',
      status: mapStatus(item.status),
      description: item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  },
  // Get all investments with pagination and filtering
  async getInvestments(filters: InvestmentFilters = {}): Promise<InvestmentListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('type', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.currency) params.append('currency', filters.currency);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/api/investments${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<any>(url);
    const res = response.data;
    const mapped = {
      success: !!res.success,
      data: {
        investments: (res.data?.investments || []).map((it: any) => this.mapFromApi(it)),
        pagination: res.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
      }
    } as InvestmentListResponse;
    return mapped;
  },

  // Get a single investment by ID
  async getInvestmentById(id: string): Promise<Investment> {
    const response = await apiService.get<{success: boolean; data: any}>(`/api/investments/${id}`);
    if (response.data.success) {
      return this.mapFromApi(response.data.data);
    }
    throw new Error('Failed to fetch investment');
  },

  // Create a new investment
  async createInvestment(data: CreateInvestmentData): Promise<Investment> {
    const response = await apiService.post<{success: boolean; data: any}>('/api/investments', data);
    if (response.data.success) {
      return this.mapFromApi(response.data.data);
    }
    throw new Error('Failed to create investment');
  },

  // Update an existing investment
  async updateInvestment(id: string, data: UpdateInvestmentData): Promise<Investment> {
    const response = await apiService.put<{success: boolean; data: any}>(`/api/investments/${id}`, data);
    if (response.data.success) {
      return this.mapFromApi(response.data.data);
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
  ,

  // Update investment balance via dedicated PATCH endpoint
  async updateInvestmentBalanceManual(
    id: string,
    currentAmount: number,
    reason?: string
  ): Promise<{ id: string; currentAmount: number; previousAmount?: number }> {
    const response = await apiService.patch<{
      success: boolean;
      data: { id: string; currentAmount: number; previousAmount?: number };
    }>(`/api/investments/${id}/balance`, { currentAmount, reason });

    if (!response.data.success) {
      throw new Error('Failed to update investment balance');
    }
    return response.data.data;
  }
};
