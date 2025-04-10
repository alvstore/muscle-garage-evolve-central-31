
import React, { useState } from "react";
import { NavSection } from "@/data/memberNavigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";

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
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 px-3 rounded-md transition-colors hover:bg-white/10"
      >
        <span className="font-medium text-sm">{section.name}</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {isExpanded && (
        <div className="pl-2 space-y-1 mt-1">
          {section.items.map((item, idx) => (
            <SidebarNavItem key={idx} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarNavSection;
