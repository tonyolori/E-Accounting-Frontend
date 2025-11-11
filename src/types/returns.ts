export interface InvestmentReturn {
  id: string;
  investmentId: string;
  userId: string;
  returnAmount: number;
  returnRate: number;
  period: ReturnPeriod;
  startDate: string;
  endDate: string;
  calculatedAt: string;
  createdAt: string;
  updatedAt: string;
  // Related data populated in responses
  investment?: {
    id: string;
    name: string;
    type: string;
    initialAmount: number;
    currentBalance: number;
  };
}

export type ReturnPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'TOTAL';

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnRate: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  bestDay: {
    date: string;
    return: number;
  };
  worstDay: {
    date: string;
    return: number;
  };
}

export interface InvestmentPerformance {
  investmentId: string;
  investmentName: string;
  investmentType: string;
  initialAmount: number;
  currentValue: number;
  totalReturn: number;
  totalReturnRate: number;
  dailyReturn: number;
  weeklyReturn: number;
  monthlyReturn: number;
  quarterlyReturn: number;
  yearlyReturn: number;
  metrics: PerformanceMetrics;
  lastUpdated: string;
}

export interface BenchmarkComparison {
  investmentId: string;
  benchmarkName: string;
  investmentReturn: number;
  benchmarkReturn: number;
  outperformance: number;
  period: ReturnPeriod;
}

export interface ReturnFilters {
  investmentId?: string;
  period?: ReturnPeriod;
  startDate?: string;
  endDate?: string;
  minReturn?: number;
  maxReturn?: number;
  sortBy?: 'returnRate' | 'returnAmount' | 'period' | 'calculatedAt' | 'totalReturnRate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ReturnListResponse {
  success: boolean;
  data: {
    returns: InvestmentReturn[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    summary?: {
      totalReturns: number;
      averageReturn: number;
      bestReturn: number;
      worstReturn: number;
      totalReturnAmount: number;
    };
  };
}

export interface PerformanceAnalytics {
  totalInvestments: number;
  totalValue: number;
  totalReturns: number;
  averageReturnRate: number;
  bestPerformer: {
    investmentId: string;
    name: string;
    returnRate: number;
  };
  worstPerformer: {
    investmentId: string;
    name: string;
    returnRate: number;
  };
  performanceByPeriod: {
    daily: number;
    weekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  topPerformers: InvestmentPerformance[];
}

export interface ReturnProjection {
  investmentId: string;
  projectedReturns: {
    period: string;
    conservativeReturn: number;
    moderateReturn: number;
    aggressiveReturn: number;
  }[];
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  riskMetrics: {
    volatility: number;
    valueAtRisk: number;
    expectedShortfall: number;
  };
}

export const RETURN_PERIOD_OPTIONS: { value: string; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'TOTAL', label: 'Total Return' },
];

export const BENCHMARK_OPTIONS: { value: string; label: string }[] = [
  { value: 'SP500', label: 'S&P 500' },
  { value: 'NASDAQ', label: 'NASDAQ' },
  { value: 'DOW', label: 'Dow Jones' },
  { value: 'BONDS', label: '10-Year Treasury' },
  { value: 'GOLD', label: 'Gold' },
  { value: 'INFLATION', label: 'Inflation Rate' },
];
