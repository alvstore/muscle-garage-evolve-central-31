
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/Logo";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation";
import { navigation } from "@/components/sidebar/navigationConfig";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function DashboardSidebar({ isSidebarOpen, closeSidebar }: DashboardSidebarProps) {
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
      <SheetContent side="left" className="w-64 p-0 bg-[#283046] text-white border-none">
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center gap-3 border-b border-gray-700">
            <div className="bg-indigo-600 p-1 rounded-md">
              <Logo variant="white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Muscle Garage</h1>
          </div>
          
          {/* Apply max-height and overflow-y-auto to enable scrolling */}
          <div className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-200px)]">
            {navigation.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                {category.name && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 tracking-wider">
                    {category.name}
                  </div>
                )}
                
                <SidebarNavigation
                  items={category.items}
                  closeSidebar={closeSidebar}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-auto p-4">
            <Separator className="my-2 bg-gray-700" />
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2740]"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-5 w-5" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
