import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import notificationService, { Notification } from "@/services/notificationService";
import { Loader2 } from "lucide-react";

export interface NotificationListProps {
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
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notifications
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
    
    // Set up a polling interval for now - we'll implement real-time later
    const intervalId = setInterval(fetchNotifications, 10000); // Check every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [userId, refreshTrigger]);



  // Apply filters  // Filter notifications based on status, type, and category
  useEffect(() => {
    let filtered = [...notifications];
    
    // Apply status filter
    if (filterStatus === 'read') {
      filtered = filtered.filter(n => n.read);
    } else if (filterStatus === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }
    
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(n => {
        // Check if notification matches the search query
        return (
          n.title?.toLowerCase().includes(searchLower) ||
          n.message?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Apply type filters if any are specified
    if (filterTypes && filterTypes.length > 0) {
      filtered = filtered.filter(n => {
        // Check if notification type or source matches any of the filter types
        return filterTypes.includes(n.type || '') || 
               filterTypes.includes(n.source || '') ||
               (n.id.startsWith('follow-up-') && filterTypes.includes('follow-up'));
      });
    }
    
    // Apply category filters if any are specified
    if (categoryTypes && categoryTypes.length > 0) {
      // If 'all' is included, don't filter by category
      if (categoryTypes.includes('all')) {
        // No filtering needed
      } else {
        result = result.filter(n => {
          const notificationCategory = n.category || '';
          
          // First check if the notification has a category that matches
          if (categoryTypes.includes(notificationCategory)) {
            return true;
          }
          
          // If no category is specified, check type and content for matching
          const type = n.type || '';
          const title = (n.title || '').toLowerCase();
          const message = (n.message || '').toLowerCase();
          
          // Check for member category
          if (categoryTypes.includes('member') && (
            type === 'member' ||
            title.includes('member') ||
            message.includes('member') ||
            title.includes('payment') ||
            message.includes('payment') ||
            type === 'payment' ||
            title.includes('check-in') ||
            message.includes('check-in') ||
            type === 'checkin' ||
            (n.source === 'follow-up' || n.id.startsWith('follow-up-'))
          )) {
            return true;
          }
          
          // Check for staff category
          if (categoryTypes.includes('staff') && (
            type === 'staff' ||
            title.includes('staff') ||
            message.includes('staff') ||
            title.includes('task') ||
            message.includes('task') ||
            type === 'task'
          )) {
            return true;
          }
          
          // Check for trainer category
          if (categoryTypes.includes('trainer') && (
            type === 'trainer' ||
            title.includes('trainer') ||
            message.includes('trainer') ||
            title.includes('session') ||
            message.includes('session') ||
            title.includes('program') ||
            message.includes('program')
          )) {
            return true;
          }
          
          // Check for gym category (general notifications)
          if (categoryTypes.includes('gym') && (
            type === 'system' ||
            type === 'announcement' ||
            !notificationCategory // If no category is specified, it might be a general notification
          )) {
            return true;
          }
          
          return false;
        });
      }
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, filterStatus, filterTypes, categoryTypes]);
  
  // Function to get notification icon based on type
  const getNotificationIcon = (notification: Notification): string => {
    const type = notification.type || '';
    const source = notification.source || '';
    
    // First check if it's a follow-up notification
    if (source === 'follow-up' || notification.id.startsWith('follow-up-')) {
      return 'F';
    }
    
    // Then check other types
    switch (type) {
      case 'task':
        return 'T';
      case 'payment':
        return 'P';
      case 'checkin':
        return 'C';
      case 'membership':
        return 'M';
      case 'system':
        return 'S';
      default:
        return 'N';




    }
  };
  
  // Function to get notification color based on type
  const getNotificationColor = (notification: Notification): string => {
    const type = notification.type || '';
    const source = notification.source || '';
    
    if (source === 'follow-up' || notification.id.startsWith('follow-up-')) {
      return 'bg-amber-100 text-amber-700';

















    }
    


    switch (type) {
      case 'task':
        return 'bg-purple-100 text-purple-700';
      case 'payment':
        return 'bg-green-100 text-green-700';
      case 'checkin':
        return 'bg-blue-100 text-blue-700';
      case 'membership':
        return 'bg-indigo-100 text-indigo-700';
      case 'system':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-primary-100 text-primary-700';
    }
  };

  const handleNotificationClick = async (id: string, notification: Notification) => {
    // For follow-up notifications, navigate to the lead detail page
    if (notification.source === 'follow-up' || notification.id.startsWith('follow-up-')) {
      if (notification.link) {
        window.location.href = notification.link;
      }
      return;
    }
    
    // For regular notifications, mark as read
    await notificationService.markAsRead(id);
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === id ? { ...n, read: true } : n
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

  return (
    <ScrollArea className="h-[300px] px-4">
      <div className="space-y-4 py-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No notifications match your filters</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-accent/50 cursor-pointer",
                !notification.read && "bg-accent/25"
              )}
              onClick={() => handleNotificationClick(notification.id, notification)}





            >
              <Avatar className={`h-9 w-9 ${getNotificationColor(notification)}`}>
                <AvatarImage src="/placeholder.svg" alt="Notification" />
                <AvatarFallback>{getNotificationIcon(notification)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-primary-500 ml-2"></span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}







                  </p>
                  {notification.link && (
                    <span className="text-xs text-primary-500">View details</span>
                  )}












                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>







  );
};

export default NotificationList;