
import React from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import TrainerSidebarContent from "@/components/sidebar/TrainerSidebarContent";

interface TrainerSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

const TrainerSidebar: React.FC<TrainerSidebarProps> = ({ 
  isSidebarOpen, 
  closeSidebar,
  isCollapsed = false,
  toggleCollapse 
}) => {
  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent 
        side="left" 
        className={cn(
          "p-0 border-none bg-[#283046] text-white transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
        showCloseButton={false}
      >
        <TrainerSidebarContent isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </SheetContent>
    </Sheet>
  );
};

export default TrainerSidebar;
