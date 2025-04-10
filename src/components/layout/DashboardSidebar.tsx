
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

// Import the new component modules
import SidebarHeader from "@/components/sidebar/SidebarHeader";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation";
import SidebarFooter from "@/components/sidebar/SidebarFooter";
import { sidebarNavigation } from "@/components/sidebar/navigationConfig";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function DashboardSidebar({ isSidebarOpen, closeSidebar }: DashboardSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard']);

  const toggleSection = (sectionName: string) => {
    if (expandedSections.includes(sectionName)) {
      setExpandedSections(expandedSections.filter(name => name !== sectionName));
    } else {
      setExpandedSections([...expandedSections, sectionName]);
    }
  };

  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent side="left" className="w-64 p-0 bg-[#283046] text-white border-none">
        <div className="flex flex-col h-full">
          <SidebarHeader />
          
          <SidebarNavigation 
            navigation={sidebarNavigation}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            closeSidebar={closeSidebar}
          />
          
          <SidebarFooter />
        </div>
      </SheetContent>
    </Sheet>
  );
}
