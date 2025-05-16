
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communicationService } from '@/services/communicationService';
import { Announcement } from '@/types/notification';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';
import { useState } from 'react';

export const useAnnouncements = () => {
  const { currentBranch } = useBranch();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const queryClient = useQueryClient();

  // Fetch announcements
  const {
    data: announcements,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['announcements', currentBranch?.id],
    queryFn: () => communicationService.getAnnouncements(currentBranch?.id),
    enabled: !!currentBranch?.id,
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: (announcement: Partial<Announcement>) =>
      communicationService.createAnnouncement(announcement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement created successfully');
      setSelectedAnnouncement(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to create announcement: ${error.message}`);
    },
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => communicationService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete announcement: ${error.message}`);
    },
  });

  const selectAnnouncement = (announcement: Announcement | null) => {
    setSelectedAnnouncement(announcement);
  };

  const createAnnouncement = (announcement: Partial<Announcement>) => {
    createAnnouncementMutation.mutate({
      ...announcement,
      branch_id: currentBranch?.id,
    });
  };

  const deleteAnnouncement = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncementMutation.mutate(id);
    }
  };

  return {
    announcements,
    isLoading,
    error,
    refetch,
    selectedAnnouncement,
    selectAnnouncement,
    createAnnouncement,
    deleteAnnouncement,
    isCreating: createAnnouncementMutation.isPending,
    isDeleting: deleteAnnouncementMutation.isPending,
  };
};
