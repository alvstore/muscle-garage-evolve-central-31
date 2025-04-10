
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  Bell,
  User as UserIcon,
  Sun,
  Moon,
  LogOut,
  Search,
  Menu,
  UserCircle,
  Loader2
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import BranchSelector from '@/components/branch/BranchSelector';
import { useAuth } from "@/hooks/use-auth";
import DashboardSidebar from "./DashboardSidebar";
import MemberSidebar from "./MemberSidebar";

const DashboardLayout = () => {
  const { user, isLoading, logout } = useAuth();
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
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

  // Get the title for the current page
  const getPageTitle = () => {
    const pathname = location.pathname;
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/members")) return "Members";
    if (pathname.startsWith("/trainers")) return "Trainers";
    if (pathname.startsWith("/classes")) return "Classes";
    if (pathname.startsWith("/membership")) return "Membership";
    if (pathname.startsWith("/attendance")) return "Attendance";
    if (pathname.startsWith("/finance")) return "Finance";
    if (pathname.startsWith("/inventory")) return "Inventory";
    if (pathname.startsWith("/store")) return "Store";
    if (pathname.startsWith("/crm")) return "CRM";
    if (pathname.startsWith("/marketing")) return "Marketing";
    if (pathname.startsWith("/communication")) return "Communication";
    if (pathname.startsWith("/reports")) return "Reports";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/branches")) return "Branches";
    return "Dashboard";
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
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
  const SidebarComponent = user.role === 'member' ? MemberSidebar : DashboardSidebar;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden md:block md:w-64 fixed inset-y-0">
        <SidebarComponent isSidebarOpen={true} closeSidebar={() => {}} />
      </div>
      
      {/* Mobile sidebar */}
      <SidebarComponent isSidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      
      <div className="flex flex-1 flex-col w-full md:pl-64">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={toggleSidebar}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800 dark:text-white">
                {getPageTitle()}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                  3
                </Badge>
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-indigo-600 text-white text-xs">
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{user?.name || 'User'}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'User'}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/members/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
