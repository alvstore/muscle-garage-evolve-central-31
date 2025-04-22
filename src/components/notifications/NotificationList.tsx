
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Notification } from "@/types";
import { useAuth } from '@/hooks/use-auth';

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'member1',
    title: 'Class Booking Confirmed',
    message: 'Your booking for Yoga Class on April 23rd has been confirmed.',
    type: 'system',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    link: '/classes'
  },
  {
    id: '2',
    userId: 'member1',
    title: 'Payment Successful',
    message: 'Your payment of $50 for Personal Training has been processed successfully.',
    type: 'payment',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    link: '/invoices'
  },
  {
    id: '3',
    userId: 'member1',
    title: 'Membership Renewal Reminder',
    message: 'Your membership will expire in 7 days. Renew now to avoid interruption.',
    type: 'renewal',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    link: '/membership'
  },
  {
    id: '4',
    userId: 'member1',
    title: 'New Announcement',
    message: 'The gym will be closed for maintenance on Sunday, April 28th.',
    type: 'announcement',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    link: '/communication/announcements'
  },
  {
    id: '5',
    userId: 'staff1',
    title: 'Staff Meeting Reminder',
    message: 'Don\'t forget the staff meeting tomorrow at 9 AM.',
    type: 'system',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    link: '/dashboard'
  }
];

interface NotificationListProps {
  limit?: number;
  showFilters?: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  limit = 10,
  showFilters = true
}) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Filter notifications by user and selected filter
  const filteredNotifications = notifications
    .filter(notification => {
      // Filter by user
      if (user?.role === 'member' && notification.userId !== user?.id) {
        // For members, only show their own notifications
        // (excluding general announcements which would be handled differently)
        return false;
      }
      
      // For staff/admin, show all notifications
      // Filter by type if a filter is selected
      if (filter && notification.type !== filter) {
        return false;
      }
      
      return true;
    })
    .slice(0, limit);
  
  const unreadCount = filteredNotifications.filter(n => !n.read).length;
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <Badge className="h-2 w-2 rounded-full bg-green-500" />;
      case 'renewal':
        return <Badge className="h-2 w-2 rounded-full bg-amber-500" />;
      case 'announcement':
        return <Badge className="h-2 w-2 rounded-full bg-blue-500" />;
      case 'attendance':
        return <Badge className="h-2 w-2 rounded-full bg-purple-500" />;
      default:
        return <Badge className="h-2 w-2 rounded-full bg-gray-500" />;
    }
  };
  
  const getRelativeTime = (dateString: string) => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        <div className="flex items-center gap-2">
          {showFilters && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[200px] p-2">
                <div className="grid gap-1">
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => setFilter(null)}
                  >
                    All notifications
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => setFilter('payment')}
                  >
                    Payments
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => setFilter('renewal')}
                  >
                    Renewals
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => setFilter('announcement')}
                  >
                    Announcements
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => setFilter('system')}
                  >
                    System
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "flex items-start space-x-4 rounded-lg border p-4 transition-colors",
                  notification.read ? "bg-background" : "bg-muted/30"
                )}
              >
                <div className="mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm font-medium leading-none",
                      !notification.read && "font-semibold"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    {notification.link && (
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-xs"
                        asChild
                      >
                        <a href={notification.link}>View details</a>
                      </Button>
                    )}
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationList;
