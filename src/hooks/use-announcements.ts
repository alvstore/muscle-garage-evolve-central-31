
import { useState, useEffect } from 'react';
import { Announcement } from '@/types/notification';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

// Define a valid NotificationChannel type that includes 'app'
export type NotificationChannel = 'app' | 'email' | 'sms' | 'whatsapp';

export const useAnnouncements = (options: {
  branchId?: string | null;
  limit?: number;
  onlyActive?: boolean;
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply branch filter if provided
      if (options.branchId) {
        query = query.eq('branch_id', options.branchId);
      }
      
      // Only fetch active announcements if specified
      if (options.onlyActive) {
        query = query.eq('is_active', true);
      }
      
      // Apply limit if specified
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedAnnouncements: Announcement[] = data.map(item => ({
        id: item.id,
        title: item.title || 'Untitled Announcement',
        content: item.content || '',
        createdAt: item.created_at,
        expiresAt: item.expires_at,
        priority: item.priority || 'normal',
        channel: item.channel as NotificationChannel || 'app',
        branchId: item.branch_id,
        createdBy: item.created_by,
        isGlobal: item.is_global || false,
        isActive: item.is_active || true,
        category: item.category || 'general',
      }));

      setAnnouncements(formattedAnnouncements);
      setError(null);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError(error as Error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [options.branchId, options.limit, options.onlyActive]);

  const refresh = () => {
    fetchAnnouncements();
  };

  return { announcements, loading, error, refresh };
};
