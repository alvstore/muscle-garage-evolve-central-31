import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import communicationService from '@/services/communication/communicationService';
import { useBranch } from '@/hooks/settings/use-branches';

export const useAnnouncements = () => {
  const { currentBranch } = useBranch();
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      if (!currentBranch?.id) return [];
      const response = await communicationService.getAnnouncements(currentBranch.id);
      setAnnouncements(response);
      return response;
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

  return {
    announcements,
    isLoading,
    refreshAnnouncements: refetch,
    fetchAnnouncements
  };
};
