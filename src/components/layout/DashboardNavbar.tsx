import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/use-auth';
import { siteConfig } from "@/config/site";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User } from 'lucide-react';

interface DashboardNavbarProps {
  user?: any;
  onToggleSidebar?: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ user, onToggleSidebar }) => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const currentUser = user || authUser;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Left side - Logo and menu toggle */}
        <div className="flex items-center space-x-4">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <Link to="/dashboard" className="flex items-center">
            <span className="font-bold text-xl text-primary">
              {siteConfig?.name || 'Gym Management'}
            </span>
          </Link>
        </div>

        {/* Center - Navigation Links (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/dashboard" 
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/members" 
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Members
          </Link>
          <Link 
            to="/classes" 
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Classes
          </Link>
          <Link 
            to="/finances" 
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Finances
          </Link>
          <Link 
            to="/crm" 
            className="text-gray-600 hover:text-primary transition-colors"
          >
            CRM
          </Link>
          <Link 
            to="/settings" 
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Settings
          </Link>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.email}`} 
                      alt={currentUser.full_name || currentUser.name || currentUser.email}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.full_name || currentUser.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
