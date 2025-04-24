
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { Announcement } from '@/types/notification';
import { toast } from 'sonner';

interface UseAnnouncementsOptions {
  onlyActive?: boolean;
  targetRole?: string;
  limit?: number;
  branchId?: string;
}

export const useAnnouncements = (options: UseAnnouncementsOptions = {}) => {
  const queryClient = useQueryClient();
  const { onlyActive = true, targetRole, limit, branchId } = options;

  const { data: announcements = [], isLoading, error } = useQuery({
    queryKey: ['announcements', onlyActive, targetRole, limit, branchId],
    queryFn: async () => {
      let query = supabase
        .from('announcements')
        .select('*');

      if (onlyActive) {
        const now = new Date().toISOString();
        query = query.or(`expires_at.gt.${now},expires_at.is.null`);
      }

      if (targetRole) {
        query = query.contains('target_roles', [targetRole]);
      }

      if (branchId) {
        query = query.eq('branch_id', branchId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map((item: any): Announcement => ({
        id: item.id,
        title: item.title,
        content: item.content,
        authorId: item.author_id,
        authorName: item.author_name,
        createdAt: item.created_at,
        expiresAt: item.expires_at,
        priority: item.priority,
        targetRoles: item.target_roles,
        channels: item.channels,
        branchId: item.branch_id,
        sentCount: item.sent_count
      }));
    },
  });

  const createAnnouncement = useMutation({
    mutationFn: async (announcement: Omit<Announcement, "id" | "createdAt">) => {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          title: announcement.title,
          content: announcement.content,
          priority: announcement.priority,
          target_roles: announcement.targetRoles,
          channels: announcement.channels,
          expires_at: announcement.expiresAt,
          author_id: announcement.authorId,
          author_name: announcement.authorName,
          branch_id: announcement.branchId, // Corrected to use branchId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating announcement:', error);
      toast.error(`Failed to create announcement: ${error.message}`);
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: async (announcement: Announcement) => {
      const { data, error } = await supabase
        .from('announcements')
        .update({
          title: announcement.title,
          content: announcement.content,
          priority: announcement.priority,
          target_roles: announcement.targetRoles,
          channels: announcement.channels,
          expires_at: announcement.expiresAt,
          branch_id: announcement.branchId, // Corrected to use branchId
        })
        .eq('id', announcement.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating announcement:', error);
      toast.error(`Failed to update announcement: ${error.message}`);
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting announcement:', error);
      toast.error(`Failed to delete announcement: ${error.message}`);
    },
  });

  return {
    announcements,
    loading: isLoading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
};
