import React, { useState, useEffect } from 'react';
import { 
  FileText, BarChart3, Plus, Download, Calendar, Filter, 
  Search, Eye, Edit, Trash2, Clock, TrendingUp 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Modal } from '../../components/ui/modal';
import { 
  Report, 
  ReportTemplate, 
  AnalyticsWidget, 
  TrendAnalysis,
  REPORT_TYPE_OPTIONS,
  REPORT_FORMAT_OPTIONS
} from '../../types/reports';
import { reportsService } from '../../services/reportsService';
import ReportsOverview from '../../components/reports/ReportsOverview';
import ReportCard from '../../components/reports/ReportCard';
import ReportBuilder from '../../components/reports/ReportBuilder';
import AnalyticsDashboard from '../../components/reports/AnalyticsDashboard';
import TrendAnalysisWidget from '../../components/reports/TrendAnalysisWidget';

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [widgets, setWidgets] = useState<AnalyticsWidget[]>([]);
  const [trends, setTrends] = useState<TrendAnalysis[]>([]);
  const [dashboardAnalytics, setDashboardAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch all data
  const fetchReportsData = async () => {
    try {
      setIsLoading(true);
      const [
        reportsData,
        templatesData,
        widgetsData,
        trendsData,
        analyticsData
      ] = await Promise.all([
        reportsService.getReports(),
        reportsService.getReportTemplates(),
        reportsService.getAnalyticsWidgets(),
        reportsService.getTrendAnalysis('portfolio_value', 'monthly'),
        reportsService.getDashboardAnalytics()
      ]);

      setReports(reportsData);
      setTemplates(templatesData);
      setWidgets(widgetsData);
      setTrends(trendsData);
      setDashboardAnalytics(analyticsData);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      setError('Failed to load reports data');
      // Mock data for development
      setDashboardAnalytics({
        totalReports: 12,
        scheduledReports: 3,
        recentReports: [],
        popularTemplates: []
      });

      setReports([
        {
          id: 'rpt-1',
          userId: 'user-1',
          name: 'Monthly Portfolio Summary',
          type: 'PORTFOLIO_SUMMARY',
          description: 'Comprehensive monthly overview of portfolio performance',
          filters: {
            dateRange: {
              startDate: '2024-01-01',
              endDate: '2024-01-31'
            },
            includeCharts: true,
            includeMetrics: true
          },
          format: 'PDF',
          status: 'COMPLETED',
          createdAt: '2024-01-15T10:00:00.000Z',
          updatedAt: '2024-01-15T10:00:00.000Z',
          lastGenerated: '2024-01-15T10:30:00.000Z'
        },
        {
          id: 'rpt-2',
          userId: 'user-1',
          name: 'Q4 Investment Performance',
          type: 'INVESTMENT_PERFORMANCE',
          description: 'Quarterly performance analysis of all investments',
          filters: {
            dateRange: {
              startDate: '2023-10-01',
              endDate: '2023-12-31'
            },
            includeCharts: true,
            includeMetrics: true
          },
          format: 'EXCEL',
          status: 'SCHEDULED',
          createdAt: '2024-01-10T14:00:00.000Z',
          updatedAt: '2024-01-10T14:00:00.000Z'
        }
      ]);

      setTemplates([
        {
          id: 'tpl-1',
          name: 'Portfolio Summary',
          description: 'Standard portfolio overview with key metrics',
          type: 'PORTFOLIO_SUMMARY',
          defaultFilters: {
            dateRange: {
              startDate: '2024-01-01',
              endDate: '2024-01-31'
            },
            includeCharts: true,
            includeMetrics: true
          },
          sections: []
        }
      ]);

      setTrends([
        {
          metric: 'Portfolio Value',
          currentValue: 32700,
          previousValue: 30500,
          change: 2200,
          changePercent: 7.21,
          trend: 'UP',
          prediction: {
            nextPeriod: 34200,
            confidence: 0.78
          }
        },
        {
          metric: 'Total Returns',
          currentValue: 4200,
          previousValue: 3800,
          change: 400,
          changePercent: 10.53,
          trend: 'UP',
          prediction: {
            nextPeriod: 4600,
            confidence: 0.65
          }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || report.type === typeFilter;
    const matchesStatus = !statusFilter || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle report actions
  const handleGenerateReport = async (reportId: string) => {
    try {
      const result = await reportsService.generateReport(reportId);
      // Handle successful generation
      fetchReportsData(); // Refresh data
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await reportsService.deleteReport(reportId);
      fetchReportsData(); // Refresh data
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const handleDownloadReport = async (report: Report) => {
    try {
      const blob = await reportsService.exportReport(report.id, report.format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name}.${report.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Generate comprehensive reports and analyze your investment performance with advanced analytics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <Button variant="outline" onClick={() => setIsBuilderModalOpen(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Report Builder
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error && !dashboardAnalytics ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchReportsData}>Retry</Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Dashboard Overview */}
          {dashboardAnalytics && (
            <div className="mb-8">
              <ReportsOverview analytics={dashboardAnalytics} />
            </div>
          )}

          {/* Analytics Dashboard */}
          <div className="mb-8">
            <AnalyticsDashboard widgets={widgets} />
          </div>

          {/* Trend Analysis */}
          <div className="mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trend Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trends.map((trend, index) => (
                  <TrendAnalysisWidget key={index} trend={trend} />
                ))}
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Reports</h3>
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* Type Filter */}
                <Select
                  options={[
                    { value: '', label: 'All Types' },
                    ...REPORT_TYPE_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))
                  ]}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-48"
                />

                {/* Status Filter */}
                <Select
                  options={[
                    { value: '', label: 'All Status' },
                    { value: 'DRAFT', label: 'Draft' },
                    { value: 'SCHEDULED', label: 'Scheduled' },
                    { value: 'COMPLETED', label: 'Completed' },
                    { value: 'FAILED', label: 'Failed' }
                  ]}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>

            {filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onGenerate={() => handleGenerateReport(report.id)}
                    onDownload={() => handleDownloadReport(report)}
                    onDelete={() => handleDeleteReport(report.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-sm font-medium text-gray-900">
                  {searchTerm || typeFilter || statusFilter ? 'No matching reports' : 'No reports available'}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {searchTerm || typeFilter || statusFilter
                    ? 'Try adjusting your search or filters.'
                    : 'Create your first report to get detailed insights into your investments.'}
                </p>
                {!searchTerm && !typeFilter && !statusFilter && (
                  <div className="mt-6">
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Report"
        className="max-w-2xl"
      >
        <ReportBuilder
          templates={templates}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchReportsData();
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isBuilderModalOpen}
        onClose={() => setIsBuilderModalOpen(false)}
        title="Advanced Report Builder"
        className="max-w-4xl"
      >
        <ReportBuilder
          templates={templates}
          isAdvanced={true}
          onSuccess={() => {
            setIsBuilderModalOpen(false);
            fetchReportsData();
          }}
          onCancel={() => setIsBuilderModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
