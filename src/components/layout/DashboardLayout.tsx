
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "./DashboardSidebar";
import MemberSidebar from "./MemberSidebar";
import TrainerSidebar from "./TrainerSidebar";
import DashboardHeader from "@/components/dashboard/sections/DashboardHeader";

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <div 
        className={`fixed inset-y-0 z-20 transition-all duration-300 ${
          sidebarOpen ? 'left-0' : '-left-64'
        } hidden md:block md:w-64`}
      >
        <SidebarComponent isSidebarOpen={true} closeSidebar={() => {}} />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <div className={`fixed inset-0 z-30 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <SidebarComponent isSidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
        </div>
      )}
      
      {/* Main Content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${
        sidebarOpen ? 'md:ml-64' : 'md:ml-0'
      }`}>
        <DashboardHeader 
          toggleSidebar={toggleSidebar} 
          toggleTheme={toggleTheme} 
          isDarkMode={darkMode}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 p-4 relative z-0 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
