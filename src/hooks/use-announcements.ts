
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  expires_at?: string;
  author: {
    name: string;
    avatar_url?: string;
  };
}

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
            profiles:author_id (
              full_name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAnnouncements(data || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        toast.error('Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const createAnnouncement = async (data: Omit<Announcement, 'id' | 'created_at' | 'author'>) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert(data);

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
