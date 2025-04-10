
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ActivitySectionProps {
  fullWidth?: boolean;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ fullWidth = false }) => {
  // Mock activity data
  const activities = [
    {
      id: "1",
      title: "New Member Registration",
      description: "Rahul Singh registered as a new member",
      time: "10 minutes ago",
      type: "member",
      user: {
        name: "Rahul Singh",
        avatar: "/placeholder.svg"
      }
    },
    {
      id: "2",
      title: "Payment Received",
      description: "Received ₹5,000 for Gold Membership",
      time: "1 hour ago",
      type: "payment",
      user: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg"
      }
    },
    {
      id: "3",
      title: "Class Booked",
      description: "Booked Yoga Class for tomorrow 6 PM",
      time: "2 hours ago",
      type: "class",
      user: {
        name: "Vikram Mehta",
        avatar: "/placeholder.svg"
      }
    },
    {
      id: "4",
      title: "Membership Renewed",
      description: "Renewed Platinum Membership for 6 months",
      time: "Yesterday at 3:45 PM",
      type: "membership",
      user: {
        name: "Ananya Patel",
        avatar: "/placeholder.svg"
      }
    },
    {
      id: "5",
      title: "Staff Login",
      description: "Logged in from a new device",
      time: "Yesterday at 10:23 AM",
      type: "staff",
      user: {
        name: "Kiran Joshi",
        avatar: "/placeholder.svg"
      }
    }
  ];

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "member":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "payment":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "class":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "membership":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "staff":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <Card className={fullWidth ? "w-full" : ""}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in your gym</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 rounded-md border p-4">
                  <Avatar>
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <Badge className={`text-xs ${getActivityTypeColor(activity.type)}`}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="members">
            <div className="space-y-4">
              {activities
                .filter(activity => activity.type === "member")
                .map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 rounded-md border p-4">
                    <Avatar>
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                        <Badge className={`text-xs ${getActivityTypeColor(activity.type)}`}>
                          Member
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="payments">
            <div className="space-y-4">
              {activities
                .filter(activity => activity.type === "payment")
                .map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 rounded-md border p-4">
                    <Avatar>
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                        <Badge className={`text-xs ${getActivityTypeColor(activity.type)}`}>
                          Payment
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="classes">
            <div className="space-y-4">
              {activities
                .filter(activity => activity.type === "class")
                .map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 rounded-md border p-4">
                    <Avatar>
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                        <Badge className={`text-xs ${getActivityTypeColor(activity.type)}`}>
                          Class
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
