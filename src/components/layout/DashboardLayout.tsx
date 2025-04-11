
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
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    return savedState === 'true';
  });
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
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
  
  // Auto-collapse sidebar for smaller screens but not mobile
  useEffect(() => {
    if (!isMobile && window.innerWidth < 1024 && window.innerWidth >= 768) {
      setIsCollapsed(true);
    }
  }, [isMobile]);
  
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#161d31] overflow-hidden">
      {/* Sidebar for desktop */}
      <div className={`fixed inset-y-0 z-30 transition-all duration-300 ${sidebarOpen ? 'left-0' : '-left-64'} hidden md:block ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        <SidebarComponent 
          isSidebarOpen={true} 
          closeSidebar={() => {}} 
          isCollapsed={isCollapsed} 
          toggleCollapse={toggleCollapse} 
        />
      </div>
      
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" 
          onClick={closeSidebar}
        />
      )}
      
      {/* Mobile sidebar */}
      {isMobile && (
        <div className={`fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <SidebarComponent isSidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
          </div>
        </div>
      )}
      
      <div className={`flex flex-1 flex-col w-full transition-all duration-300 ${sidebarOpen ? (isCollapsed ? 'md:pl-20' : 'md:pl-64') : 'md:pl-0'}`}>
        <DashboardHeader 
          toggleSidebar={toggleSidebar} 
          toggleTheme={toggleTheme} 
          isDarkMode={darkMode}
          sidebarOpen={sidebarOpen}
          isCollapsed={isCollapsed}
        />
        
        <main className="flex-1 relative z-10 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
