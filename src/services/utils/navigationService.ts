import { NavSection, NavItem } from '@/types/navigation';
import { adminNavSections } from '@/data/adminNavigation';
import { routesToNavItems, groupNavItemsBySection } from '@/utils/route-navigation';
import { adminRoutes } from '@/router/routes/adminRoutes';
import { crmRoutes } from '@/router/routes/crmRoutes';
import { settingsRoutes } from '@/router/routes/settingsRoutes';
import { classRoutes } from '@/router/routes/classRoutes';

// Section mapping for route-based navigation
const sectionMap = {
  'dashboard': 'Dashboard',
  'classes': 'Classes',
  'crm': 'CRM',
  // ... other mappings
};

/**
 * Enhances static navigation with dynamic route data
 * This preserves the structure of adminNavSections while adding any missing routes
 */
export function getEnhancedNavigation(userRole?: string): NavSection[] {
  // Get static navigation
  const staticNavigation = [...adminNavSections];
  
  // Generate dynamic navigation from routes
  const allRoutes = [...adminRoutes, ...crmRoutes, ...settingsRoutes, ...classRoutes];
  const navItems = routesToNavItems(allRoutes);
  
  // Filter items based on role instead of permissions array
  const filteredItems = navItems.filter(item => {
    // If no role, show nothing
    if (!userRole) return false;
    
    // Admin sees everything
    if (userRole === 'admin') return true;
    
    // For other roles, you'll need to implement role-based permission checking
    // This is a simplified example - you should adapt it to your permission system
    const rolePermissions = {
      'staff': ['access_dashboards', 'manage_members', 'view_classes'],
      'trainer': ['access_dashboards', 'view_classes', 'trainer_view_classes'],
      'member': ['member_view_plans']
    };
    
    return rolePermissions[userRole as keyof typeof rolePermissions]?.includes(item.permission) || false;
  });
  
  const dynamicSections = groupNavItemsBySection(filteredItems, sectionMap);
  
  // Merge static and dynamic navigation
  return mergeNavigations(staticNavigation, dynamicSections);
}

/**
 * Merges static and dynamic navigation sections
 */
function mergeNavigations(staticNav: NavSection[], dynamicNav: NavSection[]): NavSection[] {
  const result = [...staticNav];
  
  // For each dynamic section
  dynamicNav.forEach(dynamicSection => {
    // Find matching static section
    const existingSection = result.find(s => s.name === dynamicSection.name);
    
    if (existingSection) {
      // Merge items, avoiding duplicates
      const existingHrefs = existingSection.items.map(item => item.href);
      const newItems = dynamicSection.items.filter(item => !existingHrefs.includes(item.href));
      existingSection.items = [...existingSection.items, ...newItems];
    } else {
      // Add new section
      result.push(dynamicSection);
    }
  });
  
  return result;
}