
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import notificationService, { Notification } from "@/services/notificationService";
import { Loader2 } from "lucide-react";

export interface NotificationListProps {
  userId: string;
}

const NotificationList: React.FC<NotificationListProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const data = await notificationService.getNotifications(userId);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleNotificationClick = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No notifications yet.
      </div>
    );
  }

  // Function to get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return 'T';
      case 'payment':
        return 'P';
      case 'system':
        return 'S';
      default:
        return 'N';
    }
  };

  return (
    <ScrollArea className="h-[300px] px-4">
      <div className="space-y-4 py-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-accent/50 cursor-pointer",
              !notification.read && "bg-accent/25"
            )}
            onClick={() => handleNotificationClick(notification.id)}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Notification" />
              <AvatarFallback>{getNotificationIcon(notification.type)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationList;
