
import { RouteObject } from 'react-router-dom';
import { NavItem, NavSection } from '@/types/navigation';

export const routesToNavItems = (routes: RouteObject[]): NavItem[] => {
  return routes
    .filter(route => route.handle && (route.handle as any).navigation) 
    .map(route => {
      const handle = route.handle as any;
      return {
        href: route.path || '/',
        label: handle.navigation.label || 'Unlabeled',
        icon: handle.navigation.icon || undefined,
        permission: handle.navigation.permission || undefined,
        badge: handle.navigation.badge || undefined,
        children: handle.navigation.children || [],
      };
    });
};

export const groupNavItemsBySection = (
  items: NavItem[], 
  sectionMap: Record<string, string>
): NavSection[] => {
  const sections: Record<string, NavItem[]> = {};
  
  // Group items by section
  items.forEach(item => {
    const pathPart = item.href.split('/')[1] || 'dashboard';
    const sectionName = sectionMap[pathPart] || 'Other';
    
    if (!sections[sectionName]) {
      sections[sectionName] = [];
    }
    
    sections[sectionName].push(item);
  });
  
  // Convert to array of NavSection
  return Object.entries(sections).map(([name, items]) => ({
    name,
    items
  }));
};

interface BreadcrumbItem {
  href: string;
  label: string;
}

export const generateBreadcrumbs = (pathname: string, routes: RouteObject[]): BreadcrumbItem[] => {
  if (pathname === '/') {
    return [{ href: '/', label: 'Home' }];
  }

  // Split the pathname into segments
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [{ href: '/', label: 'Home' }];
  
  let currentPath = '';
  
  // Build up breadcrumbs based on path segments
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Try to find a matching route
    const matchingRoute = routes.find(route => route.path === currentPath);
    
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    // If we have metadata for this route, use its title
    if (matchingRoute && (matchingRoute as any).meta?.title) {
      label = (matchingRoute as any).meta.title;
    }
    
    breadcrumbs.push({
      href: currentPath,
      label
    });
  });
  
  return breadcrumbs;
};
