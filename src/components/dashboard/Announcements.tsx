
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Announcement } from '@/types/notification';
import { MessageSquare, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useState } from 'react';

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const handleDelete = (id: string) => {
    // In a real implementation, this would call an API to delete the announcement
    toast.success('Announcement deleted');
  };

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
    <>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(announcement.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(announcement.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Posted on {selectedAnnouncement && format(parseISO(selectedAnnouncement.createdAt), 'MMMM d, yyyy')}
            </p>
            <p className="text-sm">{selectedAnnouncement?.content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Announcements;
