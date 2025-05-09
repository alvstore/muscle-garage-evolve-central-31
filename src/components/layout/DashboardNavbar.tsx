
import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  Search, 
  Settings,
  LogOut,
  User,
  HelpCircle,
  Mail,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import { getInitials } from '@/utils/stringUtils';
import { useAuth } from '@/hooks/auth/use-auth-context';

interface DashboardNavbarProps {
  onMobileMenuToggle: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ 
  onMobileMenuToggle 
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const userName = user?.user_metadata?.full_name || 'User';

  return (
    <div className="flex h-16 items-center px-4 border-b bg-background sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <Button variant="outline" size="icon" className="md:hidden mr-2" onClick={onMobileMenuToggle}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      <div className="flex-1 flex items-center justify-between">
        {/* Search */}
        <div className="relative w-full max-w-xs mr-4 hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Plus className="h-4 w-4" />
            <span className="sr-only">New item</span>
          </Button>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Notification items would go here */}
              <div className="py-6 text-center text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2" />
                <p>No new notifications</p>
              </div>
              <DropdownMenuItem className="cursor-pointer justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative ml-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link to="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <Link to="/help">
                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
