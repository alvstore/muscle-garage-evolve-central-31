
import React from "react";
import { ChevronDown } from "lucide-react";
import { NavItem as NavItemType } from "@/types/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { RoutePermissionGuard } from "@/components/auth/PermissionGuard";
import * as LucideIcons from "lucide-react";

interface NavItemProps {
  item: NavItemType;
  expanded: boolean;
  toggleSection?: (name: string) => void;
  onClick?: () => void;
}

interface IconProps {
  name: string;
  className?: string;
}

// Icon component that dynamically loads an icon from lucide-react
const DynamicIcon = ({ name, className }: IconProps) => {
  if (!name) return null;
  
  // Type assertion to fix the TypeScript error
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Circle;
  return <IconComponent className={className} />;
};

export const NavItem = ({ item, expanded, toggleSection, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  const isChildActive = item.children?.some(child => location.pathname === child.href);
  
  if (!item.permission) return null;

  return (
    <RoutePermissionGuard permission={item.permission}>
      <li>
        {item.children ? (
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between py-2 text-indigo-200 hover:text-white hover:bg-indigo-800/50",
                (isActive || isChildActive) && "bg-indigo-800/50 text-white"
              )}
              onClick={() => toggleSection?.(item.label)}
            >
              <div className="flex items-center">
                {item.icon && <DynamicIcon name={item.icon} className="mr-2 h-5 w-5" />}
                <span>{item.label}</span>
              </div>
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", expanded && "transform rotate-180")}
              />
            </Button>
            {expanded && (
              <ul className="ml-6 space-y-1">
                {item.children.map((child, j) => (
                  <RoutePermissionGuard key={j} permission={child.permission || item.permission}>
                    <li>
                      <Button
                        asChild
                        variant="ghost"
                        className={cn(
                          "w-full justify-start hover:bg-indigo-800/50 py-1.5 text-sm text-indigo-200 hover:text-white",
                          location.pathname === child.href && "bg-indigo-800/50 text-white"
                        )}
                        onClick={onClick}
                      >
                        <Link to={child.href}>{child.label}</Link>
                      </Button>
                    </li>
                  </RoutePermissionGuard>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start py-2 text-indigo-200 hover:text-white hover:bg-indigo-800/50",
              isActive && "bg-indigo-800/50 text-white"
            )}
            onClick={onClick}
          >
            <Link to={item.href}>
              {item.icon && <DynamicIcon name={item.icon} className="mr-2 h-5 w-5" />}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          </Button>
        )}
      </li>
    </RoutePermissionGuard>
  );
};

interface NavigationSectionProps {
  name: string;
  items: NavItemType[];
  isExpanded: boolean;
  toggleSection: (name: string) => void;
  onLinkClick?: () => void;
}

const NavigationSection = ({ name, items, isExpanded, toggleSection, onLinkClick }: NavigationSectionProps) => {
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-indigo-100">{name}</h2>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <NavItem
            key={i}
            item={item}
            expanded={isExpanded}
            toggleSection={toggleSection}
            onClick={onLinkClick}
          />
        ))}
      </ul>
    </div>
  );
};

export default NavigationSection;
