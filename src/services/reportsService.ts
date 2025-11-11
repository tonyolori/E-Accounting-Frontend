import { apiService } from './api';
import { 
  Report, 
  ReportData, 
  ReportTemplate, 
  TrendAnalysis, 
  AnalyticsWidget, 
  ReportFilters 
} from '../types/reports';

export const reportsService = {
  // Get all reports
  async getReports(): Promise<Report[]> {
    const response = await apiService.get<{success: boolean; data: Report[]}>('/api/reports');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch reports');
  },

  // Get report by ID
  async getReport(id: string): Promise<Report> {
    const response = await apiService.get<{success: boolean; data: Report}>(`/api/reports/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch report');
  },

  // Create new report
  async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Report> {
    const response = await apiService.post<{success: boolean; data: Report}>('/api/reports', reportData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to create report');
  },

  // Update existing report
  async updateReport(id: string, updates: Partial<Report>): Promise<Report> {
    const response = await apiService.put<{success: boolean; data: Report}>(`/api/reports/${id}`, updates);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update report');
  },

  // Delete report
  async deleteReport(id: string): Promise<void> {
    const response = await apiService.delete<{success: boolean}>(`/api/reports/${id}`);
    if (!response.data.success) {
      throw new Error('Failed to delete report');
    }
  },

  // Generate report
  async generateReport(id: string): Promise<{ downloadUrl: string }> {
    const response = await apiService.post<{success: boolean; data: { downloadUrl: string }}>(`/api/reports/${id}/generate`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to generate report');
  },

  // Get report data
  async getReportData(filters: ReportFilters): Promise<ReportData> {
    const response = await apiService.post<{success: boolean; data: ReportData}>('/api/reports/data', filters);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch report data');
  },

  // Get report templates
  async getReportTemplates(): Promise<ReportTemplate[]> {
    const response = await apiService.get<{success: boolean; data: ReportTemplate[]}>('/api/reports/templates');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch report templates');
  },

  // Get analytics widgets
  async getAnalyticsWidgets(): Promise<AnalyticsWidget[]> {
    const response = await apiService.get<{success: boolean; data: AnalyticsWidget[]}>('/api/reports/widgets');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch analytics widgets');
  },

  // Get trend analysis
  async getTrendAnalysis(metric: string, period: string): Promise<TrendAnalysis[]> {
    const response = await apiService.get<{success: boolean; data: TrendAnalysis[]}>(`/api/reports/trends?metric=${metric}&period=${period}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch trend analysis');
  },

  // Export report data
  async exportReport(id: string, format: string): Promise<Blob> {
    const response = await apiService.get(`/api/reports/${id}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  },

  // Schedule report
  async scheduleReport(reportId: string, schedule: any): Promise<void> {
    const response = await apiService.post<{success: boolean}>(`/api/reports/${reportId}/schedule`, schedule);
    if (!response.data.success) {
      throw new Error('Failed to schedule report');
    }
  },

  // Get dashboard analytics
  async getDashboardAnalytics(): Promise<{
    totalReports: number;
    scheduledReports: number;
    recentReports: Report[];
    popularTemplates: ReportTemplate[];
  }> {
    const response = await apiService.get<{success: boolean; data: any}>('/api/reports/analytics');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch dashboard analytics');
  }
};
