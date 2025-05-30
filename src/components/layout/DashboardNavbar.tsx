import { Bell, ChevronDown, Menu, Search, User, ShoppingCart, LogOut, Settings, CreditCard, Phone, Mail, Calendar, MessageCircle, ChevronRight, Check, Trash2 } from "lucide-react";
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import { User as UserType } from "@/types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/use-auth";
interface DashboardNavbarProps {
  user: UserType;
  onToggleSidebar: () => void;
}
const DashboardNavbar = ({
  user,
  onToggleSidebar
}: DashboardNavbarProps) => {
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  const {
    mode,
    setMode,
    isDark
  } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Fetch notifications when the component mounts
  useEffect(() => {
    let isMounted = true;
    
    const fetchNotifications = async () => {
      // Validate user ID before fetching
      if (!user?.id || !isMounted || user.id === '0' || user.id === 'undefined') {
        console.warn('Invalid user ID for fetching notifications:', user?.id);
        return;
      }
      
      setIsLoadingNotifications(true);
      try {
        const notificationService = (await import('@/services/communication/notificationService')).default;
        const data = await notificationService.getNotifications(user.id);
        
        if (isMounted) {
          setNotifications(data || []);
          setUnreadCount(data ? data.filter((n: any) => !n.read).length : 0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        if (isMounted) {
          // Set empty array to prevent UI issues
          setNotifications([]);
          setUnreadCount(0);
        }
      } finally {
        if (isMounted) {
          setIsLoadingNotifications(false);
        }
      }
    };
    
    // Initial fetch
    fetchNotifications();

    // Set up real-time subscription for notifications using Supabase
    const setupRealtimeSubscriptions = async () => {
      // Validate user ID before setting up subscriptions
      if (!user?.id || user.id === '0' || user.id === 'undefined') {
        console.warn('Invalid user ID for real-time subscriptions:', user?.id);
        return () => {};
      }
      
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const subscriptions: { unsubscribe: () => void }[] = [];

        // Subscribe to changes in the notifications table
        const notificationsChannel = supabase
          .channel('navbar-notifications')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`
            },
            () => isMounted && fetchNotifications()
          )
          .subscribe((status) => {
            if (status !== 'SUBSCRIBED' && isMounted) {
              console.warn('Notification subscription status:', status);
            }
          });
        
        subscriptions.push({ unsubscribe: () => notificationsChannel.unsubscribe() });

        // Subscribe to changes in follow-up history
        const followUpChannel = supabase
          .channel('navbar-follow-ups')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'follow_up_history',
              filter: `assigned_to=eq.${user.id}`
            },
            () => isMounted && fetchNotifications()
          )
          .subscribe();
        
        subscriptions.push({ unsubscribe: () => followUpChannel.unsubscribe() });
        
        // Return cleanup function
        return () => {
          subscriptions.forEach(sub => sub.unsubscribe());
        };
      } catch (error) {
        console.error('Error setting up real-time subscriptions:', error);
        return () => {};
      }
    };
    
    // Set up the subscriptions
    const cleanupPromise = setupRealtimeSubscriptions();
    
    // Clean up on unmount
    return () => {
      isMounted = false;
      
      // Handle the cleanup promise
      if (cleanupPromise) {
        cleanupPromise.then(cleanupFn => {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        }).catch(error => {
          console.error('Error during cleanup:', error);
        });
      }
    };
  }, [user?.id]);

  // Add function to clear all notifications
  const handleClearAll = async () => {
    if (!user?.id) return;
    try {
      const notificationService = (await import('@/services/communication/notificationService')).default;
      await notificationService.clearAllNotifications(user.id);

      // Remove only system notifications, keep follow-up notifications
      const followUpNotifications = notifications.filter(n => n.id.startsWith('follow-up-') || n.source === 'follow-up');
      setNotifications(followUpNotifications);
      setUnreadCount(followUpNotifications.filter(n => !n.read).length);
      toast.success("All notifications cleared");
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error("Failed to clear notifications");
    }
  };
  const markAsRead = async (id: string, notification?: any) => {
    // For follow-up notifications (which start with 'follow-up-'), we don't mark them as read
    // since they're handled differently
    if (id.startsWith('follow-up-') || notification?.source === 'follow-up') {
      if (notification?.link) {
        window.location.href = notification.link;
      }
      return;
    }
    try {
      const notificationService = (await import('@/services/communication/notificationService')).default;
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? {
        ...n,
        read: true
      } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  const markAllAsRead = async () => {
    try {
      const notificationService = (await import('@/services/communication/notificationService')).default;
      const systemNotifications = notifications.filter(n => !n.id.startsWith('follow-up-') && n.source !== 'follow-up');
      if (systemNotifications.length > 0) {
        await notificationService.markAllAsRead(user?.id || '');
      }

      // Only mark system notifications as read, not follow-up notifications
      setNotifications(notifications.map(n => {
        if (n.id.startsWith('follow-up-') || n.source === 'follow-up') return n;
        return {
          ...n,
          read: true
        };
      }));

      // Recalculate unread count
      setUnreadCount(notifications.filter(n => (n.id.startsWith('follow-up-') || n.source === 'follow-up') && !n.read).length);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error("Failed to mark notifications as read");
    }
  };
  const getInitials = (name?: string) => {
    if (!name) return "U"; // Default to 'U' for unknown/undefined
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
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
  return <div className={`sticky top-0 z-30 flex h-16 items-center border-b px-4 md:px-6 shadow-sm ${isDark ? 'bg-background border-border' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Logo />
      </div>
      
      <div className="flex-1 md:ml-4">
        <form className="relative max-w-lg" onSubmit={handleSearch}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search members, workout plans..." className={`pl-8 md:w-80 lg:w-96 rounded-md ${isDark ? 'bg-muted border-border focus:bg-background' : 'bg-gray-50 border-gray-200 focus:bg-white'}`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </form>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
        
        {/* Notifications */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
                  {unreadCount}
                </span>}
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
                {unreadCount > 0 && <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-normal text-primary-500" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>}
              </div>
            </div>
            {isLoadingNotifications ? <div className="py-8 text-center text-sm text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin">
                    <Bell className="h-10 w-10 text-gray-300" />
                  </div>
                  <p>Loading notifications...</p>
                </div>
              </div> : notifications.length === 0 ? <div className="py-8 text-center text-sm text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Bell className="h-10 w-10 text-gray-300" />
                  <p>No notifications</p>
                </div>
              </div> : <div className="max-h-[350px] overflow-y-auto">
                {notifications.map(notification => {
              // Determine if this is a follow-up notification
              const isFollowUp = notification.id.startsWith('follow-up-') || notification.type === 'follow-up';

              // Choose the appropriate icon based on notification type
              let NotificationIcon = Bell;
              if (isFollowUp) {
                const followUpType = notification.title?.toLowerCase() || '';
                if (followUpType.includes('call')) {
                  NotificationIcon = Phone;
                } else if (followUpType.includes('email')) {
                  NotificationIcon = Mail;
                } else if (followUpType.includes('meeting')) {
                  NotificationIcon = Calendar;
                } else if (followUpType.includes('whatsapp') || followUpType.includes('sms')) {
                  NotificationIcon = MessageCircle;
                }
              }
              return <div key={notification.id} className={`flex items-start gap-3 p-4 border-b hover:bg-accent/10 transition-colors cursor-pointer ${!notification.read ? 'bg-primary-50' : ''}`} onClick={() => markAsRead(notification.id, notification)}>
                      <div className="flex-shrink-0">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${!notification.read ? isFollowUp ? 'bg-amber-500/10 text-amber-500' : 'bg-primary-500/10 text-primary-500' : 'bg-gray-100 text-gray-500'}`}>
                          <NotificationIcon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true
                      })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        {notification.link && <div className="mt-1 text-xs text-primary-500 flex items-center">
                            <span>View details</span>
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </div>}
                      </div>
                    </div>;
            })}
              </div>}
            <div className="p-3 border-t flex flex-col gap-2">
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
                <Button variant="outline" className="flex-1" size="sm" onClick={handleClearAll}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              </div>
              <Button variant="outline" className="w-full" onClick={() => {
              setNotificationsOpen(false);
              navigate('/notifications');
            }}>
                View all notifications
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
              <DropdownMenuItem className="p-2 cursor-pointer" onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 cursor-pointer" onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
            </div>
            <div className="p-2 border-t">
              <Button variant="destructive" className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
            <DropdownMenuSeparator />
            
          </DropdownMenuContent>
            </DropdownMenu>
      </div>
    </div>;
};
export default DashboardNavbar;