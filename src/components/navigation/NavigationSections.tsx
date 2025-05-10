
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavSection } from '@/types/navigation';
import { usePermissions } from '@/hooks/use-permissions';
import { ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';

interface NavigationSectionsProps {
  sections: NavSection[];
  expandedSections: string[];
  toggleSection: (sectionName: string) => void;
  onLinkClick?: () => void;
}

const NavigationSections: React.FC<NavigationSectionsProps> = ({
  sections,
  expandedSections,
  toggleSection,
  onLinkClick
}) => {
  const { hasPermission } = usePermissions();

  // Dynamic icon component
  const DynamicIcon = ({ iconName }: { iconName?: string }) => {
    if (!iconName) return null;
    
    // @ts-ignore - iconName is a string that corresponds to a Lucide icon
    const LucideIcon = Icons[iconName];
    
    if (!LucideIcon) return null;
    
    return <LucideIcon className="h-4 w-4 mr-2" />;
  };

  return (
    <div className="space-y-1 px-3">
      {sections.map((section) => {
        // Filter items by permission
        const permittedItems = section.items.filter(
          item => !item.permission || hasPermission(item.permission)
        );
        
        // Skip empty sections
        if (permittedItems.length === 0) return null;
        
        const isExpanded = expandedSections.includes(section.name);
        
        return (
          <div key={section.name} className="mb-4">
            <button
              onClick={() => toggleSection(section.name)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <span>{section.name}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {isExpanded && (
              <div className="mt-1 ml-2 space-y-1">
                {permittedItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onLinkClick}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm rounded-md ${
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`
                    }
                  >
                    <DynamicIcon iconName={item.icon} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NavigationSections;
