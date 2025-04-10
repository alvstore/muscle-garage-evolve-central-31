
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import { NavSection } from "@/data/memberNavigation";

interface SidebarNavSectionProps {
  section: NavSection;
  isExpanded: boolean;
  onToggle: () => void;
}

const SidebarNavSection: React.FC<SidebarNavSectionProps> = ({ 
  section, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          {section.icon}
          <span>{section.name}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-1 pl-4">
          {section.items.map((item, itemIndex) => (
            <SidebarNavItem key={itemIndex} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarNavSection;
