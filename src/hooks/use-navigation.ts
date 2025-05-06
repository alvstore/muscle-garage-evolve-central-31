import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavSection } from '@/types/navigation';
import { usePermissions } from '@/hooks/use-permissions';
import { getEnhancedNavigation } from '@/services/navigationService';

export function useNavigation() {
  const { permissions } = usePermissions();
  const location = useLocation();
  const [sections, setSections] = useState<NavSection[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard']);
  
  // Get navigation sections based on permissions
  useEffect(() => {
    const enhancedNavigation = getEnhancedNavigation(permissions);
    setSections(enhancedNavigation);
  }, [permissions]);
  
  // Auto-expand section based on current path
  useEffect(() => {
    const currentSection = getCurrentSectionFromPath(location.pathname);
    if (currentSection && !expandedSections.includes(currentSection)) {
      setExpandedSections(prev => [...prev, currentSection]);
    }
  }, [location.pathname]);
  
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