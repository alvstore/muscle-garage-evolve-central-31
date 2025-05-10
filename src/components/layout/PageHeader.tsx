
import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useLocation } from 'react-router-dom';
import { adminRoutes } from '@/router/routes/adminRoutes';
import { settingsRoutes } from '@/router/routes/settingsRoutes';
import { crmRoutes } from '@/router/routes/crmRoutes';
import { classRoutes } from '@/router/routes/classRoutes';
import { generateBreadcrumbs } from '@/utils/route-navigation';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions
}) => {
  const location = useLocation();
  const combinedRoutes = [
    ...adminRoutes,
    ...settingsRoutes,
    ...crmRoutes,
    ...classRoutes,
    // Add other route arrays here
  ];
  
  const breadcrumbs = generateBreadcrumbs(location.pathname, combinedRoutes);
  
  // Get title from route metadata if not provided
  const routeTitle = title || (() => {
    const path = location.pathname;
    // Look for route with matching path property instead of directly using path
    const matchingRoute = combinedRoutes.find(r => r && typeof r === 'object' && 'path' in r && r.path === path);
    return matchingRoute && matchingRoute.meta?.title || 'Dashboard';
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
