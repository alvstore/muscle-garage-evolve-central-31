
import React from "react";
import NavigationSection from "@/components/navigation/NavigationSection";
import { NavSection } from "@/types/navigation";

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
  onLinkClick,
}) => {
  return (
    <div className="px-2 py-1">
      {sections.map((section) => (
        <NavigationSection
          key={section.name}
          section={section}
          isExpanded={expandedSections.includes(section.name)}
          onToggle={() => toggleSection(section.name)}
          onLinkClick={onLinkClick}
        />
      ))}
    </div>
  );
};

export default NavigationSections;
