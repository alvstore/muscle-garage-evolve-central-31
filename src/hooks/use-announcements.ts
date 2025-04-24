
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
      
      // For now, just return mock data since we don't have an announcements table yet
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Important Notice',
          content: 'The gym will be closed for maintenance this weekend',
          authorId: 'admin1',
          authorName: 'Admin User',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          targetRoles: ['staff', 'member', 'trainer'],
          forBranchIds: [],
          createdBy: 'Admin User',
          channels: ['app', 'email']
        },
        {
          id: '2',
          title: 'New Class Schedule',
          content: 'Check out our updated class schedule for next month',
          authorId: 'staff1',
          authorName: 'Staff User',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          targetRoles: ['member'],
          forBranchIds: [],
          createdBy: 'Staff User',
          channels: ['app']
        }
      ];
      
      setAnnouncements(mockAnnouncements);
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
      // In a real app, we would insert into the database
      // For now just show a success message
      toast.success('Announcement created successfully');
      fetchAnnouncements(); // Refresh the list with our mock data
      return true;
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
      return false;
    }
  };

  return { announcements, loading, createAnnouncement, refreshAnnouncements: fetchAnnouncements };
}
