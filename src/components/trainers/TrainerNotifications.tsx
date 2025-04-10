
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, UserPlus, Calendar, ClipboardList, Info, CheckCircle, RefreshCw } from "lucide-react";
import { format, parseISO, isToday, isYesterday, differenceInDays } from "date-fns";
import { toast } from "sonner";

// Define notification types
interface TrainerNotification {
  id: string;
  title: string;
  message: string;
  type: "member_assignment" | "announcement" | "task" | "general";
  createdAt: string;
  read: boolean;
  metadata?: {
    memberId?: string;
    memberName?: string;
    memberAvatar?: string;
    taskId?: string;
    announcementId?: string;
    trainerName?: string;
  };
}

// Mock notifications data
const mockNotifications: TrainerNotification[] = [
  {
    id: "notif1",
    title: "New Member Assigned",
    message: "You have been assigned to train David Miller for a 3-month personal training package.",
    type: "member_assignment",
    createdAt: "2025-04-09T14:30:00Z",
    read: false,
    metadata: {
      memberId: "member5",
      memberName: "David Miller"
    }
  },
  {
    id: "notif2",
    title: "New Task Assigned",
    message: "Admin has assigned you a new task: Create diet plan for new members",
    type: "task",
    createdAt: "2025-04-08T10:15:00Z",
    read: false,
    metadata: {
      taskId: "task1"
    }
  },
  {
    id: "notif3",
    title: "Gym Closure Announcement",
    message: "The gym will be closed on April 15th for routine maintenance. We apologize for any inconvenience.",
    type: "announcement",
    createdAt: "2025-04-07T11:45:00Z",
    read: true,
    metadata: {
      announcementId: "announce1"
    }
  },
  {
    id: "notif4",
    title: "Member Allocation Updated",
    message: "Jennifer Lee's personal training package has been assigned to you.",
    type: "member_assignment",
    createdAt: "2025-04-06T16:20:00Z",
    read: true,
    metadata: {
      memberId: "member6",
      memberName: "Jennifer Lee"
    }
  },
  {
    id: "notif5",
    title: "New Staff Training",
    message: "There will be a mandatory staff training session on April 20th at 9:00 AM.",
    type: "general",
    createdAt: "2025-04-05T09:30:00Z",
    read: true
  },
  {
    id: "notif6",
    title: "Task Reminder",
    message: "Reminder: You have 2 pending tasks that need to be completed by the end of this week.",
    type: "task",
    createdAt: "2025-04-04T13:45:00Z",
    read: true
  },
  {
    id: "notif7",
    title: "New Fitness Equipment",
    message: "New equipment has been added to the weight room. Please familiarize yourself with the proper usage.",
    type: "announcement",
    createdAt: "2025-04-03T15:10:00Z",
    read: true
  }
];

const TrainerNotifications = () => {
  const [notifications, setNotifications] = useState<TrainerNotification[]>(mockNotifications);
  const [loading, setLoading] = useState(true);
  
  // Calculate counts
  const unreadCount = notifications.filter(n => !n.read).length;
  const memberAssignmentCount = notifications.filter(n => n.type === "member_assignment").length;
  const taskCount = notifications.filter(n => n.type === "task").length;
  const announcementCount = notifications.filter(n => n.type === "announcement").length;
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
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
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "member_assignment":
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case "task":
        return <ClipboardList className="h-5 w-5 text-purple-500" />;
      case "announcement":
        return <Bell className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatNotificationDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else if (differenceInDays(new Date(), date) < 7) {
      return format(date, 'EEEE') + ` at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM dd, yyyy') + ` at ${format(date, 'h:mm a')}`;
    }
  };
  
  const renderNotification = (notification: TrainerNotification) => (
    <div 
      key={notification.id} 
      className={`p-4 border rounded-lg ${notification.read ? 'bg-background' : 'bg-accent/10'}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">
              {notification.title}
              {!notification.read && (
                <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
              )}
            </h3>
            <span className="text-xs text-muted-foreground">
              {formatNotificationDate(notification.createdAt)}
            </span>
          </div>
          
          <p className="text-sm mt-1">{notification.message}</p>
          
          {notification.type === "member_assignment" && notification.metadata?.memberName && (
            <div className="flex items-center mt-2 p-2 bg-accent/5 rounded">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={notification.metadata.memberAvatar} />
                <AvatarFallback>
                  {notification.metadata.memberName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{notification.metadata.memberName}</span>
            </div>
          )}
          
          {!notification.read && (
            <div className="mt-3 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs" 
                onClick={() => markAsRead(notification.id)}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Mark as read
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Stay updated with tasks and member assignments
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead} 
              >
                Mark all as read
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }} 
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 rounded-full border-4 border-t-primary mx-auto animate-spin"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All{unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="members">
                Members{memberAssignmentCount > 0 && <Badge className="ml-2">{memberAssignmentCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="tasks">
                Tasks{taskCount > 0 && <Badge className="ml-2">{taskCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="announcements">
                Gym{announcementCount > 0 && <Badge className="ml-2">{announcementCount}</Badge>}
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="all" className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map(renderNotification)
                ) : (
                  <div className="text-center py-10">
                    <Bell className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="members" className="space-y-4">
                {notifications.filter(n => n.type === "member_assignment").length > 0 ? (
                  notifications
                    .filter(n => n.type === "member_assignment")
                    .map(renderNotification)
                ) : (
                  <div className="text-center py-10">
                    <UserPlus className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No member assignments</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No new members have been assigned to you.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-4">
                {notifications.filter(n => n.type === "task").length > 0 ? (
                  notifications
                    .filter(n => n.type === "task")
                    .map(renderNotification)
                ) : (
                  <div className="text-center py-10">
                    <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No task notifications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You have no new task assignments or reminders.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="announcements" className="space-y-4">
                {notifications.filter(n => n.type === "announcement").length > 0 ? (
                  notifications
                    .filter(n => n.type === "announcement")
                    .map(renderNotification)
                ) : (
                  <div className="text-center py-10">
                    <Bell className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No announcements</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      There are no new gym announcements.
                    </p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainerNotifications;
