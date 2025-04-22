
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

export interface NotificationListProps {
  userRole?: UserRole;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Class Schedule",
    description: "The yoga class schedule has been updated.",
    timestamp: new Date(),
    read: false
  },
  {
    id: "2",
    title: "Membership Renewal",
    description: "Your membership will expire in 7 days.",
    timestamp: new Date(),
    read: false
  }
];

const NotificationList: React.FC<NotificationListProps> = ({ userRole = 'member' }) => {
  // Filter notifications based on user role
  const notifications = mockNotifications.filter(notification => {
    if (userRole === 'member') {
      // Show only member-relevant notifications
      return true; // In a real app, you'd filter based on notification type/metadata
    }
    return true; // Show all for other roles
  });

  return (
    <ScrollArea className="h-[300px] px-4">
      <div className="space-y-4 py-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-accent/50",
              !notification.read && "bg-accent/25"
            )}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={notification.avatar} alt="Notification" />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(notification.timestamp, 'PP')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationList;
