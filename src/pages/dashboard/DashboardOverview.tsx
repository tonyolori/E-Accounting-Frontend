import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
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
  currencyTotals?: CurrencyTotal[];
}

interface CurrencyTotal {
  currency: string;
  totalPrincipal: number;
  totalCurrentValue: number;
  totalReturns: number;
  count: number;
}

interface ApiDashboardResponse {
  success: boolean;
  message: string;
  data: ApiDashboardData;
}

interface ApiDashboardData {
  portfolio: {
    totalInvestments: number;
    ratesAt: string;
    totalPrincipalBase: number;
    totalCurrentValueBase: number;
    totalReturnsBase: number;
  };
  assetAllocation: {
    [key: string]: number;
  };
  totalsByCurrency: Array<{
    currency: string;
    totalPrincipal: number | string;
    totalCurrentValue: number | string;
    totalReturns: number;
    count: number;
  }>;
  topPerformers: Array<{
    id: string;
    name: string;
    initialAmount: number | string;
    currentBalance: number | string;
    returnType: string;
    status: string;
    startDate: string;
    absoluteReturn: number;
    returnPercentage: number;
    annualizedReturn: number;
  }>;
  generatedAt: string;
}

const mapApiToDashboardData = (api: ApiDashboardData): DashboardData => {
  const totalValueBase = Number(api?.portfolio?.totalCurrentValueBase ?? 0);
  const totalReturnsBase = Number(api?.portfolio?.totalReturnsBase ?? 0);

  const performers = Array.isArray(api?.topPerformers) ? api.topPerformers : [];
  const best = performers.length
    ? performers.reduce((acc, cur) =>
        Number(cur.returnPercentage ?? 0) > Number(acc.returnPercentage ?? 0) ? cur : acc
      )
    : undefined;

  const currencyTotals: CurrencyTotal[] = Array.isArray(api?.totalsByCurrency)
    ? api.totalsByCurrency.map((c) => ({
        currency: c.currency,
        totalPrincipal: Number(c.totalPrincipal ?? 0),
        totalCurrentValue: Number(c.totalCurrentValue ?? 0),
        totalReturns: Number(c.totalReturns ?? 0),
        count: Number(c.count ?? 0),
      }))
    : [];

  return {
    overview: {
      totalInvestments: Number(api?.portfolio?.totalInvestments ?? 0),
      totalValue: totalValueBase,
      totalReturns: totalReturnsBase,
      activeInvestments: (api?.totalsByCurrency || []).reduce((sum, c) => sum + Number(c.count || 0), 0),
    },
    performance: {
      monthlyChange: 0,
      yearlyChange: 0,
      bestPerformer: {
        id: best?.id ?? '',
        name: best?.name ?? '-',
        returnRate: Number(best?.returnPercentage ?? 0),
      },
    },
    assetAllocation: api?.assetAllocation || {},
    currencyTotals,
  };
};

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currencyCode, setCurrencyCode] = useState('USD');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get<ApiDashboardResponse>('/api/reports/dashboard');
        
        if (response.data.success) {
          const apiData = response.data.data;
          setCurrencyCode(apiData?.totalsByCurrency?.[0]?.currency || 'USD');
          setDashboardData(mapApiToDashboardData(apiData));
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

  const formatCurrency = (amount: number, currencyOverride?: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyOverride || currencyCode,
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
          {/* Active Investments Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

          {/* Currency Totals Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {(dashboardData?.currencyTotals ?? []).map((ct) => (
              <div key={ct.currency} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500 truncate">Currency</div>
                      <div className="text-xl font-semibold text-gray-900">{ct.currency}</div>
                    </div>
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-xs text-gray-500">Investments</div>
                      <div className="text-base font-medium text-gray-900">{ct.count}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Principal</div>
                      <div className="text-base font-medium text-gray-900">{formatCurrency(ct.totalPrincipal, ct.currency)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Current Value</div>
                      <div className="text-base font-medium text-gray-900">{formatCurrency(ct.totalCurrentValue, ct.currency)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Returns</div>
                      <div className={`text-base font-medium ${(ct.totalReturns ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(ct.totalReturns, ct.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
