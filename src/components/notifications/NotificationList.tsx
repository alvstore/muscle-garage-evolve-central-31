import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, Bell, Trash2 } from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { notificationService } from '@/services';
import { Notification } from '@/types';
import { EmptyState } from '@/components/ui/empty-state';

export interface NotificationListProps {
  refreshTrigger?: number;
  filterStatus?: 'all' | 'read' | 'unread';
  filterTypes?: string[];
  categoryTypes?: string[];
  userId?: string; // Make this optional
  onDelete?: (id: string) => void; // Add this prop
}

const NotificationList: React.FC<NotificationListProps> = ({
  refreshTrigger = 0,
  filterStatus = 'all',
  filterTypes = [],
  categoryTypes = [],
  userId,
  onDelete
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const fetchedNotifications = await notificationService.getNotifications(userId);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [refreshTrigger, userId]);

  const handleDelete = useCallback((id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  }, [onDelete]);

  const handleMarkRead = async (notification: Notification) => {
    try {
      await notificationService.markAsRead(notification.id);
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, is_read: true, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Invalid Date';
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const statusFilter =
      filterStatus === 'all' ||
      (filterStatus === 'read' && (notification.read || notification.is_read)) ||
      (filterStatus === 'unread' && !(notification.read || notification.is_read));

    return statusFilter;
  });

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        title="No notifications"
        description="You're all caught up! Check back later for updates."
        icon={<Bell className="h-6 w-6" />}
      />
    );
  }

  return (
    <div className="space-y-4">
      
      {filteredNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 border rounded-lg transition-colors ${
            notification.read || notification.is_read ? 'bg-background' : 'bg-accent/20'
          }`}
        >
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium">{notification.title}</h3>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
            </div>
            {!notification.read && !notification.is_read && (
              <Badge
                variant="secondary"
                className="ml-2 cursor-pointer"
                onClick={() => handleMarkRead(notification)}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark as Read
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{formatDistanceToNow(new Date(notification.created_at || ''), { addSuffix: true })}</span>
            
            <div className="flex items-center space-x-2">
              <button
                className="hover:text-red-500 transition-colors"
                onClick={() => handleDelete(notification.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      
    </div>
  );
};

export default NotificationList;
