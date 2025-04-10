
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
      <SheetContent side="left" className="w-64 p-0 bg-[#2c2c44] text-white border-none">
        <MemberSidebarContent />
      </SheetContent>
    </Sheet>
  );
}
