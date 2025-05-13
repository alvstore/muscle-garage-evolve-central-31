
import React, { useState, useEffect, ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import DashboardSidebar from "./DashboardSidebar";
import MemberSidebar from "./MemberSidebar";
import TrainerSidebar from "./TrainerSidebar";
import DashboardHeader from "@/components/dashboard/sections/DashboardHeader";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, isLoading } = useAuth();
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    // Apply or remove dark mode class based on state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    );
  }
  
  let SidebarComponent;
  
  switch (user?.role) {
    case 'member':
      SidebarComponent = MemberSidebar;
      break;
    case 'trainer':
      SidebarComponent = TrainerSidebar;
      break;
    default:
      SidebarComponent = DashboardSidebar;
  }
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:inset-y-0 lg:z-0 lg:translate-x-0`}
      >
        <SidebarComponent isSidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          toggleSidebar={toggleSidebar}
          toggleTheme={toggleTheme}
          isDarkMode={darkMode}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
          {children || <Outlet />}
        </main>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default DashboardLayout;
