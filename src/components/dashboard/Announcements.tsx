
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Announcement } from '@/types/communication/notification';
import { MessageSquare } from 'lucide-react';

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="text-center py-10">
        <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No announcements</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You'll see gym announcements here when they're available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div key={announcement.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{announcement.title}</h3>
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground">
                {format(parseISO(announcement.created_at), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{announcement.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Announcements;
