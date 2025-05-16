// Update NotificationList to handle compatibility between notification types

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { BellOff, Check, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { Notification } from '@/types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications = [], 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDelete 
}) => {
  const [currentFilter, setCurrentFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = currentFilter === 'all' || !(notification.read || notification.is_read);
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMarkAsRead = (notification: Notification) => {
    onMarkAsRead(notification);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'new_member':
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 4.25c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 9.75a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5z"/><path d="M19.75 15.155a6.978 6.978 0 0 0-2.371-1.394 10.012 10.012 0 0 0-6.758 0 6.978 6.978 0 0 0-2.371 1.394 11.42 11.42 0 0 0-1.75 1.043c-.093.054-.187.107-.282.159a6.25 6.25 0 0 0-.955.685 1.875 1.875 0 0 0-.363.474.938.938 0 0 0-.075.173c-.008.02-.017.041-.025.061C4.009 17.53 4 17.785 4 18.043v.907c0 .258.009.513.025.761l.001.003a.938.938 0 0 0 .075.173 1.875 1.875 0 0 0 .363.474 6.25 6.25 0 0 0 .955.685c.095.052.189.105.282.159a11.42 11.42 0 0 0 1.75 1.043 6.978 6.978 0 0 0 2.371 1.394 10.012 10.012 0 0 0 6.758 0 6.978 6.978 0 0 0 2.371-1.394 11.42 11.42 0 0 0 1.75-1.043c.093-.054.187-.107.282-.159a6.25 6.25 0 0 0 .955-.685 1.875 1.875 0 0 0 .363-.474.938.938 0 0 0 .075-.173c.008-.02.017-.041.025-.061.016-.248.025-.503.025-.761v-.907c0-.258-.009-.513-.025-.761l-.001-.003a.938.938 0 0 0-.075-.173 1.875 1.875 0 0 0-.363-.474 6.25 6.25 0 0 0-.955-.685c-.095-.052-.189-.105-.282-.159a11.42 11.42 0 0 0-1.75-1.043z"/></svg>;
      case 'new_class':
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M4.5 6.75a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-15 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-15 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"/></svg>;
      case 'new_invoice':
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3a.75.75 0 0 1 1.5 0v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v9h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5H7.5v1.5a.75.75 0 0 1-1.5 0v-1.5H4.5a.75.75 0 0 1 0-1.5h1.5v-9H4.5a.75.75 0 0 1 0-1.5h1.5V3a.75.75 0 0 1 .75-.75ZM6 6a.75.75 0 0 0-.75.75v6.75a.75.75 0 0 0 .75.75h9a.75.75 0 0 0 .75-.75V6.75a.75.75 0 0 0-.75-.75h-9Z" clipRule="evenodd"/></svg>;
      default:
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v.6a3 3 0 0 0 3 3H14.25a3 3 0 0 0 3-3v-.6a5.25 5.25 0 0 0-5.25-5.25ZM12 9a2.25 2.25 0 1 0 0 4.5A2.25 2.25 0 0 0 12 9ZM6.354 18.604a6.75 6.75 0 0 1 11.292 0 .75.75 0 1 0-1.06-1.06 5.25 5.25 0 0 0-9.172 0 .75.75 0 1 0-1.06 1.06Z" clipRule="evenodd"/></svg>;
    }
  };

  const getIconBgColor = (type?: string) => {
    switch (type) {
      case 'new_member':
        return 'bg-green-100 text-green-600';
      case 'new_class':
        return 'bg-blue-100 text-blue-600';
      case 'new_invoice':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Notifications</h2>
        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <div className="rounded-lg border divide-y">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFilter('all')}
              className={cn(currentFilter === 'all' && 'bg-gray-100')}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFilter('unread')}
              className={cn(currentFilter === 'unread' && 'bg-gray-100')}
            >
              Unread
            </Button>
          </div>
          <Input
            type="search"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="px-4">
          {filteredNotifications.length === 0 ? (
            <div className="py-8 text-center">
              <BellOff className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any {currentFilter !== 'all' ? currentFilter : ''} notifications at the moment.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={cn(
                    "py-4 hover:bg-gray-50 transition-colors cursor-pointer",
                    !(notification.read || notification.is_read) && "bg-blue-50"
                  )}
                  onClick={() => handleMarkAsRead(notification)}
                >
                  {/* Fixed to use either read or is_read property */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className={cn(
                        "inline-block h-8 w-8 rounded-full flex items-center justify-center",
                        getIconBgColor(notification.type)
                      )}>
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at || notification.timestamp || Date.now()))} ago
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      {!(notification.read || notification.is_read) && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification);
                          }}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
