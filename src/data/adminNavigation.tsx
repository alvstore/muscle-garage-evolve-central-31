import { NavSection } from "@/types/navigation";
import { adminNavSections as importedNavSections, staffNavSections as importedStaffSections } from './navigation';

const adminNavSections = importedNavSections.map(section => {
  if (section.name === "Website") {
    return {
      ...section,
      items: section.items.map(item => {
        if (item.href === "/website") {
          return {
            ...item,
            href: "/admin/website"
          };
        }
        return item;
      })
    };
  }
  return section;
});

const staffNavSections = importedStaffSections;

export { adminNavSections, staffNavSections };
