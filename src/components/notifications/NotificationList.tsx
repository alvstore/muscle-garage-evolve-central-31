
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, Calendar, User, FileText, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Notification } from '@/types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  isLoading?: boolean;
  userId?: string;
  filterStatus?: 'all' | 'read' | 'unread';
  filterTypes?: string[];
  categoryTypes?: string[];
  refreshTrigger?: number;
}

export default function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  isLoading = false,
  userId,
  filterStatus = 'all',
  filterTypes = [],
  categoryTypes = []
}: NotificationListProps) {
  // Helper function to get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
      case 'class':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'membership':
        return <CreditCard className="h-5 w-5 text-indigo-500" />;
      case 'user':
      case 'member':
      case 'trainer':
        return <User className="h-5 w-5 text-green-500" />;
      case 'document':
      case 'invoice':
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <Card className="w-full max-w-md border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>{unreadCount} unread</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button size="sm" variant="ghost" onClick={onMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="h-10 w-10 text-muted-foreground opacity-50" />
            <p className="mt-2 text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] p-0">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start p-4 gap-4 ${!notification.read ? 'bg-muted/50' : 'hover:bg-muted/30'} transition-colors`}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type || 'default')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    {notification.message && (
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    )}
                    {notification.created_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
