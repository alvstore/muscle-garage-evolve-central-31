
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityItem } from "@/types/dashboard";
import { getInitials } from "@/utils/stringUtils";

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "membership":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "check-in":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "payment":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "class":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in the gym</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-9 w-9">
                {activity.user && (
                  <>
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user?.name ? getInitials(activity.user.name) : 'NA'}</AvatarFallback>
                  </>
                )}
                {activity.member && !activity.user && (
                  <>
                    <AvatarImage src={activity.member.avatar} alt={activity.member.name} />
                    <AvatarFallback>{getInitials(activity.member.name)}</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <span className="text-xs text-muted-foreground">{activity.time || activity.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="pt-1">
                  <Badge variant="outline" className={`text-xs py-0 px-2 ${getTypeColor(activity.type)}`}>
                    {activity.type.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
