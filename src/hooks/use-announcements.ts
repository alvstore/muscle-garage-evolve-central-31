
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Announcement, adaptAnnouncementFromDB } from '@/types/notification';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('announcements').select('*');
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedAnnouncements = data.map(announcement => 
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
  }, [currentBranch?.id]);

  const createAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement | null> => {
    try {
      const timestamp = new Date().toISOString();
      
      const newAnnouncementData = {
        title: announcementData.title,
        content: announcementData.content,
        priority: announcementData.priority,
        author_id: announcementData.authorId || announcementData.author_id,
        author_name: announcementData.authorName || announcementData.author_name,
        target_roles: announcementData.targetRoles || announcementData.target_roles || [],
        channels: announcementData.channels || [],
        branch_id: announcementData.branchId || announcementData.branch_id || currentBranch?.id,
        created_at: timestamp,
        updated_at: timestamp,
        expires_at: announcementData.expiresAt || announcementData.expires_at,
        status: announcementData.status || 'active',
      };
      
      const { data, error } = await supabase
        .from('announcements')
        .insert(newAnnouncementData)
        .select('*')
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

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>): Promise<Announcement | null> => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
        // Convert camelCase to snake_case where needed
        target_roles: updates.targetRoles || updates.target_roles,
        author_id: updates.authorId || updates.author_id,
        author_name: updates.authorName || updates.author_name,
        branch_id: updates.branchId || updates.branch_id,
        expires_at: updates.expiresAt || updates.expires_at,
      };
      
      // Remove camelCase fields before sending to Supabase
      delete updateData.targetRoles;
      delete updateData.authorId;
      delete updateData.authorName;
      delete updateData.branchId;
      delete updateData.expiresAt;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const { data, error } = await supabase
        .from('announcements')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedAnnouncement = adaptAnnouncementFromDB(data);
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === id ? updatedAnnouncement : announcement
        )
      );
      toast.success('Announcement updated successfully');
      return updatedAnnouncement;
    } catch (error: any) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
      return null;
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
