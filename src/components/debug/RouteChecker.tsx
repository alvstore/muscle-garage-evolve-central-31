
import { useEffect } from 'react';
import { isValidRoute, getAllRoutes } from '@/utils/routeValidator';
import { adminNavSections } from '@/data/adminNavigation';
import { memberNavSections } from '@/data/memberNavigation';
import { trainerNavSections } from '@/data/trainerNavigation';

/**
 * Debug component that validates all navigation links against defined routes
 * Only runs in development mode
 */
const RouteChecker = () => {
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    console.log('🔍 Checking navigation links against defined routes...');
    
    // Get all defined routes
    const allRoutes = getAllRoutes();
    console.log('📍 Available routes:', allRoutes);
    
    // Check admin navigation
    checkNavSections(adminNavSections, 'Admin');
    
    // Check member navigation
    checkNavSections(memberNavSections, 'Member');
    
    // Check trainer navigation
    checkNavSections(trainerNavSections, 'Trainer');
    
  }, []);
  
  const checkNavSections = (sections: any[], navType: string) => {
    let invalidLinks: Array<{section: string, item: string, href: string}> = [];
    
    sections.forEach(section => {
      section.items.forEach((item: any) => {
        if (!isValidRoute(item.href)) {
          invalidLinks.push({
            section: section.name,
            item: item.label,
            href: item.href
          });
        }
        
        // Check children if any
        if (item.children) {
          item.children.forEach((child: any) => {
            if (!isValidRoute(child.href)) {
              invalidLinks.push({
                section: section.name,
                item: `${item.label} > ${child.label}`,
                href: child.href
              });
            }
          });
        }
      });
    });
    
    if (invalidLinks.length > 0) {
      console.warn(`⚠️ Found ${invalidLinks.length} invalid links in ${navType} navigation:`, invalidLinks);
    } else {
      console.log(`✅ All ${navType} navigation links are valid`);
    }
  };
  
  // This component doesn't render anything
  return null;
};

export default RouteChecker;
