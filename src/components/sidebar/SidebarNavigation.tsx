
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Permission, usePermissions } from "@/hooks/use-permissions";
import { RoutePermissionGuard } from "@/components/auth/PermissionGuard";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

// Updated interface for sidebar child items allowing optional icon
interface SidebarChildItem {
  href: string;
  label: string;
  permission: Permission;
  icon?: ReactNode; // Make icon optional for children
}

// Main sidebar item interface
export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode; // Icon required for main items
  badge?: string;
  permission: Permission;
  children?: SidebarChildItem[]; // Use the child-specific interface
}

interface SidebarNavigationProps {
  items: SidebarItem[];
  closeSidebar: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ items, closeSidebar }) => {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard']);

  const toggleSection = (sectionName: string) => {
    if (expandedSections.includes(sectionName)) {
      setExpandedSections(expandedSections.filter(name => name !== sectionName));
    } else {
      setExpandedSections([...expandedSections, sectionName]);
    }
  };

  // Filter items based on user permissions
  const filteredItems = items.filter(item => {
    if (item.children && item.children.length > 0) {
      const accessibleChildren = item.children.filter(child => can(child.permission));
      return accessibleChildren.length > 0 || can(item.permission);
    }
    return can(item.permission);
  });

  return (
    <div className="space-y-1">
      {filteredItems.map((item, itemIndex) => {
        const hasChildren = item.children && item.children.length > 0;
        const filteredChildren = hasChildren 
          ? item.children!.filter(child => can(child.permission))
          : [];
        const showChildren = hasChildren && filteredChildren.length > 0;
        const isExpanded = expandedSections.includes(item.label);
        
        return (
          <RoutePermissionGuard 
            key={itemIndex} 
            permission={item.permission}
          >
            <div className="mb-1">
              <button
                onClick={() => showChildren ? toggleSection(item.label) : navigate(item.href)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1e2740] transition-colors ${isExpanded ? 'bg-[#1e2740]' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.badge && (
                    <Badge variant="default" className="mr-2 bg-red-500 hover:bg-red-600">
                      {item.badge}
                    </Badge>
                  )}
                  {showChildren && (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </div>
              </button>
              
              {showChildren && isExpanded && (
                <div className="mt-1 py-1 bg-[#161d31]">
                  {filteredChildren.map((child, childIndex) => (
                    <RoutePermissionGuard 
                      key={childIndex} 
                      permission={child.permission}
                    >
                      <NavLink
                        to={child.href}
                        className={({ isActive }) => `
                          flex items-center gap-2 py-2 px-10 text-sm my-1 transition-colors
                          ${isActive 
                            ? 'text-indigo-400 font-medium' 
                            : 'text-gray-300 hover:text-white'}
                        `}
                        onClick={closeSidebar}
                      >
                        {child.icon ? child.icon : <Circle className="h-2 w-2" />}
                        <span>{child.label}</span>
                      </NavLink>
                    </RoutePermissionGuard>
                  ))}
                </div>
              )}
            </div>
          </RoutePermissionGuard>
        );
      })}
    </div>
  );
};

export default SidebarNavigation;
