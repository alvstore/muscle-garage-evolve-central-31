
import { AppRoute } from '@/types/route';
import { NavItem, NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/use-permissions';

/**
 * Converts routes with metadata into navigation items
 */
export function routesToNavItems(routes: AppRoute[]): NavItem[] {
  return routes
    .filter(route => route.meta && !route.meta.hideInNav)
    .map(route => ({
      href: route.path || '#',
      label: route.meta?.title || 'Unknown',
      permission: route.meta?.permission as Permission || 'access_dashboards',
      icon: route.meta?.icon,
      children: route.meta?.children 
        ? routesToNavItems(route.meta.children)
        : undefined
    }));
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
export function generateBreadcrumbs(path: string, routes: AppRoute[]): { label: string, href: string }[] {
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
    
    if (matchingRoute?.meta?.breadcrumb) {
      breadcrumbs.push({
        label: matchingRoute.meta.breadcrumb,
        href: currentPath
      });
    }
    
    // Update children access to use route.children
    if (matchingRoute?.children) {
      currentRoutes = matchingRoute.children;
    }
  });
  
  return breadcrumbs;
}
