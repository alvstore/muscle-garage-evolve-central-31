import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/auth/use-auth';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/services/notificationService';

export function useNotifications(categoryFilter = 'all', refreshTrigger = 0) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Use React Query to fetch notifications
  const { data, error, isLoading: queryLoading } = useQuery({
    queryKey: ['notifications', user?.id, categoryFilter, refreshTrigger],
    queryFn: async () => {
      if (!user?.id) return [];
      return notificationService.getNotifications(user.id, categoryFilter === 'all');
    },
    enabled: !!user?.id,
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    setIsLoading(queryLoading);
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(notification => !notification.read).length);
    }
  }, [data, queryLoading]);

  // Mark a notification as read
  const markAsRead = async (id: string, userId?: string) => {
    if (!userId) return false;
    
    // Optimistically update UI
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Make API call
    const success = await notificationService.markAsRead(id, userId);
    
    // If failed, revert changes
    if (!success) {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
    
    return success;
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id) return false;
    
    // Optimistically update UI
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // Update unread count
    setUnreadCount(0);
    
    // Make API call
    const success = await notificationService.markAllAsRead(user.id);
    
    // If failed, revert changes
    if (!success) {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
    
    return success;
  };

  // Clear all notifications
  const clearAll = async () => {
    if (!user?.id) return false;
    
    // Optimistically update UI
    setNotifications([]);
    setUnreadCount(0);
    
    // Make API call
    const success = await notificationService.clearAll(user.id);
    
    // If failed, revert changes
    if (!success) {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
    
    return success;
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    clearAll,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  };
}
