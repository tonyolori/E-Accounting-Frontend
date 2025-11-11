import React, { useState, useEffect } from 'react';
import { TrendingUp, Calculator, BarChart3, Target, Award, Calendar, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { 
  PerformanceAnalytics, 
  InvestmentPerformance, 
  ReturnFilters,
  RETURN_PERIOD_OPTIONS 
} from '../../types/returns';
import { Investment } from '../../types/investment';
import { returnsService } from '../../services/returnsService';
import { investmentService } from '../../services/investmentService';
import PerformanceOverview from '../../components/returns/PerformanceOverview';
import PerformanceChart from '../../components/returns/PerformanceChart';
import InvestmentPerformanceCard from '../../components/returns/InvestmentPerformanceCard';
import BenchmarkComparison from '../../components/returns/BenchmarkComparison';
import ReturnProjections from '../../components/returns/ReturnProjections';

export default function Returns() {
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [performances, setPerformances] = useState<InvestmentPerformance[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ReturnFilters>({
    period: 'MONTHLY',
    sortBy: 'totalReturnRate',
    sortOrder: 'desc',
  });

  // Fetch performance analytics
  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const [analyticsData, performancesData, investmentsData] = await Promise.all([
        returnsService.getPerformanceAnalytics(),
        returnsService.getAllInvestmentPerformances(),
        investmentService.getInvestments({ limit: 100 })
      ]);

      setAnalytics(analyticsData);
      setPerformances(performancesData);
      setInvestments(investmentsData.data.investments);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch returns data:', error);
      setError('Failed to load returns data');
      // Mock data for development
      setAnalytics({
        totalInvestments: 3,
        totalValue: 32700,
        totalReturns: 4200,
        averageReturnRate: 14.7,
        bestPerformer: {
          investmentId: 'inv-1',
          name: 'Tech Growth Fund',
          returnRate: 18.5
        },
        worstPerformer: {
          investmentId: 'inv-2',
          name: 'Government Bonds',
          returnRate: 4.2
        },
        performanceByPeriod: {
          daily: 0.05,
          weekly: 0.32,
          monthly: 1.4,
          quarterly: 4.2,
          yearly: 14.7
        },
        topPerformers: []
      });
      
      setPerformances([
        {
          investmentId: 'inv-1',
          investmentName: 'Tech Growth Fund',
          investmentType: 'STOCKS',
          initialAmount: 10000,
          currentValue: 12500,
          totalReturn: 2500,
          totalReturnRate: 25.0,
          dailyReturn: 0.12,
          weeklyReturn: 0.85,
          monthlyReturn: 3.2,
          quarterlyReturn: 8.1,
          yearlyReturn: 25.0,
          metrics: {
            totalReturn: 2500,
            totalReturnRate: 25.0,
            annualizedReturn: 18.5,
            volatility: 15.2,
            sharpeRatio: 1.22,
            maxDrawdown: -8.5,
            bestDay: { date: '2024-01-15', return: 125 },
            worstDay: { date: '2024-01-08', return: -95 }
          },
          lastUpdated: '2024-01-15T10:00:00.000Z'
        },
        {
          investmentId: 'inv-2',
          investmentName: 'Government Bonds',
          investmentType: 'BONDS',
          initialAmount: 5000,
          currentValue: 5200,
          totalReturn: 200,
          totalReturnRate: 4.0,
          dailyReturn: 0.01,
          weeklyReturn: 0.08,
          monthlyReturn: 0.33,
          quarterlyReturn: 1.0,
          yearlyReturn: 4.0,
          metrics: {
            totalReturn: 200,
            totalReturnRate: 4.0,
            annualizedReturn: 4.2,
            volatility: 2.1,
            sharpeRatio: 0.85,
            maxDrawdown: -1.2,
            bestDay: { date: '2024-01-12', return: 15 },
            worstDay: { date: '2024-01-03', return: -8 }
          },
          lastUpdated: '2024-01-15T10:00:00.000Z'
        }
      ]);

      setInvestments([
        {
          id: 'inv-1',
          userId: 'user-1',
          name: 'Tech Growth Fund',
          category: 'STOCKS',
          initialAmount: 10000,
          currentBalance: 12500,
          StartDate: '2024-12-31',
          returnRate: 15.2,
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof ReturnFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: newSortOrder,
    }));
  };

  // Sort performances based on current filters
  const sortedPerformances = [...performances].sort((a, b) => {
    const { sortBy, sortOrder } = filters;
    let aValue: number;
    let bValue: number;

    switch (sortBy) {
      case 'totalReturnRate':
        aValue = a.totalReturnRate;
        bValue = b.totalReturnRate;
        break;
      case 'returnAmount':
        aValue = a.totalReturn;
        bValue = b.totalReturn;
        break;
      default:
        aValue = a.totalReturnRate;
        bValue = b.totalReturnRate;
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const handleCalculateReturns = async () => {
    try {
      // Calculate returns for all investments
      await Promise.all(
        performances.map(perf => 
          returnsService.calculateReturns(perf.investmentId, filters.period || 'MONTHLY')
        )
      );
      fetchAnalytics(); // Refresh data
    } catch (error) {
      console.error('Failed to calculate returns:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Returns & Performance</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track investment returns, analyze performance, and compare against benchmarks.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={handleCalculateReturns}>
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Returns
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error && !analytics ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchAnalytics}>Retry</Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Performance Overview */}
          {analytics && (
            <div className="mb-8">
              <PerformanceOverview analytics={analytics} />
            </div>
          )}

          {/* Performance Chart */}
          <div className="mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
              <PerformanceChart performances={performances} />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment</label>
                <Select
                  options={[
                    { value: '', label: 'All Investments' },
                    ...investments.map(inv => ({ value: inv.id, label: inv.name }))
                  ]}
                  value={filters.investmentId || ''}
                  onChange={(e) => handleFilterChange('investmentId', e.target.value || undefined)}
                  placeholder="Filter by investment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <Select
                  options={RETURN_PERIOD_OPTIONS}
                  value={filters.period || 'MONTHLY'}
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                  placeholder="Select period"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <div className="flex space-x-2">
                  <Select
                    options={[
                      { value: 'totalReturnRate', label: 'Return Rate' },
                      { value: 'returnAmount', label: 'Return Amount' },
                    ]}
                    value={filters.sortBy || 'totalReturnRate'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange(filters.sortBy || 'totalReturnRate')}
                    className="px-2"
                  >
                    {filters.sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Performance Cards */}
          {sortedPerformances.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {sortedPerformances.map((performance) => (
                <InvestmentPerformanceCard
                  key={performance.investmentId}
                  performance={performance}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-900">No performance data</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Performance tracking will appear here once you have active investments with returns.
                  </p>
                  <div className="mt-6">
                    <Button onClick={handleCalculateReturns}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Returns
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benchmark Comparison */}
          <div className="mb-8">
            <BenchmarkComparison performances={performances} />
          </div>

          {/* Return Projections */}
          <div className="mb-8">
            <ReturnProjections investments={investments} />
          </div>
        </>
      )}
    </div>
  );
}
