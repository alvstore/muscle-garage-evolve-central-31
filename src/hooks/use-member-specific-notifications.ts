
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import supabase from '@/services/supabaseClient';

export const useMemberSpecificNotifications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['member-specific-notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Fetch notifications specific to this member
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });
};
