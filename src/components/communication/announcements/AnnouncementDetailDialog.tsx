
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { Announcement } from '@/types/notification';
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";

interface AnnouncementDetailDialogProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementDetailDialog: React.FC<AnnouncementDetailDialogProps> = ({
  announcement,
  isOpen,
  onClose
}) => {
  if (!announcement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <DialogTitle>{announcement.title}</DialogTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">
              Published by {announcement.authorName} on {format(parseISO(announcement.createdAt), "MMM dd, yyyy")}
            </span>
            <Badge variant="outline" className="capitalize ml-auto">
              {announcement.priority} priority
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-2">
          <div className="border rounded-md p-4 mb-4 whitespace-pre-wrap">
            {announcement.content}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {announcement.expires_at && (
              <div>
                <p className="font-medium">Expires</p>
                <p className="text-muted-foreground">
                  {format(parseISO(announcement.expires_at), "MMM dd, yyyy")}
                </p>
              </div>
            )}
            
            <div>
              <p className="font-medium">Target Audience</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {announcement.targetRoles && announcement.targetRoles.map((role) => (
                  <Badge key={role} variant="secondary" className="capitalize">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
            
            {announcement.channels && (
              <div>
                <p className="font-medium">Notification Channels</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {announcement.channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="capitalize">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDetailDialog;
