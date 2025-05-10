
import { useState } from 'react';
import { NavSection } from '@/types/navigation';

export const useNavigation = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard']);
  
  // Default sections - these would normally be generated from routes
  const sections: NavSection[] = [
    {
      name: 'Dashboard',
      items: [
        {
          label: 'Overview',
          href: '/dashboard',
          icon: 'LayoutDashboard',
          permission: 'access_dashboards'
        }
      ]
    },
    {
      name: 'Members',
      items: [
        {
          label: 'All Members',
          href: '/members',
          icon: 'Users',
          permission: 'view_members'
        }
      ]
    },
    {
      name: 'Settings',
      items: [
        {
          label: 'General',
          href: '/settings',
          icon: 'Settings',
          permission: 'manage_settings'
        }
      ]
    }
  ];
  
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      if (prev.includes(sectionName)) {
        return prev.filter(name => name !== sectionName);
      } else {
        return [...prev, sectionName];
      }
    });
  };
  
  return {
    sections,
    expandedSections,
    toggleSection
  };
};
