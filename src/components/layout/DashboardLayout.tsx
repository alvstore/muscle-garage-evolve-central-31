import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import MemberSidebar from "./MemberSidebar";
import TrainerSidebar from "./TrainerSidebar";
import DashboardHeader from "@/components/dashboard/sections/DashboardHeader";
import { Toaster } from "sonner";

const DashboardLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const isMobile = useIsMobile();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  // Removed sidebarOpen and local sidebar handlers
  const location = useLocation();
  const navigate = useNavigate();

  // Use Shadcn sidebar context
  const { toggleSidebar } = useSidebar();

  // Keep closeSidebar, but trigger on Shadcn sidebar (if mobile)
  const closeSidebar = () => {};

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

  // Sidebar mobile auto-close: handled by shadcn sidebar
  // If you need to close on route, can be added here via useSidebar

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
        {/* Sidebar */}
        <div className="fixed md:relative transition-all duration-300 h-full z-40">
          <SidebarComponent /* isSidebarOpen and closeSidebar props remain for legacy, but shadcn manages state */ />
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <DashboardHeader 
            toggleSidebar={toggleSidebar} // now uses shadcn context, mobile/desktop supported
            toggleTheme={toggleTheme} 
            isDarkMode={darkMode}
            sidebarOpen={true} // not used anymore
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
