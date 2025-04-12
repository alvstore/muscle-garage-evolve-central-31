
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
          "w-64 p-0 border-none overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full bg-gradient-to-br from-indigo-950 to-blue-900 text-white">
          <TrainerSidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TrainerSidebar;
