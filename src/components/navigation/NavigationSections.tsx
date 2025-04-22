
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavSection } from '@/types/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/use-permissions';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

interface NavigationSectionsProps {
  sections: NavSection[];
  expandedSections: string[];
  toggleSection: (name: string) => void;
  onLinkClick?: () => void;
}

const NavigationSections = ({
  sections,
  expandedSections,
  toggleSection,
  onLinkClick,
}: NavigationSectionsProps) => {
  const { hasPermission } = usePermissions();
  
  return (
    <div className="px-3 py-2">
      {sections.map((section) => {
        // Filter items based on permissions
        const permissionedItems = section.items.filter(item => 
          hasPermission(item.permission)
        );
        
        // If no items have permission, don't render the section
        if (permissionedItems.length === 0) {
          return null;
        }
        
        const isExpanded = expandedSections.includes(section.name);
        
        return (
          <div key={section.name} className="mb-4">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => toggleSection(section.name)}
            >
              <div className="flex items-center">
                {section.icon && <span className="mr-2">{section.icon}</span>}
                <span className="text-sm font-medium">{section.name}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {isExpanded && (
              <div className="mt-1 ml-2 space-y-1">
                {permissionedItems.map((item, index) => (
                  <PermissionGuard key={index} permission={item.permission}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => cn(
                        "flex items-center gap-2 py-2 px-3 text-sm rounded-md my-1 transition-colors",
                        isActive 
                          ? "bg-indigo-600 text-white" 
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                      onClick={() => {
                        if (onLinkClick) onLinkClick();
                      }}
                    >
                      {item.icon && item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                    
                    {/* Render child items if any */}
                    {item.children && item.children.length > 0 && isExpanded && (
                      <div className="pl-5 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <PermissionGuard key={childIndex} permission={child.permission}>
                            <NavLink
                              to={child.href}
                              className={({ isActive }) => cn(
                                "flex items-center gap-2 py-1 px-3 text-sm rounded-md my-1 transition-colors",
                                isActive 
                                  ? "bg-indigo-600/80 text-white" 
                                  : "text-white/60 hover:text-white hover:bg-white/5"
                              )}
                              onClick={() => {
                                if (onLinkClick) onLinkClick();
                              }}
                            >
                              <span>{child.label}</span>
                            </NavLink>
                          </PermissionGuard>
                        ))}
                      </div>
                    )}
                  </PermissionGuard>
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
