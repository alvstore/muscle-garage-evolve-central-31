
import React from "react";
import { NavSection as NavSectionType } from "@/types/navigation";
import NavigationSection from "./NavigationSection";

interface NavigationSectionsProps {
  sections: NavSectionType[];
  expandedSections: string[];
  toggleSection: (name: string) => void;
  onLinkClick?: () => void;
}

const NavigationSections = ({
  sections,
  expandedSections,
  toggleSection,
  onLinkClick
}: NavigationSectionsProps) => {
  return (
    <>
      {sections.map((section, i) => (
        <NavigationSection
          key={i}
          name={section.name}
          items={section.items}
          isExpanded={expandedSections.includes(section.name)}
          toggleSection={toggleSection}
          onLinkClick={onLinkClick}
        />
      ))}
    </>
  );
};

export default NavigationSections;
