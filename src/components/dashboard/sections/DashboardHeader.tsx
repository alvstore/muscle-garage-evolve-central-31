import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, Bell, Search, X, Settings, User, LogOut, HelpCircle, Mail, CheckSquare, MessageSquare, Calendar, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
interface DashboardHeaderProps {
  toggleSidebar?: () => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  sidebarOpen?: boolean;
}
const DashboardHeader = ({
  toggleSidebar,
  toggleTheme,
  isDarkMode,
  sidebarOpen
}: DashboardHeaderProps) => {
  const isMobile = useIsMobile();
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleHelpClick = () => {
    navigate('/help'); // Navigate to help page when implemented
  };
  const notifications = [{
    id: 1,
    title: "New Member Registration",
    description: "Sarah Parker has registered as a member",
    time: "2 min ago",
    icon: <User className="h-4 w-4 text-blue-500" />,
    color: "bg-blue-50 dark:bg-blue-900/20"
  }, {
    id: 2,
    title: "New Subscription Plan",
    description: "New platinum monthly plan created",
    time: "1 hour ago",
    icon: <Star className="h-4 w-4 text-amber-500" />,
    color: "bg-amber-50 dark:bg-amber-900/20"
  }, {
    id: 3,
    title: "Meeting with Trainers",
    description: "Scheduled for next Monday at 9 AM",
    time: "Yesterday",
    icon: <Calendar className="h-4 w-4 text-red-500" />,
    color: "bg-red-50 dark:bg-red-900/20"
  }, {
    id: 4,
    title: "Pending Reports",
    description: "Monthly attendance reports are ready",
    time: "2 days ago",
    icon: <CheckSquare className="h-4 w-4 text-green-500" />,
    color: "bg-green-50 dark:bg-green-900/20"
  }];
  return <div className="sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="flex items-center gap-4">
          {toggleSidebar && <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300">
              {sidebarOpen && isMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>}
          
          {/* Only show search icon on mobile */}
          {isMobile && <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)} className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>}
          
          {/* Desktop search bar */}
          <div className="hidden md:flex relative w-64 lg:w-80">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="search" placeholder="Search..." className="pl-10 h-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-full" />
            </div>
          </div>
        </div>
        
        {/* Mobile search bar that appears when toggled */}
        {showSearch && isMobile && <div className="absolute left-0 top-0 w-full p-4 bg-white dark:bg-gray-900 shadow-md flex items-center gap-2 z-50">
            <Input type="search" placeholder="Search..." className="flex-1 h-10" autoFocus />
            <Button size="icon" variant="ghost" onClick={() => setShowSearch(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>}
        
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          {toggleTheme && <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>}
          
          {/* Notifications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                  4
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <Badge className="bg-red-500 hover:bg-red-600">4 New</Badge>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map(notification => <DropdownMenuItem key={notification.id} className="flex p-0 focus:bg-transparent">
                    <div className="flex items-start gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className={`p-2 rounded-md mt-1 ${notification.color}`}>
                        {notification.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>)}
              </div>
              <div className="p-2 border-t">
                <Button variant="outline" className="w-full text-indigo-600 hover:text-indigo-700 border-indigo-200 hover:border-indigo-300">
                  Read All Notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                <Avatar className="h-9 w-9 border-2 border-indigo-200">
                  <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-indigo-600 text-white text-xs">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-0">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 mt-1">{user?.email || 'user@example.com'}</p>
              </div>
              <DropdownMenuGroup className="p-1">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                
                
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="p-1">
                <DropdownMenuItem onClick={handleHelpClick} className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>;
};
export default DashboardHeader;