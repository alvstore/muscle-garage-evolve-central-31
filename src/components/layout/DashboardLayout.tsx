
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/dashboard/sections/DashboardHeader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader 
            toggleSidebar={toggleSidebar} 
            toggleTheme={toggleTheme} 
            isDarkMode={theme === "dark"}
            sidebarOpen={isSidebarOpen}
          />
          
          <div className="p-4 md:p-6 flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
