
import React, { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/Logo";
import NavigationSections from "@/components/navigation/NavigationSections";
import { adminNavSections } from "@/data/adminNavigation";
import BranchSelector from "@/components/branch/BranchSelector";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function DashboardSidebar({
  isSidebarOpen,
  closeSidebar
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    logout,
    user
  } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard']);

  const toggleSection = (sectionName: string) => {
    if (expandedSections.includes(sectionName)) {
      setExpandedSections(expandedSections.filter(name => name !== sectionName));
    } else {
      setExpandedSections([...expandedSections, sectionName]);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    // Update the Sidebar component to not use conditional width
    <Sidebar className="w-64"> {/* Remove the conditional width */}
      <SidebarContent className="w-64 p-0 border-none">
        <div className="flex flex-col h-full bg-gradient-to-br from-indigo-950 to-blue-900 text-white">
          <SidebarHeader className="p-4">
            <div className="flex flex-col gap-3">
              <div className="p-1 rounded-md px-[27px] py-[8px] mx-0 my-0 bg-slate-50 overflow-hidden">
                <div className="w-36 truncate">
                  <Logo variant="default" />
                </div>
              </div>
              {user?.role === "admin" && (
                <PermissionGuard permission="view_branch_data">
                  <div className="max-w-full">
                    <BranchSelector />
                  </div>
                </PermissionGuard>
              )}
            </div>
          </SidebarHeader>
          <ScrollArea className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-200px)]">
            <NavigationSections 
              sections={adminNavSections} 
              expandedSections={expandedSections} 
              toggleSection={toggleSection} 
              onLinkClick={closeSidebar} 
            />
          </ScrollArea>
          <SidebarFooter className="mt-auto p-4">
            <Separator className="my-2 bg-indigo-800" />
            <Button 
              variant="ghost" 
              className="w-full justify-start text-indigo-200 hover:text-white hover:bg-indigo-800/50" 
              onClick={handleLogout} 
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-5 w-5" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </SidebarFooter>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
