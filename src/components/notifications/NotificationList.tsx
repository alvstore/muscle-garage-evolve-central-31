
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notification } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { toast } from 'sonner';

interface NotificationListProps {
  limit?: number;
  showControls?: boolean;
  onClose?: () => void;
  className?: string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  limit,
  showControls = true,
  onClose,
  className = '',
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await notificationService.getUserNotifications(limit);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [limit]);

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      toast.error('Failed to update notifications');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      toast.error('Failed to update notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (err) {
      console.error('Failed to clear notifications:', err);
      toast.error('Failed to clear notifications');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading notifications...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>{error}</p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchNotifications} 
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No notifications yet</p>
        {showControls && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchNotifications} 
            className="mt-4"
          >
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showControls && (
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-medium">Notifications</h3>
          <div className="space-x-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
              Clear all
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-3 cursor-pointer hover:bg-accent/50 transition-colors ${
              !notification.read ? 'border-l-4 border-primary' : ''
            }`}
            onClick={() => {
              if (!notification.read) {
                markAsRead(notification.id);
              }
              
              // Handle notification action if needed
              if (notification.link) {
                window.location.href = notification.link;
              }
              
              if (onClose) {
                onClose();
              }
            }}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{notification.title}</h4>
              {!notification.read && (
                <Badge variant="default" className="ml-2">New</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            <div className="text-xs text-muted-foreground mt-2">
              {notification.created_at && formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
