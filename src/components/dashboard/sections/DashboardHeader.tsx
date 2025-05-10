
import React, { useState } from 'react';
import { Menu, Bell, X, Moon, Sun, Monitor, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/types/notification';
import NotificationItem from '@/components/notification/NotificationItem';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  currentThemeMode: 'light' | 'dark' | 'semi-dark';
  currentPrimaryColor: string;
  changeThemeMode: (mode: 'light' | 'dark' | 'semi-dark') => void;
  changePrimaryColor: (color: 'blue' | 'purple' | 'orange' | 'red' | 'teal') => void;
  sidebarOpen?: boolean;
}

const fakeNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Member Joined',
    message: 'John Doe has joined as a new member.',
    timestamp: new Date().toISOString(),
    read: false,
    type: 'member'
  },
  {
    id: '2',
    title: 'Membership Expiring',
    message: 'Sarah Smith\'s membership expires in 3 days.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    type: 'alert'
  }
];

const colorOptions = [
  { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
  { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
  { name: 'Red', value: 'red', bg: 'bg-red-500' },
  { name: 'Teal', value: 'teal', bg: 'bg-teal-500' },
];

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  toggleSidebar,
  toggleTheme,
  currentThemeMode,
  currentPrimaryColor,
  changeThemeMode,
  changePrimaryColor,
  sidebarOpen
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = React.useState<Notification[]>(fakeNotifications);
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const markAllAsRead = () => {
    // In a real app, this would call an API to mark notifications as read
    setUnreadCount(0);
  };

  const getThemeIcon = () => {
    switch (currentThemeMode) {
      case 'light': return <Sun className="h-5 w-5" />;
      case 'dark': return <Moon className="h-5 w-5" />;
      case 'semi-dark': return <div className="h-5 w-5 rounded-full overflow-hidden flex">
        <div className="w-1/2 bg-gray-800"></div>
        <div className="w-1/2 bg-white"></div>
      </div>;
      default: return <Sun className="h-5 w-5" />;
    }
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-background border-b border-border px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="flex md:flex" 
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        {/* Theme Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              {getThemeIcon()}
              <span className="sr-only">Theme Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Theme Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => changeThemeMode('light')} className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span>Light</span>
              {currentThemeMode === 'light' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => changeThemeMode('dark')} className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Dark</span>
              {currentThemeMode === 'dark' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => changeThemeMode('semi-dark')} className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full overflow-hidden flex">
                <div className="w-1/2 bg-gray-800"></div>
                <div className="w-1/2 bg-white"></div>
              </div>
              <span>Semi Dark</span>
              {currentThemeMode === 'semi-dark' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Primary Color</DropdownMenuLabel>
            
            <div className="grid grid-cols-5 gap-2 p-2">
              {colorOptions.map((color) => (
                <Button 
                  key={color.value}
                  variant="ghost"
                  size="icon"
                  title={color.name}
                  onClick={() => changePrimaryColor(color.value as any)}
                  className={`w-8 h-8 rounded-full p-0 ${color.bg} ${currentPrimaryColor === color.value ? 'ring-2 ring-offset-2 ring-black dark:ring-white' : ''}`}
                >
                  {currentPrimaryColor === color.value && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </Button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs p-0"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <div className="flex items-center justify-between py-2 px-3">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto py-1 px-2 text-xs"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="py-4 px-3 text-center text-muted-foreground">
                  No notifications
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a className="w-full text-center cursor-pointer" href="/notifications">
                View all notifications
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                <AvatarFallback>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                <AvatarFallback>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
