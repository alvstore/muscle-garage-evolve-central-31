
import React from "react";
import { Permission } from "@/hooks/use-permissions";
import { RoutePermissionGuard } from "@/components/auth/PermissionGuard";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  permission: Permission;
  badge?: string;
  children?: SidebarItem[];
}

export interface SidebarCategoryProps {
  name: string;
  items: SidebarItem[];
  expandedSections: string[];
  toggleSection: (name: string) => void;
  closeSidebar: () => void;
  can: (permission: Permission, isOwner?: boolean) => boolean;
}

const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  name,
  items,
  expandedSections,
  toggleSection,
  closeSidebar,
  can
}) => {
  const navigate = useNavigate();
  
  return (
    <div key={name} className="mb-4">
      {name && (
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 tracking-wider">
          {name}
        </div>
      )}
      
      <div className="space-y-1">
        {items.map((item, itemIndex) => {
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
                          <Circle className="h-2 w-2" />
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
    </div>
  );
};

export default SidebarCategory;
