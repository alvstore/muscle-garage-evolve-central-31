
import React from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import MemberSidebarContent from "../sidebar/MemberSidebarContent";

interface MemberSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function MemberSidebar({ isSidebarOpen, closeSidebar }: MemberSidebarProps) {
  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent side="left" className="w-64 p-0 border-none overflow-hidden">
        <div className="flex flex-col h-full bg-gradient-to-br from-indigo-950 to-blue-900 text-white">
          <MemberSidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
