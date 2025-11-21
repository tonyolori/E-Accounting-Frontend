import { apiService } from './api';

export interface InterestCalculation {
  id: string;
  investmentId: string;
  calculationType: 'AUTOMATIC' | 'MANUAL';
  calculatedAt: string;
  periodStart: string;
  periodEnd: string;
  principalAmount: number;
  interestRate: number;
  interestEarned: number;
  newBalance: number;
  transactionId: string;
  isReverted: boolean;
  revertedAt?: string;
}

export interface InterestTransaction {
  id: string;
  type: 'RETURN';
  amount: number;
  balance: number;
  percentage: number | null;
  transactionDate: string;
}

export interface InterestInvestmentUpdate {
  id: string;
  currentBalance: number;
  lastInterestCalculated?: string;
  nextInterestDue?: string;
}

export interface CalculateInterestResponse {
  success: boolean;
  message: string;
  data: {
    calculation: InterestCalculation;
    transaction: InterestTransaction;
    investment: InterestInvestmentUpdate;
  };
}

export interface RevertCalculationResponse {
  success: boolean;
  message: string;
  data: {
    calculation: {
      id: string;
      isReverted: boolean;
      revertedAt: string;
    };
    investment: {
      id: string;
      currentBalance: number;
    };
  };
}

export interface CalculationHistoryResponse {
  success: boolean;
  message: string;
  data: {
    items: InterestCalculation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PreviewCalculationResponse {
  success: boolean;
  message: string;
  data: {
    preview: boolean;
    investmentId: string;
    days: number;
    interest: number;
    newBalance: number;
    periodStart: string;
    periodEnd: string;
  };
}

export interface UpdateScheduleData {
  autoCalculate: boolean;
  compoundingFrequency?: 'DAILY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
}

export interface UpdatePercentageData {
  percentage: number;
  effectiveDate?: string;
  description?: string;
}

export interface UpdateBalanceData {
  newBalance: number;
  effectiveDate?: string;
  description?: string;
}

export interface VariablePercentageResponse {
  success: boolean;
  message: string;
  data: {
    transaction: InterestTransaction;
    investment: InterestInvestmentUpdate;
    calculatedAmount: number;
  };
}

export interface VariableBalanceResponse {
  success: boolean;
  message: string;
  data: {
    transaction: InterestTransaction;
    investment: InterestInvestmentUpdate;
    calculatedPercentage: number;
    returnAmount: number;
  };
}

export const interestService = {
  // Calculate interest for FIXED investments
  async calculateInterest(investmentId: string): Promise<CalculateInterestResponse> {
    const response = await apiService.post<CalculateInterestResponse>(
      `/api/interest/calculate/${investmentId}`
    );
    return response.data;
  },

  // Revert last calculation
  async revertCalculation(investmentId: string): Promise<RevertCalculationResponse> {
    const response = await apiService.post<RevertCalculationResponse>(
      `/api/interest/revert/${investmentId}`,
      { confirmRevert: true }
    );
    return response.data;
  },

  // Get calculation history
  async getCalculationHistory(
    investmentId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<CalculationHistoryResponse> {
    const response = await apiService.get<CalculationHistoryResponse>(
      `/api/interest/history/${investmentId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Preview interest calculation
  async previewCalculation(investmentId: string): Promise<PreviewCalculationResponse> {
    const response = await apiService.get<PreviewCalculationResponse>(
      `/api/interest/preview/${investmentId}`
    );
    return response.data;
  },

  // Update auto-calculation schedule
  async updateSchedule(
    investmentId: string,
    data: UpdateScheduleData
  ): Promise<{ success: boolean; data: any }> {
    const response = await apiService.patch<{ success: boolean; data: any }>(
      `/api/interest/schedule/${investmentId}`,
      data
    );
    return response.data;
  },

  // VARIABLE: Update by percentage
  async updateByPercentage(
    investmentId: string,
    data: UpdatePercentageData
  ): Promise<VariablePercentageResponse> {
    const response = await apiService.post<VariablePercentageResponse>(
      `/api/interest/variable/update-percentage/${investmentId}`,
      data
    );
    return response.data;
  },

  // VARIABLE: Update by new balance
  async updateByBalance(
    investmentId: string,
    data: UpdateBalanceData
  ): Promise<VariableBalanceResponse> {
    const response = await apiService.post<VariableBalanceResponse>(
      `/api/interest/variable/update-balance/${investmentId}`,
      data
    );
    return response.data;
  },
};
