
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SheetClose } from "@/components/ui/sheet";
import { NavItem } from "@/types/navigation";

interface SidebarNavItemProps {
  item: NavItem;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item }) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(item.href);
  };
  
  return (
    <SheetClose asChild>
      <NavLink
        to={item.href}
        className={({ isActive }) => `
          flex items-center gap-2 py-2 px-3 text-sm rounded-md my-1 transition-colors
          ${isActive 
            ? 'bg-indigo-600 text-white' 
            : 'text-white/70 hover:text-white hover:bg-white/10'}
        `}
        onClick={handleClick}
      >
        {item.icon && item.icon}
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    </SheetClose>
  );
};

export default SidebarNavItem;
