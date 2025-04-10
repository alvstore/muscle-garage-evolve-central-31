
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Dumbbell, 
  CreditCard, 
  ShoppingCart, 
  Activity, 
  Settings, 
  Menu, 
  Box, 
  UserCircle,
  BarChart3,
  MessageSquare,
  Package, 
  PieChart, 
  Bell,
  UserPlus,
  LogOut,
  LucideIcon,
  Search,
  Sun,
  Moon,
  BarChartHorizontal,
  Package2,
  Gauge,
  ChevronRight,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
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

interface NavItemProps {
  icon: LucideIcon;
  title: string;
  path: string;
  active?: boolean;
  children?: { title: string; path: string }[];
  onClick?: () => void;
}

interface NavItemGroupProps {
  title: string;
  children: React.ReactNode;
}

interface DashboardLayoutProps {
  user?: User;
}

const NavItem = ({ icon: Icon, title, path, active, children, onClick }: NavItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const hasChildren = children && children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    } else if (path) {
      navigate(path);
      if (onClick) onClick();
    }
  };

  return (
    <div className="mb-1">
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-700",
          active ? "bg-gray-700 text-white" : "text-gray-300"
        )}
      >
        <div className="flex items-center">
          <Icon className="mr-3 h-5 w-5" />
          <span>{title}</span>
        </div>
        {hasChildren && (
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
          />
        )}
      </button>
      {hasChildren && expanded && (
        <div className="ml-8 mt-1 space-y-1">
          {children.map((child, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(child.path);
                if (onClick) onClick();
              }}
              className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <ChevronRight className="mr-1 h-3 w-3" />
              <span>{child.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const NavItemGroup = ({ title, children }: NavItemGroupProps) => {
  return (
    <div className="mb-4">
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

const DashboardLayout = () => {
  // Get the user from useAuth hook instead of props
  const { user } = useAuth();
  
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
  
  const { logout } = useAuth();
  
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
  
  // If there's no user, don't render the dashboard yet
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Members",
      icon: Users,
      path: "/members",
      children: [
        { title: "All Members", path: "/members" },
        { title: "Add Member", path: "/members/new" },
        { title: "Member Profile", path: "/members/profile" },
      ],
    },
    {
      title: "Trainers",
      icon: Dumbbell,
      path: "/trainers",
    },
    {
      title: "Classes",
      icon: Calendar,
      path: "/classes",
    },
    {
      title: "Membership",
      icon: CreditCard,
      path: "/membership",
    },
    {
      title: "Attendance",
      icon: Activity,
      path: "/attendance",
    },
    {
      title: "Finance",
      icon: BarChart3,
      path: "/finance",
      children: [
        { title: "Dashboard", path: "/finance" },
        { title: "Invoices", path: "/finance/invoices" },
        { title: "Transactions", path: "/finance/transactions" },
      ],
    },
    {
      title: "Inventory",
      icon: Box,
      path: "/inventory",
    },
    {
      title: "Store",
      icon: ShoppingCart,
      path: "/store",
    },
    {
      title: "CRM",
      icon: UserPlus,
      path: "/crm",
      children: [
        { title: "Leads", path: "/crm/leads" },
        { title: "Sales Funnel", path: "/crm/funnel" },
        { title: "Follow-ups", path: "/crm/follow-up" },
      ],
    },
    {
      title: "Marketing",
      icon: BarChartHorizontal,
      path: "/marketing",
      children: [
        { title: "Promo Codes", path: "/marketing/promo" },
        { title: "Referrals", path: "/marketing/referral" },
      ],
    },
    {
      title: "Communication",
      icon: MessageSquare,
      path: "/communication",
      children: [
        { title: "Announcements", path: "/communication/announcements" },
        { title: "Reminders", path: "/communication/reminders" },
        { title: "Feedback", path: "/communication/feedback" },
        { title: "Motivational", path: "/communication/motivational" },
      ],
    },
    {
      title: "Reports",
      icon: PieChart,
      path: "/reports",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      title: "Branches",
      icon: Building2,
      path: "/branches",
    },
  ];

  const Sidebar = () => (
    <aside className="flex h-full flex-col bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 px-4">
        <Logo variant="white" />
      </div>
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border-gray-600 bg-gray-700 pl-8 text-sm text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <div className="px-4 py-2">
        <BranchSelector />
      </div>
      
      <div className="flex-1 overflow-auto px-4 py-2">
        <NavItemGroup title="MAIN">
          {navigationItems.slice(0, 6).map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              title={item.title}
              path={item.path}
              active={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
              children={item.children}
              onClick={isMobile ? closeSidebar : undefined}
            />
          ))}
        </NavItemGroup>
        <NavItemGroup title="MANAGEMENT">
          {navigationItems.slice(6, 12).map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              title={item.title}
              path={item.path}
              active={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
              children={item.children}
              onClick={isMobile ? closeSidebar : undefined}
            />
          ))}
        </NavItemGroup>
        <NavItemGroup title="SETTINGS">
          {navigationItems.slice(12).map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              title={item.title}
              path={item.path}
              active={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
              children={item.children}
              onClick={isMobile ? closeSidebar : undefined}
            />
          ))}
        </NavItemGroup>
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-indigo-600 text-white">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role || 'User'}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-white">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
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
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="hidden md:block md:w-64 fixed inset-y-0">
        <Sidebar />
      </div>
      
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-gray-800 text-white border-none">
          <Sidebar />
        </SheetContent>
      </Sheet>
      
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
                {navigationItems.find(
                  (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                )?.title || "Dashboard"}
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
                        {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
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
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
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

// Missing Loader2 component import
import { Loader2 } from "lucide-react";

export default DashboardLayout;
