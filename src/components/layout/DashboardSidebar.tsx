
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/Logo";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation";
import { navigation } from "@/components/sidebar/navigationConfig";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export default function DashboardSidebar({ 
  isSidebarOpen, 
  closeSidebar, 
  isCollapsed = false,
  toggleCollapse 
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();

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
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent 
        side="left" 
        className={`w-${isCollapsed ? '20' : '64'} p-0 bg-[#283046] text-white border-none transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center gap-3 border-b border-gray-700 justify-between">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="bg-indigo-600 p-1 rounded-md">
                <Logo variant="white" />
              </div>
              {!isCollapsed && <h1 className="text-xl font-semibold text-white">Muscle Garage</h1>}
            </div>
            {toggleCollapse && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleCollapse}
                className="text-gray-300 hover:text-white hover:bg-[#1e2740]"
              >
                <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-200px)] hide-scrollbar">
            {navigation.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                {category.name && !isCollapsed && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 tracking-wider">
                    {category.name}
                  </div>
                )}
                
                <SidebarNavigation
                  items={category.items}
                  closeSidebar={closeSidebar}
                  isCollapsed={isCollapsed}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-auto p-4">
            <Separator className="my-2 bg-gray-700" />
            <Button
              variant="ghost"
              className={`w-full justify-${isCollapsed ? 'center' : 'start'} text-gray-300 hover:text-white hover:bg-[#1e2740]`}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className={`${isCollapsed ? '' : 'mr-2'} h-5 w-5`} />
              {!isCollapsed && (isLoggingOut ? "Logging out..." : "Logout")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
