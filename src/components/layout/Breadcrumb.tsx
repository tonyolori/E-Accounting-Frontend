import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

const routeNames: Record<string, string> = {
  dashboard: 'Dashboard',
  investments: 'Investments',
  transactions: 'Transactions',
  returns: 'Returns',
  reports: 'Reports',
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Remove 'dashboard' from path segments if it exists
  const cleanSegments = pathSegments.filter(segment => segment !== 'dashboard');
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Dashboard', href: '/dashboard' }
  ];

  // Build breadcrumb items from path segments
  cleanSegments.forEach((segment, index) => {
    const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const href = index === cleanSegments.length - 1 
      ? undefined // Don't make the last item clickable
      : `/dashboard/${cleanSegments.slice(0, index + 1).join('/')}`;
    
    breadcrumbItems.push({ name, href });
  });

  // If we're on the main dashboard, don't show breadcrumbs
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className={cn(
                  "inline-flex items-center text-sm font-medium hover:text-primary",
                  index === 0 ? "text-gray-500" : "text-gray-700"
                )}
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.name}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
