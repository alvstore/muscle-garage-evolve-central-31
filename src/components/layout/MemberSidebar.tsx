
import React from "react";
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import MemberSidebarContent from "../sidebar/MemberSidebarContent";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MemberSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function MemberSidebar({ isSidebarOpen, closeSidebar }: MemberSidebarProps) {
  const isMobile = useIsMobile();

  return (
    <Sidebar className={cn(
      "transition-all duration-300 h-full",
      isSidebarOpen ? "w-64" : "w-0"
    )}>
      <SidebarContent className="w-64 p-0 border-none">
        <div className="flex flex-col h-full bg-gradient-to-br from-indigo-950 to-blue-900 text-white">
          {/* Mobile close button */}
          {isMobile && (
            <div className="absolute top-4 right-4 z-50">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={closeSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          <MemberSidebarContent onLinkClick={closeSidebar} />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
