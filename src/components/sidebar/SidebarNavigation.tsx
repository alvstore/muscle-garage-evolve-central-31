
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissions, Permission } from "@/hooks/use-permissions";
import SidebarCategory from "./SidebarCategory";

export interface NavigationCategory {
  name: string;
  items: {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    permission: Permission;
    children?: {
      href: string;
      label: string;
      permission: Permission;
    }[];
  }[];
}

interface SidebarNavigationProps {
  navigation: NavigationCategory[];
  expandedSections: string[];
  toggleSection: (sectionName: string) => void;
  closeSidebar: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  navigation,
  expandedSections,
  toggleSection,
  closeSidebar
}) => {
  const { can } = usePermissions();
  
  // Filter navigation items based on user permissions
  const filteredNavigation = navigation.map(category => {
    const filteredItems = category.items.filter(item => {
      if (item.children && item.children.length > 0) {
        const accessibleChildren = item.children.filter(child => can(child.permission));
        return accessibleChildren.length > 0 || can(item.permission);
      }
      return can(item.permission);
    });
    
    return {
      ...category,
      items: filteredItems
    };
  }).filter(category => category.items.length > 0);

  return (
    <ScrollArea className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-200px)]">
      {filteredNavigation.map((category, index) => (
        <SidebarCategory
          key={index}
          name={category.name}
          items={category.items}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          closeSidebar={closeSidebar}
          can={can}
        />
      ))}
    </ScrollArea>
  );
};

export default SidebarNavigation;
