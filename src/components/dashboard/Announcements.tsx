
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Announcement } from '@/types/notification';
import { MessageSquare, Eye, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/use-permissions';

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  const { userRole } = usePermissions();

  const handleDelete = (id: string) => {
    toast.success("Announcement deleted");
    // In a real app, this would make an API call to delete the announcement
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
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div key={announcement.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{announcement.title}</h3>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground">
                {format(parseISO(announcement.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{announcement.content}</p>
          
          <div className="mt-3 flex justify-end space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{announcement.title}</DialogTitle>
                  <DialogDescription>
                    Posted by {announcement.authorName} on {format(parseISO(announcement.createdAt), 'MMMM dd, yyyy')}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>{announcement.content}</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" size="sm">Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {userRole === 'member' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove this announcement from your view. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(announcement.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Announcements;
