import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  ExternalLink,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import PortfolioChart from '../../components/dashboard/PortfolioChart';
import AssetAllocationChart from '../../components/dashboard/AssetAllocationChart';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import { Button } from '../../components/ui/button';

interface DashboardData {
  overview: {
    totalInvestments: number;
    totalValue: number;
    totalReturns: number;
    activeInvestments: number;
  };
  performance: {
    monthlyChange: number;
    yearlyChange: number;
    bestPerformer: {
      id: string;
      name: string;
      returnRate: number;
    };
  };
  assetAllocation: {
    [key: string]: number;
  };
}

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get<{success: boolean; data: DashboardData}>('/api/reports/dashboard');
        
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        setError('Failed to load dashboard data');
        // Set mock data for development
        setDashboardData({
          overview: {
            totalInvestments: 5,
            totalValue: 52500,
            totalReturns: 2500,
            activeInvestments: 3
          },
          performance: {
            monthlyChange: 2.5,
            yearlyChange: 12.5,
            bestPerformer: {
              id: '1',
              name: 'Tech Growth Fund',
              returnRate: 15.2
            }
          },
          assetAllocation: {
            STOCKS: 60,
            BONDS: 30,
            REAL_ESTATE: 10
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent?: number | null) => {
    if (percent === null || percent === undefined || isNaN(Number(percent))) {
      return '0.00%';
    }
    const val = Number(percent);
    return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your investments today.
        </p>
      </div>

      {dashboardData && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Investments
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {dashboardData?.overview?.totalInvestments ?? 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Portfolio Value
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(dashboardData?.overview?.totalValue ?? 0)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Returns
                      </dt>
                      <dd className={`text-lg font-medium ${
                        (dashboardData?.overview?.totalReturns ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(dashboardData?.overview?.totalReturns ?? 0)}
                      </dd>
                    </dl>
                  </div>
                  <div className="ml-2">
                    {(dashboardData?.overview?.totalReturns ?? 0) >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Investments
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {dashboardData?.overview?.activeInvestments ?? 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Change</p>
                    <p className={`text-2xl font-bold ${
                      (dashboardData?.performance?.monthlyChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(dashboardData?.performance?.monthlyChange)}
                    </p>
                  </div>
                  {(dashboardData?.performance?.monthlyChange ?? 0) >= 0 ? (
                    <ArrowUpRight className="h-8 w-8 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Yearly Change</p>
                    <p className={`text-2xl font-bold ${
                      (dashboardData?.performance?.yearlyChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(dashboardData?.performance?.yearlyChange)}
                    </p>
                  </div>
                  {(dashboardData?.performance?.yearlyChange ?? 0) >= 0 ? (
                    <ArrowUpRight className="h-8 w-8 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Best Performer</p>
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {dashboardData?.performance?.bestPerformer?.name ?? '-'}
                    </p>
                    <p className="text-sm text-green-600">
                      {formatPercent(dashboardData?.performance?.bestPerformer?.returnRate)}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Performance</h3>
              <PortfolioChart />
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Allocation</h3>
              <AssetAllocationChart data={dashboardData?.assetAllocation ?? {}} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h3>
                <Link to="/dashboard/transactions">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
              <RecentTransactions />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
