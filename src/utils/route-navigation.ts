
import { AppRoute } from '@/types/route';
import { NavItem, NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/auth/use-permissions';
import { RouteObject } from 'react-router-dom';

type AnyRoute = AppRoute | RouteObject;

// Type guard to check if a route has meta property
const isAppRoute = (route: AnyRoute): route is AppRoute => {
  return 'meta' in route;
};

/**
 * Converts routes with metadata into navigation items
 */
export function routesToNavItems(routes: AnyRoute[]): NavItem[] {
  return routes
    .filter(route => {
      if (isAppRoute(route)) {
        return route.meta && !route.meta.hideInNav;
      }
      return false; // Only include AppRoutes with meta in navigation
    })
    .map(route => {
      if (!isAppRoute(route)) return null;
      
      const navItem: NavItem = {
        href: route.path || '#',
        label: route.meta?.title || 'Unknown',
        permission: route.meta?.permission || 'view:dashboard',
        children: route.children 
          ? routesToNavItems(route.children)
          : undefined
      };
      
      // Add icon only if it exists
      if (route.meta?.icon) {
        navItem.icon = route.meta.icon;
      }
      
      return navItem;
    })
    .filter((item): item is NavItem => item !== null);
}

/**
 * Groups navigation items into sections
 */
export function groupNavItemsBySection(
  items: NavItem[], 
  sectionMap: Record<string, string>
): NavSection[] {
  const sections: Record<string, NavItem[]> = {};
  
  items.forEach(item => {
    const path = item.href.split('/')[1];
    const sectionName = sectionMap[path] || 'Other';
    
    if (!sections[sectionName]) {
      sections[sectionName] = [];
    }
    
    sections[sectionName].push(item);
  });
  
  return Object.entries(sections).map(([name, items]) => ({
    name,
    items
  }));
}

/**
 * Generates breadcrumbs from route metadata
 */
export function generateBreadcrumbs(path: string, routes: AnyRoute[]): { label: string, href: string }[] {
  const breadcrumbs: { label: string, href: string }[] = [];
  const pathSegments = path.split('/').filter(Boolean);
  
  let currentPath = '';
  let currentRoutes = routes;
  
  // Always add Home
  breadcrumbs.push({
    label: 'Home',
    href: '/'
  });
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    const matchingRoute = currentRoutes.find(route => {
      const routePath = route.path || '';
      const routePathSegments = routePath.split('/').filter(Boolean);
      return routePathSegments[index] === segment || 
             routePathSegments[index]?.startsWith(':');
    });
    
    if (matchingRoute) {
      let breadcrumbLabel: string | undefined;
      
      if (isAppRoute(matchingRoute) && matchingRoute.meta?.breadcrumb) {
        breadcrumbLabel = matchingRoute.meta.breadcrumb;
      } else if (matchingRoute.path) {
        // For RouteObject, use the last segment of the path as the breadcrumb
        const pathSegments = matchingRoute.path.split('/').filter(Boolean);
        breadcrumbLabel = pathSegments[pathSegments.length - 1];
        // Convert kebab-case to Title Case
        if (breadcrumbLabel) {
          breadcrumbLabel = breadcrumbLabel
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      }
      
      if (breadcrumbLabel) {
        breadcrumbs.push({
          label: breadcrumbLabel,
          href: currentPath
        });
      }
      
      // Update children access to use route.children
      if (matchingRoute.children) {
        currentRoutes = matchingRoute.children;
      }
    }
  });
  
  return breadcrumbs;
}
