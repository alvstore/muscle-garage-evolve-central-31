
import React from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import MemberSidebarContent from "../sidebar/MemberSidebarContent";
import { cn } from "@/lib/utils";

interface MemberSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export default function MemberSidebar({ 
  isSidebarOpen, 
  closeSidebar,
  isCollapsed = false,
  toggleCollapse 
}: MemberSidebarProps) {
  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent 
        side="left" 
        className={cn(
          "p-0 bg-[#2c2c44] text-white border-none overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
        showCloseButton={false}
      >
        <MemberSidebarContent isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </SheetContent>
    </Sheet>
  );
}
