
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarNavItem from "./SidebarNavItem";
import { NavSection } from "@/types/navigation";

interface SidebarNavSectionProps {
  section: NavSection;
  isExpanded: boolean;
  onToggle: () => void;
  onLinkClick?: () => void;
}

const SidebarNavSection: React.FC<SidebarNavSectionProps> = ({
  section,
  isExpanded,
  onToggle,
  onLinkClick,
}) => {
  return (
    <div className="mb-3">
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center text-white/80 hover:text-white hover:bg-white/10"
        onClick={onToggle}
      >
        <span className="text-sm font-medium">{section.name}</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      
      {isExpanded && (
        <div className="mt-1 ml-2 space-y-1">
          {section.items.map((item, index) => (
            <SidebarNavItem key={index} item={item} onLinkClick={onLinkClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarNavSection;
