
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'system' | 'payment' | 'attendance' | 'reminder';
}

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  // This will be replaced with real data from Supabase
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Member Registration",
      message: "Sarah Parker has registered as a new member.",
      time: "10 minutes ago",
      read: false,
      type: 'system'
    },
    {
      id: "2",
      title: "Payment Received",
      message: "John Doe has completed payment for Premium Annual membership.",
      time: "30 minutes ago",
      read: false,
      type: 'payment'
    },
    {
      id: "3",
      title: "Low Inventory Alert",
      message: "Protein powder (Chocolate) is below reorder level.",
      time: "1 hour ago",
      read: true,
      type: 'system'
    },
    {
      id: "4",
      title: "Class Attendance",
      message: "12 members attended today's Yoga class with Jane.",
      time: "3 hours ago",
      read: true,
      type: 'attendance'
    },
    {
      id: "5",
      title: "Membership Expiry Reminder",
      message: "5 memberships are expiring in the next 7 days.",
      time: "Yesterday",
      read: true,
      type: 'reminder'
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const getNotificationBadgeVariant = (type?: string) => {
    switch (type) {
      case 'payment':
        return 'default';
      case 'attendance':
        return 'secondary';
      case 'reminder':
        return 'outline';
      case 'system':
      default:
        return 'default';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="py-4 px-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-4 py-2 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications at this time
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.read ? 'bg-card' : 'bg-accent/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{notification.title}</h4>
                      <Badge variant={getNotificationBadgeVariant(notification.type)}>
                        {notification.type || 'System'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 mt-auto">
        <Button variant="outline" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
