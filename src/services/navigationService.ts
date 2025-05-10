
import { RouteObject } from 'react-router-dom';
import { AppRoute } from '@/types/routes';
import { NavItem, NavSection } from '@/types/navigation';

// Convert routes to navigation items
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

// Group navigation items by section
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

// Function to safely process a mix of RouteObject and AppRoute
export const processRoutes = (routes: (RouteObject | AppRoute)[]) => {
  // For safety, just cast to RouteObject[] since we're only using common properties
  return routesToNavItems(routes as RouteObject[]);
};
