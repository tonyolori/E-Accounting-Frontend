import { apiService } from './api';
import { 
  InvestmentReturn, 
  InvestmentPerformance, 
  PerformanceAnalytics, 
  ReturnProjection,
  BenchmarkComparison,
  ReturnFilters, 
  ReturnListResponse
} from '../types/returns';

export const returnsService = {
  // Get all returns with pagination and filtering
  async getReturns(filters: ReturnFilters = {}): Promise<ReturnListResponse> {
    const params = new URLSearchParams();
    
    if (filters.investmentId) params.append('investmentId', filters.investmentId);
    if (filters.period) params.append('period', filters.period);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.minReturn) params.append('minReturn', filters.minReturn.toString());
    if (filters.maxReturn) params.append('maxReturn', filters.maxReturn.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/api/returns${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<ReturnListResponse>(url);
    return response.data;
  },

  // Get performance analytics overview
  async getPerformanceAnalytics(): Promise<PerformanceAnalytics> {
    const response = await apiService.get<{success: boolean; data: PerformanceAnalytics}>('/api/returns/analytics');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch performance analytics');
  },

  // Get investment performance by ID
  async getInvestmentPerformance(investmentId: string): Promise<InvestmentPerformance> {
    const response = await apiService.get<{success: boolean; data: InvestmentPerformance}>(`/api/returns/investment/${investmentId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch investment performance');
  },

  // Get all investment performances
  async getAllInvestmentPerformances(): Promise<InvestmentPerformance[]> {
    const response = await apiService.get<{success: boolean; data: InvestmentPerformance[]}>('/api/returns/performances');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch investment performances');
  },

  // Calculate returns for an investment
  async calculateReturns(investmentId: string, period: string): Promise<InvestmentReturn> {
    const response = await apiService.post<{success: boolean; data: InvestmentReturn}>(`/api/returns/calculate`, {
      investmentId,
      period
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to calculate returns');
  },

  // Get return projections
  async getReturnProjections(investmentId: string): Promise<ReturnProjection> {
    const response = await apiService.get<{success: boolean; data: ReturnProjection}>(`/api/returns/projections/${investmentId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch return projections');
  },

  // Get benchmark comparisons
  async getBenchmarkComparisons(investmentId?: string, period?: string): Promise<BenchmarkComparison[]> {
    const params = new URLSearchParams();
    if (investmentId) params.append('investmentId', investmentId);
    if (period) params.append('period', period);

    const queryString = params.toString();
    const url = `/api/returns/benchmarks${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<{success: boolean; data: BenchmarkComparison[]}>(url);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch benchmark comparisons');
  },

  // Get returns by investment ID
  async getReturnsByInvestment(investmentId: string, period?: string): Promise<InvestmentReturn[]> {
    const params = new URLSearchParams();
    params.append('investmentId', investmentId);
    if (period) params.append('period', period);

    const response = await apiService.get<{success: boolean; data: InvestmentReturn[]}>(`/api/returns?${params.toString()}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch investment returns');
  },

  // Get performance comparison data
  async getPerformanceComparison(investmentIds: string[], period: string): Promise<{
    investments: InvestmentPerformance[];
    benchmarks: BenchmarkComparison[];
  }> {
    const response = await apiService.post<{success: boolean; data: {
      investments: InvestmentPerformance[];
      benchmarks: BenchmarkComparison[];
    }}>('/api/returns/compare', {
      investmentIds,
      period
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch performance comparison');
  }
};
