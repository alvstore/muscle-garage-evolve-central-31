import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { followUpService } from '@/services/followUpService';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar, 
  ArrowRight, 
  CheckCircle2,
  XCircle,
  User,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeadTimelineProps {
  leadId: string;
}

type TimelineActivity = {
  id: string;
  type: 'followUp' | 'stageChange' | 'created' | 'assigned';
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
};

const LeadTimeline: React.FC<LeadTimelineProps> = ({ leadId }) => {
  // Fetch follow-up history
  const { data: followUps, isLoading: isLoadingFollowUps } = useQuery({
    queryKey: ['followUpHistory', leadId],
    queryFn: () => followUpService.getFollowUpHistory(leadId),
    enabled: !!leadId
  });

  // Combine all activities into a timeline
  const timelineActivities = React.useMemo(() => {
    const activities: TimelineActivity[] = [];

    // Add follow-ups to timeline
    if (followUps) {
      followUps.forEach(followUp => {
        // Determine icon based on follow-up type
        let icon;
        switch (followUp.type) {
          case 'call':
            icon = <Phone className="h-4 w-4" />;
            break;
          case 'email':
            icon = <Mail className="h-4 w-4" />;
            break;
          case 'meeting':
            icon = <Calendar className="h-4 w-4" />;
            break;
          case 'whatsapp':
            icon = <MessageCircle className="h-4 w-4" />;
            break;
          default:
            icon = <MessageCircle className="h-4 w-4" />;
        }

        // Add scheduled follow-ups
        if (followUp.status === 'scheduled') {
          activities.push({
            id: `scheduled-${followUp.id}`,
            type: 'followUp',
            date: followUp.scheduled_at || new Date().toISOString(),
            title: `Scheduled ${followUp.type} follow-up`,
            description: followUp.content,
            icon: <Clock className="h-4 w-4" />,
            status: 'scheduled'
          });
        } 
        // Add completed follow-ups
        else {
          activities.push({
            id: followUp.id,
            type: 'followUp',
            date: followUp.sent_at,
            title: `${followUp.type.charAt(0).toUpperCase() + followUp.type.slice(1)} follow-up`,
            description: followUp.content,
            icon,
            status: followUp.status
          });

          // Add response if available
          if (followUp.response) {
            activities.push({
              id: `response-${followUp.id}`,
              type: 'followUp',
              date: followUp.response_at || followUp.sent_at,
              title: 'Lead response',
              description: followUp.response,
              icon: <ArrowRight className="h-4 w-4" />,
              status: 'response'
            });
          }
        }
      });
    }

    // Sort activities by date (newest first)
    return activities.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [followUps]);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="outline">Sent</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-blue-50">Delivered</Badge>;
      case 'read':
        return <Badge variant="outline" className="bg-green-50">Read</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50">Failed</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-yellow-50">Scheduled</Badge>;
      case 'response':
        return <Badge variant="outline" className="bg-purple-50">Response</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingFollowUps ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : timelineActivities.length > 0 ? (
          <div className="space-y-8">
            {timelineActivities.map((activity, index) => (
              <div key={activity.id} className="relative pl-6 pb-8">
                {/* Timeline connector */}
                {index < timelineActivities.length - 1 && (
                  <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-200" />
                )}
                
                {/* Activity dot */}
                <div className="absolute left-0 top-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-200">
                  <div className="h-4 w-4 text-primary">
                    {activity.icon}
                  </div>
                </div>
                
                {/* Activity content */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {activity.title}
                    </span>
                    {activity.status && getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1">
                    {format(parseISO(activity.date), 'MMM dd, yyyy • h:mm a')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No activity recorded for this lead yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadTimeline;
