
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
    if (adminNavSections) {
      checkNavSections(adminNavSections, 'Admin');
    }
    
    // Check member navigation
    if (memberNavSections) {
      checkNavSections(memberNavSections, 'Member');
    }
    
    // Check trainer navigation - this is likely the issue
    // Make sure trainerNavSections exists and is properly formatted
    if (trainerNavSections && Array.isArray(trainerNavSections)) {
      checkNavSections(trainerNavSections, 'Trainer');
    }
    
  }, []);
  
  const checkNavSections = (sections: any[], navType: string) => {
    if (!sections || !Array.isArray(sections)) {
      console.warn(`⚠️ ${navType} navigation sections is not a valid array`);
      return;
    }
    
    let invalidLinks: Array<{section: string, item: string, href: string}> = [];
    
    sections.forEach(section => {
      // Check if section has items array before iterating
      if (!section || !section.items || !Array.isArray(section.items)) {
        console.warn(`⚠️ Invalid section structure in ${navType} navigation:`, section);
        return;
      }
      
      section.items.forEach((item: any) => {
        if (!isValidRoute(item.href)) {
          invalidLinks.push({
            section: section.name || 'Unknown Section',
            item: item.label || item.title || 'Unknown Item',
            href: item.href
          });
        }
        
        // Check children if any
        if (item.children && Array.isArray(item.children)) {
          item.children.forEach((child: any) => {
            if (!isValidRoute(child.href)) {
              invalidLinks.push({
                section: section.name || 'Unknown Section',
                item: `${item.label || item.title || 'Unknown Item'} > ${child.label || child.title || 'Unknown Child'}`,
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
