import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, User, LogOut, Settings, ChevronDown, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { Button } from '../ui/button';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

interface QuickStatsApiResponse {
  success: boolean;
  data: {
    totalInvestments: number;
    totalPortfolioValue: number | string;
    totalReturns: number;
    returnPercentage: number;
    thisMonth?: {
      transactionCount: number;
      transactionAmount: number | string;
    };
    currency?: string;
    ratesAt?: string;
  };
}

interface QuickStats {
  totalValue: number;
  totalReturns: number;
  returnPercentage: number;
  totalInvestments: number;
  thisMonthCount: number;
  thisMonthAmount: number;
  currency: string;
  ratesAt?: string;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const response = await apiService.get<QuickStatsApiResponse>('/api/reports/quick-stats');
        if (response.data.success && response.data.data) {
          const d = response.data.data;
          setQuickStats({
            totalValue: Number(d.totalPortfolioValue ?? 0),
            totalReturns: Number(d.totalReturns ?? 0),
            returnPercentage: Number(d.returnPercentage ?? 0),
            totalInvestments: Number(d.totalInvestments ?? 0),
            thisMonthCount: Number(d.thisMonth?.transactionCount ?? 0),
            thisMonthAmount: Number(d.thisMonth?.transactionAmount ?? 0),
            currency: String(d.currency || 'USD'),
            ratesAt: d.ratesAt,
          });
        }
      } catch (error) {
        console.error('Failed to fetch quick stats:', error);
      }
    };

    fetchQuickStats();
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: quickStats?.currency || 'USD',
    }).format(amount);
  };

  const formatPercent = (percent?: number | null) => {
    if (percent === null || percent === undefined || isNaN(Number(percent))) {
      return '0.00%';
    }
    const val = Number(percent);
    return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1 px-4 flex justify-between items-center">
        {/* Quick Stats */}
        <div className="flex-1 flex items-center space-x-8">
          {quickStats && (
            <>
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-sm">
                  <div className="text-gray-500 flex items-center space-x-1">
                    <span>Total Value</span>
                    {quickStats.ratesAt && (
                      <span
                        title={`Rates at: ${new Date(quickStats.ratesAt).toLocaleString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}`}
                      >
                        <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(quickStats.totalValue)}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500">Returns</div>
                  <div className={`font-semibold ${
                    (quickStats.totalReturns ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(quickStats.totalReturns)} ({formatPercent(quickStats.returnPercentage)})
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500">Investments</div>
                  <div className="font-semibold text-gray-900">
                    {quickStats.totalInvestments}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500">This Month</div>
                  <div className="font-semibold text-gray-900">
                    {quickStats.thisMonthCount} tx · {formatCurrency(quickStats.thisMonthAmount)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            </div>

            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
