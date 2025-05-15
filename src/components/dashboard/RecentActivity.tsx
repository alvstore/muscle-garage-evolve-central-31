
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityItem } from '@/types/dashboard';

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading?: boolean;
  onViewAll?: () => void;
  emptyMessage?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities = [], 
  isLoading = false,
  onViewAll,
  emptyMessage = 'No recent activities'
}) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" disabled>View All</Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48">
            <p className="text-muted-foreground">Loading activities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll}>View All</Button>
      </CardHeader>
      <CardContent className="pt-2">
        {activities.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                  {activity.member ? (
                    <span className="font-medium text-xs">{activity.member.name?.substring(0, 2).toUpperCase() || "ME"}</span>
                  ) : (
                    <span className="font-medium text-xs">
                      {(activity.user?.name || "").substring(0, 2).toUpperCase() || "AC"}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.member?.name || activity.user?.name || "Unknown"}</span>
                    <span className="text-muted-foreground"> {activity.description}</span>
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {activity.time ? (
                      format(new Date(activity.time), 'h:mm a')
                    ) : (
                      activity.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : "Recently"
                    )}
                  </p>
                </div>

                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
