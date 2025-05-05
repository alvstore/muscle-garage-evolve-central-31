
import { useState, useEffect, ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
    // Update sidebar state when screen size changes
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <SidebarComponent isSidebarOpen={sidebarOpen} closeSidebar={toggleSidebar} />
      </div>
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          toggleSidebar={toggleSidebar}
          toggleTheme={toggleTheme}
          isDarkMode={darkMode}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto px-4 py-6">
          {children || <Outlet />}
        </main>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default DashboardLayout;
