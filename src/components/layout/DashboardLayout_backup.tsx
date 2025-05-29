
// Backup of DashboardLayout.tsx as of sidebar-ui-cleanup-backup

import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/ui/use-mobile";
import { useAuth } from "@/hooks/auth/use-auth";
import { Loader2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import MemberSidebar from "../members/MemberSidebar";
import TrainerSidebar from "./TrainerSidebar";
import DashboardHeader from "@/components/dashboard/sections/DashboardHeader";
import { Toaster } from "sonner";

const DashboardLayout = () => {
  const { user, isLoading, logout } = useAuth();
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-indigo-600" />
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <UserCircle className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-lg font-medium">No user found. Please login again.</p>
          <Button
            className="mt-4"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Determine which sidebar to show based on the user role
  const getSidebarComponent = () => {
    switch (user.role) {
      case 'member':
        return MemberSidebar;
      case 'trainer':
        return TrainerSidebar;
      case 'admin':
      case 'staff':
      default:
        return DashboardSidebar;
    }
  };

  const SidebarComponent = getSidebarComponent();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        {/* Sidebar - always render but control visibility with classes */}
        <div className={`fixed md:relative transition-all duration-300 h-full z-40 ${sidebarOpen ? 'translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full'} md:translate-x-0`}>
          <SidebarComponent isSidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <DashboardHeader 
            toggleSidebar={toggleSidebar} 
            toggleTheme={toggleTheme} 
            isDarkMode={darkMode}
            sidebarOpen={sidebarOpen}
          />
          
          <main className="p-4 relative bg-gray-50 dark:bg-gray-900 overflow-y-auto h-[calc(100vh-64px)]">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </SidebarProvider>
  );
};

export default DashboardLayout;
