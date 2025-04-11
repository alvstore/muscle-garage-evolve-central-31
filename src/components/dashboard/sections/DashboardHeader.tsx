
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, Bell, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  toggleSidebar?: () => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  sidebarOpen?: boolean;
}

const DashboardHeader = ({ toggleSidebar, toggleTheme, isDarkMode, sidebarOpen }: DashboardHeaderProps) => {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-[#283046] dark:border-gray-700">
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300">
            {sidebarOpen && isMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
        
        <div className="relative flex-1 max-w-md">
          <div className="relative flex items-center h-9">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-10 h-9 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:bg-white w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {toggleTheme && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-300"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
        
        <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
            4
          </Badge>
        </Button>
        
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
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>{user?.name || 'User'}</span>
              <span className="text-xs text-gray-500">{user?.role || 'User'}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
