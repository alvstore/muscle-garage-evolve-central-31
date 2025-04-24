
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { Announcement } from '@/types/notification';
import { useAuth } from '@/hooks/use-auth';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAnnouncements = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // First get the user's role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (!profileData) throw new Error('Could not determine user role');
      
      // Then get announcements targeted for that role
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          author_id,
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
        .contains('target_roles', [profileData.role])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the Announcement type
      const formattedAnnouncements: Announcement[] = (data || []).map((item) => {
        // Fix the profiles property by explicitly checking its structure
        const authorProfile = item.profiles;
        const authorName = authorProfile && typeof authorProfile === 'object' && 'full_name' in authorProfile ? 
                           authorProfile.full_name || 'Unknown' : 'Unknown';
        
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          authorId: item.author_id,
          authorName: authorName,
          createdAt: item.created_at,
          expiresAt: item.expires_at,
          priority: item.priority || 'medium',
          targetRoles: item.target_roles || [],
          forBranchIds: item.for_branch_ids || [],
          createdBy: authorName,
          channels: []
        };
      });

      setAnnouncements(formattedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  const createAnnouncement = async (data: Omit<Announcement, 'id' | 'createdAt' | 'authorName' | 'createdBy'>) => {
    if (!user) {
      toast.error('You must be logged in to create announcements');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: data.title,
          content: data.content,
          author_id: user.id,
          priority: data.priority,
          target_roles: data.targetRoles || [],
          for_branch_ids: data.forBranchIds || [],
          expires_at: data.expiresAt
        });

      if (error) throw error;
      
      toast.success('Announcement created successfully');
      fetchAnnouncements(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
      return false;
    }
  };

  return { announcements, loading, createAnnouncement, refreshAnnouncements: fetchAnnouncements };
}
