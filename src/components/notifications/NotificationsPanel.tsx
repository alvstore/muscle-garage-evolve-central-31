
import React, { useState } from "react";
import NotificationList from "./NotificationList";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Loader2, Filter } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import notificationService from "@/services/notificationService";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NotificationsPanelProps {
  onClose?: () => void; // Making this prop optional with "?"
  categoryFilter?: string; // Filter notifications by category (all, gym, member, staff, trainer)
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose, categoryFilter = 'all' }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'read' | 'unread'>('all');
  const [filters, setFilters] = useState({
    system: true,
    followUp: true,
    payment: true,
    checkin: true,
    task: true,
    membership: true
  });

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user?.id || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await notificationService.markAllAsRead(user.id);
      toast.success("All notifications marked as read");
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    if (!user?.id || isProcessing) return;
    
    setIsProcessing(true);
    try {
      // This would call a new method we need to add to the notification service
      await notificationService.clearAllNotifications(user.id);
      toast.success("All notifications cleared");
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter notifications based on active tab, filters, and category
  const getFilteredNotifications = () => {
    const types = [];
    if (filters.system) types.push('system');
    if (filters.followUp) types.push('follow-up');
    if (filters.payment) types.push('payment');
    if (filters.checkin) types.push('checkin');
    if (filters.task) types.push('task');
    if (filters.membership) types.push('membership');
    
    return types;
  };
  
  // Get category-specific filter types
  const getCategoryFilterTypes = () => {
    // If 'all' is selected, include 'all' as a category type
    if (categoryFilter === 'all') return ['all'];
    
    // Otherwise return the specific category for filtering
    return [categoryFilter];
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
        <div className="flex gap-2 items-center">
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'all' | 'read' | 'unread')} className="w-full">
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
              <TabsTrigger value="read" className="text-xs">Read</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 ml-2">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={filters.system}
                onCheckedChange={(checked) => setFilters({ ...filters, system: checked })}
              >
                System
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.followUp}
                onCheckedChange={(checked) => setFilters({ ...filters, followUp: checked })}
              >
                Follow-ups
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.payment}
                onCheckedChange={(checked) => setFilters({ ...filters, payment: checked })}
              >
                Payments
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.checkin}
                onCheckedChange={(checked) => setFilters({ ...filters, checkin: checked })}
              >
                Check-ins
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.task}
                onCheckedChange={(checked) => setFilters({ ...filters, task: checked })}
              >
                Tasks
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.membership}
                onCheckedChange={(checked) => setFilters({ ...filters, membership: checked })}
              >
                Memberships
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
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
        <NotificationList 
          userId={user?.id} 
          refreshTrigger={refreshTrigger} 
          filterStatus={activeTab} 
          filterTypes={getFilteredNotifications()} 
          categoryTypes={getCategoryFilterTypes()}
        />
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
