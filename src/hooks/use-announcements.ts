
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Announcement, adaptAnnouncementFromDB } from '@/types/notification';
import { communicationService } from '@/services';
import { useBranch } from './use-branches';

export const useAnnouncements = () => {
  const { currentBranch } = useBranch();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchAnnouncements = async () => {
    try {
      if (!currentBranch?.id) return [];
      
      const response = await communicationService.getAnnouncements(currentBranch.id);
      return response.map((item: any) => adaptAnnouncementFromDB(item));
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['announcements', currentBranch?.id],
    queryFn: fetchAnnouncements,
    enabled: !!currentBranch?.id,
  });

  useEffect(() => {
    if (data) {
      setAnnouncements(data);
    }
  }, [data]);

  const createAnnouncement = async (announcement: Partial<Announcement>): Promise<boolean> => {
    try {
      if (!currentBranch?.id) return false;
      
      const result = await communicationService.createAnnouncement({
        ...announcement,
        branch_id: currentBranch.id
      } as Announcement);
      
      if (result) {
        refetch();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error creating announcement:', error);
      return false;
    }
  };

  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    try {
      const result = await communicationService.deleteAnnouncement(id);
      
      if (result) {
        refetch();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }
  };

  return {
    announcements,
    isLoading,
    createAnnouncement,
    deleteAnnouncement,
    refreshAnnouncements: refetch
  };
};
