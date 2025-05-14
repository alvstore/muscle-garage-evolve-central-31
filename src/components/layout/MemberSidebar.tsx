
import React from "react";
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import MemberSidebarContent from "../sidebar/MemberSidebarContent";

interface MemberSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function MemberSidebar({ isSidebarOpen, closeSidebar }: MemberSidebarProps) {
  return (
    <Sidebar className={cn(
      "transition-all duration-300",
      isSidebarOpen ? "w-64" : "w-0"
    )}>
      <SidebarContent className="w-64 p-0 border-none">
        <div className="flex flex-col h-full bg-gradient-to-br from-indigo-950 to-blue-900 text-white">
          <MemberSidebarContent onLinkClick={closeSidebar} />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
