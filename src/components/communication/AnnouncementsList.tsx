
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/services/supabaseClient';
import { Announcement } from '@/types/notification';

export function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select(`
            id,
            title,
            content,
            priority,
            created_at,
            expires_at,
            profiles:author_id (
              full_name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match the Announcement type
        const formattedAnnouncements: Announcement[] = (data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          priority: item.priority,
          createdAt: item.created_at,
          expiresAt: item.expires_at,
          authorId: item.profiles?.[0]?.id || '',
          authorName: item.profiles?.[0]?.full_name || 'Unknown',
          // Add other required fields with default values if needed
          createdBy: item.profiles?.[0]?.full_name || 'Unknown',
          targetRoles: [],
          channels: []
        }));

        setAnnouncements(formattedAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div>Loading announcements...</div>;
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
