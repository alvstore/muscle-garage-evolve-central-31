import React, { useState } from 'react';
import { Menu, Bell, X, Moon, Sun, ChevronDown, Search, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/auth/use-auth';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/types/communication/notification';
import NotificationItem from '@/components/notifications/NotificationItem';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  sidebarOpen?: boolean;
}

const mockNotifications = [
  {
    id: '1',
    title: 'New Member Joined',
    message: 'John Doe has just registered as a new member.',
    read: false,
    is_read: false,
    created_at: new Date().toISOString(),
    user_id: 'system',
    type: 'info' as const,
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Membership Expiring Soon',
    message: 'Your membership will expire in 3 days. Please renew to continue access.',
    read: false,
    is_read: false,
    created_at: new Date().toISOString(),
    user_id: 'system',
    type: 'warning' as const,
    timestamp: new Date().toISOString()
  }
];

// Convert mock notifications to the expected Notification type
const adaptedNotifications: Notification[] = mockNotifications.map(notification => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  is_read: notification.read ?? false,
  read: notification.read ?? false, // For compatibility
  created_at: notification.created_at || notification.timestamp || new Date().toISOString(),
  user_id: notification.user_id,
  link: undefined,
  type: notification.type
}));

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  toggleSidebar,
  toggleTheme,
  isDarkMode,
  sidebarOpen
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = React.useState<Notification[]>(adaptedNotifications);
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
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 shadow-sm">
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
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle Theme</span>
        </Button>
        
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
