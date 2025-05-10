
import { Bell, ChevronDown, Menu, Search, User, ShoppingCart, LogOut, Settings, CreditCard } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


















import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import { User as UserType } from "@/types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface DashboardNavbarProps {
  user: UserType;
  onToggleSidebar: () => void;
}

const DashboardNavbar = ({ user, onToggleSidebar }: DashboardNavbarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { mode, setMode, isDark } = useTheme();
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Member Registration",
      message: "Sarah Parker has registered as a new member.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Payment Received",
      message: "John Doe has completed payment for Premium Annual membership.",
      time: "30 minutes ago",
      read: false,
    },
    {
      id: "3",
      title: "Low Inventory Alert",
      message: "Protein powder (Chocolate) is below reorder level.",
      time: "1 hour ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };








  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Function to handle search
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality here
    }
  };









  return (
    <div className={`sticky top-0 z-30 flex h-16 items-center border-b px-4 md:px-6 shadow-sm ${isDark ? 'bg-background border-border' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Logo />
      </div>
      
      <div className="flex-1 md:ml-4">
        <form className="relative max-w-lg" onSubmit={handleSearch}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members, workout plans..."
            className={`pl-8 md:w-80 lg:w-96 rounded-md ${isDark ? 'bg-muted border-border focus:bg-background' : 'bg-gray-50 border-gray-200 focus:bg-white'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[380px] p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-medium">Notifications</span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs font-normal text-primary-500"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Bell className="h-10 w-10 text-gray-300" />
                  <p>No notifications</p>
                </div>
              </div>
            ) : (
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start p-4 border-b cursor-pointer hover:bg-gray-50 ${!notification.read ? 'bg-primary-50/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary-500" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{notification.title}</span>
                        {!notification.read && (
                          <span className="flex h-2 w-2 rounded-full bg-primary-500" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {notification.message}
                      </span>
                      <span className="text-xs text-gray-400">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-3 border-t">
              <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                View All Notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Cart button */}
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to="/store">
            <ShoppingCart className="h-5 w-5 text-gray-500" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
              3
            </span>
            <span className="sr-only">View cart</span>
          </Link>
        </Button>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-9 w-9 border-2 border-gray-200">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary-500 text-white">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="p-3 border-b">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="p-1">
              <DropdownMenuItem className="p-2 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
            </div>
            <div className="p-2 border-t">
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardNavbar;