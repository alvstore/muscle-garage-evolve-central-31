import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavSection } from '@/types/navigation';
import { usePermissions } from '@/hooks/auth/use-permissions';
import { getEnhancedNavigation } from '@/services/navigationService';

export function useNavigation() {
  // Use the can function from usePermissions instead of trying to destructure permissions
  const { can, userRole } = usePermissions();
  const location = useLocation();
  const [sections, setSections] = useState<NavSection[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard']);
  
  // Get navigation sections based on permissions
  useEffect(() => {
    // Instead of passing permissions array, pass the userRole
    // The navigationService will need to be updated to handle this
    const enhancedNavigation = getEnhancedNavigation(userRole);
    setSections(enhancedNavigation);
  }, [userRole]);
  
  // Auto-expand section based on current path
  useEffect(() => {
    const currentSection = getCurrentSectionFromPath(location.pathname);
    if (currentSection && !expandedSections.includes(currentSection)) {
      setExpandedSections(prev => [...prev, currentSection]);
    }
  }, [location.pathname, expandedSections]);
  
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };
  
  return {
    sections,
    expandedSections,
    toggleSection,
    activePath: location.pathname
  };
}

// Helper to determine section from path
function getCurrentSectionFromPath(path: string): string | null {
  const segment = path.split('/')[1] || 'dashboard';
  const sectionMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'members': 'Members',
    // ... other mappings
  };
  
  return sectionMap[segment] || null;
}