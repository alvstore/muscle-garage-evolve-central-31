
import { useState, useEffect } from 'react';
import { Announcement } from '@/types/notification';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

// Define a valid NotificationChannel type that includes 'app'
export type NotificationChannel = 'in-app' | 'email' | 'sms' | 'whatsapp';

export const useAnnouncements = (options: {
  branchId?: string | null;
  limit?: number;
  onlyActive?: boolean;
} = {}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('announcements' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any;
      
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

      if (!data) {
        setAnnouncements([]);
        return;
      }

      const formattedAnnouncements: Announcement[] = data.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled Announcement',
        content: item.content || '',
        createdAt: item.created_at,
        expiresAt: item.expires_at,
        priority: item.priority || 'normal',
        channel: (item.channel as NotificationChannel) || 'in-app',
        branchId: item.branch_id,
        createdBy: item.created_by,
        isGlobal: item.is_global || false,
        isActive: item.is_active || true,
        category: item.category || 'general',
        // Add these required fields with default values since they might be missing
        authorId: item.created_by || '',
        authorName: item.author_name || 'Unknown',
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

  // Add the createAnnouncement function
  const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    try {
      const newAnnouncement = {
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        created_by: announcement.authorId,
        author_name: announcement.authorName,
        expires_at: announcement.expiresAt,
        is_global: announcement.forBranchIds ? announcement.forBranchIds.length === 0 : false,
        is_active: true,
        branch_id: announcement.forBranchIds && announcement.forBranchIds.length > 0 
          ? announcement.forBranchIds[0] 
          : null,
        channel: announcement.channels || ['in-app'],
        target_roles: announcement.targetRoles || ['member'],
        category: announcement.category || 'general',
      };

      const { data, error } = await supabase
        .from('announcements' as any)
        .insert(newAnnouncement)
        .select('*')
        .single();

      if (error) throw error;

      toast.success('Announcement created successfully');
      fetchAnnouncements();
      return data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
      return null;
    }
  };

  const refresh = () => {
    fetchAnnouncements();
  };

  return { announcements, loading, error, refresh, createAnnouncement };
};
