
import { useState, useEffect, ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/providers/ThemeProvider";
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
  const { mode, primaryColor, setMode, setPrimaryColor } = useTheme();
  
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    // Update sidebar state when screen size changes
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'semi-dark';
      return 'light';
    });
  };

  const changeThemeMode = (newMode: 'light' | 'dark' | 'semi-dark') => {
    setMode(newMode);
  };
  
  const changePrimaryColor = (color: 'blue' | 'purple' | 'orange' | 'red' | 'teal') => {
    setPrimaryColor(color);
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
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
           onClick={() => setSidebarOpen(false)}></div>
           
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:z-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <SidebarComponent isSidebarOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          toggleSidebar={toggleSidebar}
          toggleTheme={toggleTheme}
          currentThemeMode={mode}
          currentPrimaryColor={primaryColor}
          changeThemeMode={changeThemeMode}
          changePrimaryColor={changePrimaryColor}
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
