import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  CreditCard, 
  DollarSign, 
  BarChart3, 
  X,
  Menu
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Investments', href: '/dashboard/investments', icon: TrendingUp },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  // { name: 'Returns', href: '/dashboard/returns', icon: DollarSign },
  // { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarContent() {
  return (
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">E-Accounting</h1>
          </div>
        </div>
      </div>
      
      <nav className="mt-8 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )
            }
            end={item.href === '/dashboard'}
          >
            <item.icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0'
              )}
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
