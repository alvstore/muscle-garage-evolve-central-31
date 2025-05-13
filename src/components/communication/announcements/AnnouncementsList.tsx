
import { format } from 'date-fns';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Announcement } from '@/types/notification';
import { useAnnouncements } from '@/hooks/use-announcements';

export function AnnouncementsList() {
  const { announcements, isLoading } = useAnnouncements();

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading announcements...</div>;
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-10">
        <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No announcements</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          When new announcements are made, they'll appear here.
        </p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{announcement.title}</h3>
                <Badge className={getPriorityColor(announcement.priority)}>
                  {announcement.priority}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {announcement.content}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Posted by {announcement.authorName}</span>
              <span>•</span>
              <span>{format(new Date(announcement.createdAt), 'MMM d, yyyy')}</span>
            </div>
            {announcement.expiresAt && (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>Expires {format(new Date(announcement.expiresAt), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
