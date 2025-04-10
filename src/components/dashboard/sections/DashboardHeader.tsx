
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Bell, Settings, Download, Menu, Moon, Sun } from 'lucide-react';
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

interface DashboardHeaderProps {
  toggleSidebar?: () => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const DashboardHeader = ({ toggleSidebar, toggleTheme, isDarkMode }: DashboardHeaderProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-[#283046] dark:border-gray-700">
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="relative flex-1 max-w-md">
          <div className="relative flex items-center h-9">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="Search (⌘K)" 
              className="pl-10 h-9 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:bg-white w-full"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              ⌘K
            </div>
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
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
