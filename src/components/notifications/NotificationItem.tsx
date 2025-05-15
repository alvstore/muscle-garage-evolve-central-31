
import React from 'react';
import { Notification } from '@/types/notification';
import { Bell, BadgeCheck, Flame, User, Calendar, MessageSquare, CreditCard, Check, AlertCircle, Bell as BellIcon } from 'lucide-react';
import { format } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkRead }) => {
  const isRead = notification.is_read || notification.read;
  
  const getIconByType = (type: string) => {
    switch (type) {
      case 'membership':
        return <BadgeCheck className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'checkin':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'class':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'user':
        return <User className="h-5 w-5 text-indigo-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'danger':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'renew':
        return <Flame className="h-5 w-5 text-orange-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleClick = () => {
    if (onMarkRead && !isRead) {
      onMarkRead(notification.id);
    }
  };
  
  return (
    <div 
      className={`flex items-start gap-3 p-3 hover:bg-accent cursor-pointer ${!isRead ? 'bg-accent/50' : ''}`}
      onClick={handleClick}
    >
      <div className="shrink-0">
        {getIconByType(notification.type)}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-xs text-muted-foreground">{notification.message}</p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {format(new Date(notification.created_at), 'MMM d, h:mm a')}
          </p>
          {!isRead && (
            <span className="bg-primary rounded-full h-2 w-2"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
