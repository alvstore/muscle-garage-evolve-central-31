import React from "react";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { NavSection, Permission } from "@/types/navigation";
import { RoutePermissionGuard } from "@/components/auth/PermissionGuard";
import { usePermissions } from "@/hooks/use-permissions";

interface NavigationSectionProps {
  section: NavSection;
  isExpanded: boolean;
  onToggle: () => void;
  onLinkClick?: () => void;
}

const NavigationSection: React.FC<NavigationSectionProps> = ({
  section,
  isExpanded,
  onToggle,
  onLinkClick
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { can } = usePermissions();
  
  // Check if a route is active (including child routes)
  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Handle navigation with React Router
  const handleNavigation = (href: string, hasChildren: boolean, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default browser navigation
    
    if (hasChildren) {
      onToggle();
    } else {
      if (onLinkClick) {
        onLinkClick();
      }
      navigate(href);
    }
  };
  
  return (
    <div className="space-y-1">
      {section.items.map((item, itemIndex) => {
        const hasChildren = item.children && item.children.length > 0;
        const filteredChildren = hasChildren 
          ? item.children!.filter(child => can(child.permission as Permission))
          : [];
        const showChildren = hasChildren && filteredChildren.length > 0;
        const isActive = isRouteActive(item.href);
        
        return (
          <RoutePermissionGuard 
            key={itemIndex} 
            permission={item.permission as Permission}
          >
            <div className="mb-1">
              <button
                onClick={(e) => handleNavigation(item.href, showChildren, e)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-800/70 text-white before:absolute before:left-0 before:h-full before:w-1 before:bg-white" 
                    : "text-indigo-100 hover:bg-indigo-800/50 hover:text-white",
                  "relative"
                )}
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
                <div className="mt-1 py-1 bg-indigo-900/50">
                  {filteredChildren.map((child, childIndex) => (
                    <RoutePermissionGuard 
                      key={childIndex} 
                      permission={child.permission as Permission}
                    >
                      <NavLink
                        to={child.href}
                        className={({ isActive }) => cn(
                          "flex items-center gap-2 py-2 px-10 text-sm my-1 transition-colors",
                          isActive 
                            ? "text-white font-medium bg-indigo-800/30" 
                            : "text-indigo-200 hover:text-white hover:bg-indigo-800/20"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onLinkClick) onLinkClick();
                          navigate(child.href);
                        }}
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
  );
};

export default NavigationSection;
