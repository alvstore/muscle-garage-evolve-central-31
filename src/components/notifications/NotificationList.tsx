
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import NotificationItem from './NotificationItem';

interface Notification {
  id: string;
  type: string;
  message: string;
  title: string;
  data: any;
  user_id: string;
  is_read: boolean;
  created_at: string;
  timestamp: string;
}

interface NotificationListProps {
  userId?: string;
  refreshTrigger?: number;
  filterStatus?: 'all' | 'read' | 'unread';
  filterTypes?: string[];
  categoryTypes?: string[];
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  userId, 
  refreshTrigger = 0, 
  filterStatus = 'all',
  filterTypes = [],
  categoryTypes = []
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading, isError, error } = useQuery({
    queryKey: ['notifications', userId, refreshTrigger, filterStatus, filterTypes, categoryTypes],
    queryFn: async () => {
      try {
        let query = supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId || '')
          .order('created_at', { ascending: false });

        // Apply filter based on read status
        if (filterStatus === 'read') {
          query = query.eq('read', true);
        } else if (filterStatus === 'unread') {
          query = query.eq('read', false);
        }

        // Apply type filters if any are specified
        if (filterTypes && filterTypes.length > 0) {
          query = query.in('type', filterTypes);
        }

        // We're not filtering by categoryTypes here as it would require a more complex query
        // This would typically be handled with a join or a more sophisticated database structure

        const { data, error } = await query;

        if (error) throw error;
        
        // Transform data to match the expected Notification interface
        const transformedData = data.map(notification => ({
          ...notification,
          timestamp: notification.created_at,
          title: notification.title || 'Notification',
        }));
        
        return transformedData as Notification[];
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Failed to fetch notifications");
        throw err;
      }
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData);
    }
  }, [notificationsData]);

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("Notification marked as read");
    },
    onError: (error: any) => {
      toast.error("Failed to mark notification as read");
      console.error("Error marking notification as read:", error);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('is_read', false)
        .eq('user_id', userId || '');

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("All notifications marked as read");
    },
    onError: (error: any) => {
      toast.error("Failed to mark all notifications as read");
      console.error("Error marking all notifications as read:", error);
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (userId) {
      markAllAsReadMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 h-[200px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading notifications...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading notifications. Please try again later.
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No notifications to display
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1">
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            onClick={() => handleMarkAsRead(notification.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationList;
