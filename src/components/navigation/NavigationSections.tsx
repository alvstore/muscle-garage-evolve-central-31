
import React from 'react';
import NavigationSection from './NavigationSection';
import { NavSection } from '@/types/navigation';

interface NavigationSectionsProps {
  sections: NavSection[];
  expandedSections: string[];
  toggleSection: (section: string) => void;
  onLinkClick?: () => void;
}

const NavigationSections: React.FC<NavigationSectionsProps> = ({
  sections,
  expandedSections,
  toggleSection,
  onLinkClick
}) => {
  if (!sections || sections.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-center text-muted-foreground">
        No navigation items available
      </div>
    );
  }

  return (
    <div className="space-y-2 px-1">
      {sections.map((section, index) => (
        <NavigationSection
          key={`${section.name}-${index}`}
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
