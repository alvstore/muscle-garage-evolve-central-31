import { NavSection, NavItem } from '@/types/navigation';
import { adminNavSections } from '@/data/adminNavigation';
import { routesToNavItems, groupNavItemsBySection } from '@/utils/route-navigation';
import { adminRoutes, crmRoutes, settingsRoutes, classRoutes } from '@/router/routes';

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
export function getEnhancedNavigation(userPermissions: string[]): NavSection[] {
  // Get static navigation
  const staticNavigation = [...adminNavSections];
  
  // Generate dynamic navigation from routes
  const allRoutes = [...adminRoutes, ...crmRoutes, ...settingsRoutes, ...classRoutes];
  const navItems = routesToNavItems(allRoutes);
  const filteredItems = navItems.filter(item => 
    userPermissions.includes(item.permission)
  );
  const dynamicSections = groupNavItemsBySection(filteredItems, sectionMap);
  
  // Merge static and dynamic navigation
  // This keeps the structure and order of static navigation
  // but adds any missing items from dynamic navigation
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