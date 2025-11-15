import type { CurrencyCode } from './investment';

export interface Transaction {
  id: string;
  investmentId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  // Related data populated in responses
  investment?: {
    id: string;
    name: string;
    type: string;
    currency?: CurrencyCode | string;
  };
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

export interface CreateTransactionData {
  investmentId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  balance?: number;
}

export interface TransactionFilters {
  search?: string;
  type?: TransactionType;
  investmentId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount' | 'type' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TransactionListResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    summary?: TransactionSummary;
  };
}

export interface TransactionSummary {
  totalTransactions: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
  netAmount: number;
  averageTransaction: number;
  largestDeposit: number;
  largestWithdrawal: number;
}

export const TRANSACTION_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'DEPOSIT', label: 'Deposit' },
  { value: 'WITHDRAWAL', label: 'Withdrawal' },
  { value: 'TRANSFER', label: 'Transfer' },
];

export const TRANSACTION_SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'date', label: 'Transaction Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'type', label: 'Type' },
  { value: 'createdAt', label: 'Created Date' },
];
