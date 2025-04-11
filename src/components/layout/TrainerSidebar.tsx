
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import TrainerSidebarContent from "@/components/sidebar/TrainerSidebarContent";

interface TrainerSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

const TrainerSidebar: React.FC<TrainerSidebarProps> = ({ 
  isSidebarOpen, 
  closeSidebar 
}) => {
  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent 
        side="left" 
        className={cn(
          "w-64 p-0 border-none bg-[#283046] text-white"
        )}
      >
        <TrainerSidebarContent />
      </SheetContent>
    </Sheet>
  );
};

export default TrainerSidebar;
