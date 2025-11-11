export interface Report {
  id: string;
  userId: string;
  name: string;
  type: ReportType;
  description?: string;
  filters: ReportFilters;
  schedule?: ReportSchedule;
  format: ReportFormat;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  lastGenerated?: string;
  downloadUrl?: string;
}

export type ReportType = 
  | 'PORTFOLIO_SUMMARY' 
  | 'INVESTMENT_PERFORMANCE' 
  | 'TRANSACTION_HISTORY' 
  | 'RETURNS_ANALYSIS' 
  | 'RISK_ASSESSMENT' 
  | 'CUSTOM';

export type ReportFormat = 'PDF' | 'CSV' | 'EXCEL' | 'JSON';

export type ReportStatus = 'DRAFT' | 'SCHEDULED' | 'GENERATING' | 'COMPLETED' | 'FAILED';

export interface ReportFilters {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  investmentIds?: string[];
  transactionTypes?: string[];
  includeCharts?: boolean;
  includeMetrics?: boolean;
  groupBy?: 'INVESTMENT' | 'TYPE' | 'DATE' | 'NONE';
}

export interface ReportSchedule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfWeek?: number; // 0-6, Sunday = 0
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM format
  timezone: string;
  emailRecipients: string[];
}

export interface ReportData {
  summary: {
    totalInvestments: number;
    totalValue: number;
    totalReturns: number;
    totalTransactions: number;
    avgReturnRate: number;
  };
  investments: {
    id: string;
    name: string;
    type: string;
    value: number;
    return: number;
    returnRate: number;
  }[];
  transactions: {
    id: string;
    type: string;
    amount: number;
    date: string;
    investmentName: string;
  }[];
  performance: {
    labels: string[];
    values: number[];
    returns: number[];
  };
  charts: {
    portfolioPerformance: ChartData;
    assetAllocation: ChartData;
    returnsOverTime: ChartData;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }[];
}

export interface AnalyticsWidget {
  id: string;
  title: string;
  type: WidgetType;
  data: any;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  position: { x: number; y: number };
}

export type WidgetType = 
  | 'METRIC_CARD' 
  | 'CHART' 
  | 'TABLE' 
  | 'TREND' 
  | 'ALERT' 
  | 'PROGRESS';

export interface TrendAnalysis {
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  prediction: {
    nextPeriod: number;
    confidence: number;
  };
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  defaultFilters: ReportFilters;
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  name: string;
  type: 'SUMMARY' | 'CHART' | 'TABLE' | 'METRICS' | 'TEXT';
  config: any;
}

export const REPORT_TYPE_OPTIONS: { value: string; label: string; description: string }[] = [
  { 
    value: 'PORTFOLIO_SUMMARY', 
    label: 'Portfolio Summary', 
    description: 'Overview of entire portfolio with key metrics and allocation' 
  },
  { 
    value: 'INVESTMENT_PERFORMANCE', 
    label: 'Investment Performance', 
    description: 'Detailed performance analysis of individual investments' 
  },
  { 
    value: 'TRANSACTION_HISTORY', 
    label: 'Transaction History', 
    description: 'Comprehensive transaction report with categorization' 
  },
  { 
    value: 'RETURNS_ANALYSIS', 
    label: 'Returns Analysis', 
    description: 'In-depth analysis of returns and performance metrics' 
  },
  { 
    value: 'RISK_ASSESSMENT', 
    label: 'Risk Assessment', 
    description: 'Risk analysis with volatility and drawdown metrics' 
  },
  { 
    value: 'CUSTOM', 
    label: 'Custom Report', 
    description: 'Build a custom report with selected data and visualizations' 
  },
];

export const REPORT_FORMAT_OPTIONS: { value: string; label: string }[] = [
  { value: 'PDF', label: 'PDF Document' },
  { value: 'CSV', label: 'CSV Spreadsheet' },
  { value: 'EXCEL', label: 'Excel Workbook' },
  { value: 'JSON', label: 'JSON Data' },
];

export const SCHEDULE_FREQUENCY_OPTIONS: { value: string; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
];
