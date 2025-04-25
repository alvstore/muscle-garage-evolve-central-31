
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Announcement, adaptAnnouncementFromDB } from '@/types/notification';
import { toast } from 'sonner';
import { useBranch } from './use-branch';
import { useAuth } from './use-auth';

interface UseAnnouncementsProps {
  limit?: number;
}

export const useAnnouncements = (props?: UseAnnouncementsProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();
  const { user } = useAuth();
  const limit = props?.limit || 100;

  const fetchAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      // Filter by branch if a branch is selected
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      // Filter announcements by user role if not admin
      if (user && user.role !== 'admin') {
        query = query.contains('target_roles', [user.role]);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedAnnouncements: Announcement[] = data.map(announcement => 
          adaptAnnouncementFromDB(announcement)
        );
        
        setAnnouncements(formattedAnnouncements);
      }
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id, limit, user]);

  const createAnnouncement = async (announcementData: Omit<Announcement, "id" | "createdAt">): Promise<Announcement | null> => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: announcementData.title,
          content: announcementData.content,
          author_id: announcementData.authorId,
          author_name: announcementData.authorName,
          priority: announcementData.priority,
          expires_at: announcementData.expiresAt,
          channels: announcementData.channels || [],
          target_roles: announcementData.targetRoles || [],
          branch_id: announcementData.branchId || currentBranch?.id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }

      const newAnnouncement = adaptAnnouncementFromDB(data);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      toast.success('Announcement created successfully');
      return newAnnouncement;
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
      return null;
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>): Promise<boolean> => {
    try {
      // Convert to snake_case for DB
      const dbUpdates: any = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.content) dbUpdates.content = updates.content;
      if (updates.authorId) dbUpdates.author_id = updates.authorId;
      if (updates.authorName) dbUpdates.author_name = updates.authorName;
      if (updates.priority) dbUpdates.priority = updates.priority;
      if (updates.expiresAt) dbUpdates.expires_at = updates.expiresAt;
      if (updates.channels) dbUpdates.channels = updates.channels;
      if (updates.targetRoles) dbUpdates.target_roles = updates.targetRoles;
      if (updates.branchId) dbUpdates.branch_id = updates.branchId;

      const { error } = await supabase
        .from('announcements')
        .update(dbUpdates)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === id 
            ? { ...announcement, ...updates } 
            : announcement
        )
      );
      
      toast.success('Announcement updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
      return false;
    }
  };

  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
      toast.success('Announcement deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
      return false;
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    isLoading,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };
};
