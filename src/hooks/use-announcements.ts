
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Announcement, adaptAnnouncementFromDB } from '@/types/notification';
import { toast } from 'sonner';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const adaptedAnnouncements = data.map(announcement => adaptAnnouncementFromDB(announcement));
      setAnnouncements(adaptedAnnouncements);
      return adaptedAnnouncements;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createAnnouncement = async (announcement: Partial<Announcement>) => {
    try {
      // Format announcement to match database schema
      const dbAnnouncement = {
        title: announcement.title,
        content: announcement.content,
        author_name: announcement.author_name,
        author_id: announcement.author_id,
        priority: announcement.priority || 'medium',
        target_roles: announcement.target_roles || [],
        channels: announcement.channels || [],
        expires_at: announcement.expires_at,
        branch_id: announcement.branch_id
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert(dbAnnouncement)
        .select();

      if (error) throw error;

      const newAnnouncement = adaptAnnouncementFromDB(data[0]);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      
      return newAnnouncement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
      throw error;
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    try {
      // Format announcement to match database schema
      const dbUpdates = {
        title: updates.title,
        content: updates.content,
        author_name: updates.author_name,
        author_id: updates.author_id,
        priority: updates.priority,
        target_roles: updates.target_roles,
        channels: updates.channels,
        expires_at: updates.expires_at,
        branch_id: updates.branch_id
      };

      const { data, error } = await supabase
        .from('announcements')
        .update(dbUpdates)
        .eq('id', id)
        .select();

      if (error) throw error;

      const updatedAnnouncement = adaptAnnouncementFromDB(data[0]);
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === id ? updatedAnnouncement : announcement
        )
      );
      
      return updatedAnnouncement;
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
      throw error;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
      throw error;
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    isLoading,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };
};
