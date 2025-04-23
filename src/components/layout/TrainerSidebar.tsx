
import React from "react";
import {
  Sidebar,
  SidebarContent,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import TrainerSidebarContent from "../sidebar/TrainerSidebarContent";

export default function TrainerSidebar() {
  const { open } = useSidebar();
  
  return (
    <Sidebar className={cn(
      "transition-all duration-300",
      open ? "w-64" : "w-0"
    )}>
      <SidebarContent className="w-64 p-0 border-none">
        <div className="flex flex-col h-full bg-gradient-to-br from-indigo-950 to-blue-900 text-white">
          <TrainerSidebarContent />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
