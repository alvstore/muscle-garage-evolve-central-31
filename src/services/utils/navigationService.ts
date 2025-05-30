import { NavSection } from '@/types/navigation';
import { adminNavSections } from '@/data/adminNavigation';
import { routesToNavItems, groupNavItemsBySection } from '@/utils/route-navigation';
import AdminRoutes from '@/router/AdminRoutes';
import { crmRoutes } from '@/router/routes/crmRoutes';
import { settingsRoutes } from '@/router/routes/settingsRoutes';
import { classRoutes } from '@/router/routes/classRoutes';
import type { Permission } from '@/hooks/auth/use-permissions';

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
  try {
    // Get static navigation
    const staticNavigation = [...adminNavSections];
    
    // Generate dynamic navigation from routes
    const allRoutes = [
      ...(AdminRoutes?.children || []), 
      ...(crmRoutes || []), 
      ...(settingsRoutes || []), 
      ...(classRoutes || [])
    ];
    
    const navItems = routesToNavItems(allRoutes);
    
    // If no user role, return only public items or empty array
    if (!userRole) {
      console.warn('No user role provided to getEnhancedNavigation');
      return [];
    }
    
    // Filter items based on role and permissions
    const filteredItems = navItems.filter(item => {
      try {
        // Admin sees everything
        if (userRole === 'admin') return true;
        
        // Map permissions to roles based on the Permission type from use-permissions
        const rolePermissions: Record<string, Permission[]> = {
          'staff': [
            'view:dashboard',
            'view:members',
            'create:members',
            'edit:members',
            'view:classes',
            'create:classes',
            'edit:classes',
            'view:memberships',
            'create:memberships',
            'edit:memberships',
            'view:reports'
          ] as Permission[],
          'trainer': [
            'view:dashboard',
            'view:members',
            'view:classes',
            'view:memberships'
          ] as Permission[],
          'member': [
            'view:dashboard',
            'view:classes',
            'view:memberships'
          ] as Permission[]
        };
        
        // Check if the user's role has the required permission for this item
        const userPermissions = rolePermissions[userRole] || [];
        const hasPermission = item.permission ? userPermissions.includes(item.permission as Permission) : false;
        
        return hasPermission;
      } catch (error) {
        console.error('Error filtering navigation items:', error);
        return false;
      }
    });
    
    const dynamicSections = groupNavItemsBySection(filteredItems, sectionMap);
    
    // Merge static and dynamic navigation
    return mergeNavigations(staticNavigation, dynamicSections);
  } catch (error) {
    console.error('Error in getEnhancedNavigation:', error);
    // Return a minimal navigation to prevent UI breakage
    return [{
      name: 'Dashboard',
      items: [{
        href: '/dashboard',
        label: 'Dashboard',
        permission: 'view:dashboard' as const,
        icon: '🏠'
      }]
    }];
  }
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