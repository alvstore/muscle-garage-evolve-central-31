
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { Announcement } from '@/types/notification';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select(`
            id,
            title,
            content,
            priority,
            created_at,
            expires_at,
            target_roles,
            for_branch_ids,
            profiles:author_id (
              id,
              full_name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match the Announcement type
        const formattedAnnouncements: Announcement[] = (data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          authorId: item.author_id,
          authorName: item.profiles?.[0]?.full_name || 'Unknown',
          createdAt: item.created_at,
          expiresAt: item.expires_at,
          priority: item.priority || 'medium',
          targetRoles: item.target_roles || [],
          forBranchIds: item.for_branch_ids || [],
          createdBy: item.profiles?.[0]?.full_name || 'Unknown',
          channels: []
        }));

        setAnnouncements(formattedAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        toast.error('Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const createAnnouncement = async (data: Omit<Announcement, 'id' | 'createdAt' | 'authorName' | 'createdBy'>) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: data.title,
          content: data.content,
          author_id: data.authorId,
          priority: data.priority,
          target_roles: data.targetRoles || [],
          for_branch_ids: data.forBranchIds || [],
          expires_at: data.expiresAt
        });

      if (error) throw error;
      
      toast.success('Announcement created successfully');
      return true;
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
      return false;
    }
  };

  return { announcements, loading, createAnnouncement };
}
