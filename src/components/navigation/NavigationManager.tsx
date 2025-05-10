
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { NavSection } from '@/types/navigation';
import { usePermissions } from '@/hooks/use-permissions';
import { adminRoutes } from '@/router/routes/adminRoutes';
import { crmRoutes } from '@/router/routes/crmRoutes';
import { settingsRoutes } from '@/router/routes/settingsRoutes';
import { classesRoutes } from '@/router/routes/classesRoutes';
import { routesToNavItems, groupNavItemsBySection } from '@/utils/route-navigation';
import { Permission } from '@/hooks/use-permissions';
import { AppRoute } from '@/types/routes';
import { RouteObject } from 'react-router-dom';

// Import other route files as needed

export interface NavigationManagerProps {
  children: (props: {
    sections: NavSection[];
    activePath: string;
    expandedSections: string[];
    toggleSection: (section: string) => void;
  }) => React.ReactNode;
}

export function NavigationManager({ children }: NavigationManagerProps) {
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['Dashboard']);
  
  // Route-to-section mapping
  const sectionMap = {
    'admin': 'Admin',
    'dashboard': 'Dashboard',
    'classes': 'Classes',
    'crm': 'CRM',
    'finance': 'Finance',
    'settings': 'Settings',
    'members': 'Members',
    'trainers': 'Staff',
    'staff': 'Staff',
    'inventory': 'Inventory & Shop',
    'store': 'Inventory & Shop',
    'communication': 'Communication',
    'website': 'Website',
    'reports': 'Reports',
    'analytics': 'Reports',
    'marketing': 'Marketing',
  };
  
  // Get active path section
  const activePathSection = location.pathname.split('/')[1] || 'dashboard';
  
  // Combine all routes - treating them as a union type for navigation purposes
  const allRoutes = useMemo(() => [
    ...adminRoutes,
    ...crmRoutes,
    ...settingsRoutes,
    ...classesRoutes,
    // Add other routes here
  ] as (RouteObject | AppRoute)[], []);
  
  // Generate nav items from routes
  const allNavItems = useMemo(() => routesToNavItems(allRoutes), [allRoutes]);
  
  // Group items into sections
  const sections = useMemo(() => {
    // Filter items by permission
    const filteredItems = allNavItems.filter(item => 
      !item.permission || hasPermission(item.permission as Permission)
    );
    
    // Group by section
    return groupNavItemsBySection(filteredItems, sectionMap);
  }, [allNavItems, hasPermission]);
  
  // Expand the section of the active path
  React.useEffect(() => {
    const sectionForPath = sectionMap[activePathSection];
    if (sectionForPath && !expandedSections.includes(sectionForPath)) {
      setExpandedSections(prev => [...prev, sectionForPath]);
    }
  }, [activePathSection]);
  
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };
  
  return children({
    sections,
    activePath: location.pathname,
    expandedSections,
    toggleSection,
  });
}

export default NavigationManager;
