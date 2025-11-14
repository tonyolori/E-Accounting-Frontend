export interface Investment {
  id: string;
  userId: string;
  name: string;
  currency: CurrencyCode;
  category: InvestmentCategory;
  initialAmount: number;
  currentBalance: number;
  startDate: string;
  returnRate?: number | null;
  returnType: InvestmentReturnType;
  status: InvestmentStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvestmentCategory = 'STOCKS' | 'BONDS' | 'REAL_ESTATE' | 'CRYPTO' | 'MUTUAL_FUNDS' | 'OTHER';
export type InvestmentReturnType = 'FIXED' | 'VARIABLE';

export type InvestmentStatus = 'ACTIVE' | 'CLOSED' | 'PENDING';

export interface CreateInvestmentData {
  name: string;
  currency: CurrencyCode;
  category: InvestmentCategory;
  initialAmount: number;
  startDate: string;
  returnRate?: number | null;
  returnType: InvestmentReturnType;
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
  currency?: CurrencyCode;
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

export const INVESTMENT_TYPE_OPTIONS = [
  { value: 'STOCKS', label: 'Stocks' },
  { value: 'BONDS', label: 'Bonds' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'CRYPTO', label: 'Cryptocurrency' },
  { value: 'MUTUAL_FUNDS', label: 'Mutual Funds' },
  { value: 'OTHER', label: 'Other' },
];

export const INVESTMENT_RETURN_TYPE_OPTIONS = [
  { value: 'FIXED', label: 'Fixed Return' },
  { value: 'VARIABLE', label: 'Variable Return' },
];

export const INVESTMENT_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'PENDING', label: 'Pending' },
];

export type CurrencyCode = 'USD' | 'NGN';

export const CURRENCY_OPTIONS = [
  { value: 'NGN', label: 'Naira (NGN)' },
  { value: 'USD', label: 'US Dollar (USD)' },
];
