
import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useLocation } from 'react-router-dom';
// Import route files
import { adminDashboardRoutes } from '@/router/routes/admin/dashboardRoutes';
import { adminMembershipRoutes } from '@/router/routes/admin/membershipRoutes';
import { adminWebsiteRoutes } from '@/router/routes/admin/websiteRoutes';
import { settingsRoutes } from '@/router/routes/settingsRoutes';
import { crmRoutes } from '@/router/routes/crmRoutes';
import { classRoutes } from '@/router/routes/classRoutes';
import { generateBreadcrumbs } from '@/utils/route-navigation';
import { ChevronRight, Home } from 'lucide-react';
import { AppRoute } from '@/types/route';
import { RouteObject } from 'react-router-dom';

type AnyRoute = AppRoute | RouteObject;

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

// Type guard to check if a route has meta property
const isAppRoute = (route: AnyRoute): route is AppRoute => {
  return 'meta' in route;
};

// Helper function to flatten nested routes
const flattenRoutes = (routes: AnyRoute[]): AnyRoute[] => {
  return routes.reduce<AnyRoute[]>((acc, route) => {
    acc.push(route);
    if (route.children) {
      acc.push(...flattenRoutes(route.children));
    }
    return acc;
  }, []);
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions
}) => {
  const location = useLocation();
  
  // Combine all admin routes
  const adminRoutes = [
    ...(adminDashboardRoutes || []),
    ...(adminMembershipRoutes || []),
    ...(adminWebsiteRoutes || [])
  ] as AnyRoute[];
  
  const allRoutes = [
    ...adminRoutes,
    ...settingsRoutes,
    ...crmRoutes,
    ...classRoutes,
  ];
  
  const flattenedRoutes = flattenRoutes(allRoutes);
  const breadcrumbs = generateBreadcrumbs(location.pathname, flattenedRoutes);
  
  // Get title from route metadata if not provided
  const routeTitle = title || (() => {
    const path = location.pathname;
    const matchingRoute = flattenedRoutes.find(r => r.path === path);
    
    if (!matchingRoute) return 'Dashboard';
    
    // Handle both AppRoute and RouteObject
    if (isAppRoute(matchingRoute)) {
      return matchingRoute.meta?.title || 'Dashboard';
    }
    
    // For RouteObject, use the path as the title
    return matchingRoute.path || 'Dashboard';
  })();

  // Render breadcrumb items
  const renderBreadcrumbs = () => {
    return breadcrumbs.map((crumb, index) => {
      // Use a simple key without any data attributes
      const itemKey = `breadcrumb-${index}`;
      
      // Create breadcrumb item and separator separately
      const breadcrumbItem = (
        <BreadcrumbItem key={`item-${itemKey}`}>
          <BreadcrumbLink href={crumb.href}>
            {index === 0 ? <Home className="h-4 w-4" /> : crumb.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
      
      // Create separator if needed
      const separator = index < breadcrumbs.length - 1 ? (
        <BreadcrumbSeparator key={`separator-${itemKey}`}>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
      ) : null;
      
      // Return an array of elements instead of using Fragment
      return [breadcrumbItem, separator].filter(Boolean);
    }).flat();
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
      <div>
        {breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              {renderBreadcrumbs()}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{routeTitle}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
