
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItem } from "@/types/navigation";

interface SidebarNavItemProps {
  item: NavItem;
  onLinkClick?: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, onLinkClick }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default behavior for links to the current page
    if (isActive) {
      e.preventDefault();
      return;
    }
    
    // For mobile: close sidebar
    if (onLinkClick) {
      onLinkClick();
    }
  };
  
  return (
    <Link
      to={item.href}
      className={`
        flex items-center gap-2 py-2 px-3 text-sm rounded-md my-1 transition-colors
        ${isActive 
          ? 'bg-primary-500 text-white' 
          : 'text-white/70 hover:text-white hover:bg-white/10'}
      `}
      onClick={handleClick}
    >
      {/* Make sure the icon is always clickable with proper sizing */}
      {item.icon && (
        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {item.icon}
        </div>
      )}
      <span className="truncate">{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

export default SidebarNavItem;
