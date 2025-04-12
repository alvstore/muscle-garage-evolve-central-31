
import React from "react";
import NavigationSection from "./NavigationSection";
import { NavSection } from "@/types/navigation";
import { usePermissions } from "@/hooks/use-permissions";

interface NavigationSectionsProps {
  sections: NavSection[];
  expandedSections: string[];
  toggleSection: (sectionName: string) => void;
  onLinkClick?: () => void;
}

const NavigationSections: React.FC<NavigationSectionsProps> = ({
  sections,
  expandedSections,
  toggleSection,
  onLinkClick
}) => {
  const { can } = usePermissions();
  
  // Filter sections and items based on user permissions
  const filteredSections = sections.map(section => {
    const filteredItems = section.items.filter(item => {
      if (item.children && item.children.length > 0) {
        const accessibleChildren = item.children.filter(child => can(child.permission));
        return accessibleChildren.length > 0 || can(item.permission);
      }
      return can(item.permission);
    });
    
    return {
      ...section,
      items: filteredItems
    };
  }).filter(section => section.items.length > 0);

  return (
    <div className="space-y-1 px-2">
      {filteredSections.map((section, index) => (
        <div key={index} className="mb-4">
          {section.name && (
            <div className="px-4 py-2 text-xs font-semibold text-indigo-300 tracking-wider">
              {section.name}
            </div>
          )}
          
          <NavigationSection
            section={section}
            isExpanded={expandedSections.includes(section.name)}
            onToggle={() => toggleSection(section.name)}
            onLinkClick={onLinkClick}
          />
        </div>
      ))}
    </div>
  );
};

export default NavigationSections;
