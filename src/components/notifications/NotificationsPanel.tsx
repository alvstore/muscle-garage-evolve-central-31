
import React from "react";
import NotificationList from "./NotificationList";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface NotificationsPanelProps {
  onClose?: () => void; // Making this prop optional with "?"
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const { user } = useAuth();

  // This function would be called when marking all notifications as read
  const handleMarkAllAsRead = () => {
    // Implementation would go here
    console.log("Marked all notifications as read");
  };

  // This function would be called when clearing all notifications
  const handleClearAll = () => {
    // Implementation would go here
    console.log("Cleared all notifications");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Stay updated with gym activities
        </p>
      </div>

      <div className="flex items-center justify-between p-3 border-b">
        <span className="text-sm font-medium">Recent</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
          <Button variant="ghost" size="sm" className="h-8" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <NotificationList userId={user?.id} />
      </div>

      {onClose && (
        <div className="p-3 border-t">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
