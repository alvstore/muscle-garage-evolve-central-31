import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Announcement, adaptAnnouncementFromDB } from '@/types/notification';
import { toast } from 'sonner';
import { useBranch } from './use-branch';

interface UseAnnouncementsProps {
  initialAnnouncements?: Announcement[];
}

export const useAnnouncements = ({ initialAnnouncements }: UseAnnouncementsProps = {}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!currentBranch?.id) {
        setAnnouncements([]);
        return;
      }

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error);
        toast.error(`Failed to fetch announcements: ${error.message}`);
      } else {
        const adaptedAnnouncements = data.map(adaptAnnouncementFromDB);
        setAnnouncements(adaptedAnnouncements);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
      toast.error(`An unexpected error occurred: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const createAnnouncement = async (newAnnouncement: Omit<Announcement, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!currentBranch?.id) {
        throw new Error("No branch selected");
      }

      const { data, error } = await supabase
        .from('announcements')
        .insert([
          {
            ...newAnnouncement,
            branch_id: currentBranch.id,
            author_name: 'Admin', // Replace with actual author name if available
            author_id: 'admin-user-id', // Replace with actual author ID if available
          },
        ])
        .select('*');

      if (error) {
        setError(error);
        toast.error(`Failed to create announcement: ${error.message}`);
      } else if (data && data.length > 0) {
        const createdAnnouncement = adaptAnnouncementFromDB(data[0]);
        setAnnouncements((prevAnnouncements) => [createdAnnouncement, ...prevAnnouncements]);
        toast.success('Announcement created successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
      toast.error(`An unexpected error occurred: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnnouncement = async (announcementId: string, updatedAnnouncement: Partial<Announcement>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(updatedAnnouncement)
        .eq('id', announcementId)
        .select('*');

      if (error) {
        setError(error);
        toast.error(`Failed to update announcement: ${error.message}`);
      } else if (data && data.length > 0) {
        const updated = adaptAnnouncementFromDB(data[0]);
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((announcement) =>
            announcement.id === announcementId ? updated : announcement
          )
        );
        toast.success('Announcement updated successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
      toast.error(`An unexpected error occurred: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnnouncement = async (announcementId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcementId);

      if (error) {
        setError(error);
        toast.error(`Failed to delete announcement: ${error.message}`);
      } else {
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter((announcement) => announcement.id !== announcementId)
        );
        toast.success('Announcement deleted successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
      toast.error(`An unexpected error occurred: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchAnnouncements();
    }
  }, [currentBranch?.id, fetchAnnouncements]);

  return {
    announcements,
    isLoading,
    error,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
};
