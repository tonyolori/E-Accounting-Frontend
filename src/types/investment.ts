export interface Investment {
  id: string;
  userId: string;
  name: string;
  category: InvestmentCategory;
  initialAmount: number;
  currentBalance: number;
  StartDate: string;
  returnRate: number;
  status: InvestmentStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvestmentCategory = 'STOCKS' | 'BONDS' | 'REAL_ESTATE' | 'CRYPTO' | 'MUTUAL_FUNDS' | 'OTHER';

export type InvestmentStatus = 'ACTIVE' | 'CLOSED' | 'PENDING';

export interface CreateInvestmentData {
  name: string;
  category: InvestmentCategory;
  initialAmount: number;
  startDate: string;
  returnRate: number;
  returnType: string;
  description?: string;
}

export interface UpdateInvestmentData extends Partial<CreateInvestmentData> {
  currentBalance?: number;
  status?: InvestmentStatus;
}

export interface InvestmentFilters {
  search?: string;
  category?: InvestmentCategory;
  status?: InvestmentStatus;
  sortBy?: 'name' | 'initialAmount' | 'currentBalance' | 'returnRate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface InvestmentListResponse {
  success: boolean;
  data: {
    investments: Investment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const INVESTMENT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'STOCKS', label: 'Stocks' },
  { value: 'BONDS', label: 'Bonds' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'CRYPTO', label: 'Cryptocurrency' },
  { value: 'MUTUAL_FUNDS', label: 'Mutual Funds' },
  { value: 'OTHER', label: 'Other' },
];

export const INVESTMENT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'PENDING', label: 'Pending' },
];
