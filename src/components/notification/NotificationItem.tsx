
import React from 'react';
import { cn } from '@/lib/utils';
import { Notification } from '@/types/notification.d';
import { format } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  return (
    <div 
      className={cn(
        "flex items-start p-3 gap-2 hover:bg-muted/50 rounded-md cursor-pointer",
        notification.read ? "opacity-70" : ""
      )}
      onClick={onClick}
    >
      <div className={cn(
        "w-2 h-2 mt-2 rounded-full flex-shrink-0",
        notification.read ? "bg-gray-300" : "bg-blue-500"
      )} />
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <p className="font-medium text-sm">{notification.title}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(notification.timestamp), 'PP')}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
