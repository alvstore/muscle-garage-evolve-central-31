
import { useState, useEffect, ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/ui/use-mobile";
import { useAuth } from "@/hooks/auth/use-auth";
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
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        onClick={(e) => {
          // Prevent clicks on the sidebar from closing it
          e.stopPropagation();
        }}
      >
        <SidebarComponent 
          isSidebarOpen={sidebarOpen} 
          closeSidebar={() => setSidebarOpen(false)} 
        />
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
