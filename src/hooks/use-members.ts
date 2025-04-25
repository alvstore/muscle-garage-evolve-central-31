
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface Member {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  goal?: string;
  status?: 'active' | 'inactive' | 'pending';
  branch_id?: string;
  membership_status?: 'active' | 'expired' | 'none';
  membership_id?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  trainer_id?: string;
}

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Only fetch if we have a branch
      if (!currentBranch?.id) {
        setMembers([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('members')
        .select(`
          id,
          user_id,
          name,
          email,
          phone,
          date_of_birth,
          gender,
          goal,
          status,
          branch_id,
          membership_status,
          membership_id,
          membership_start_date,
          membership_end_date,
          trainer_id
        `)
        .eq('branch_id', currentBranch.id);

      if (fetchError) throw fetchError;
      
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!currentBranch?.id) {
      setMembers([]);
      setIsLoading(false);
      return;
    }
    
    fetchMembers();
    
    // Set up real-time subscription for members table
    const channel = supabase
      .channel('members_realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'members',
          filter: `branch_id=eq.${currentBranch.id}`
        }, 
        (payload) => {
          console.log('Members data changed:', payload);
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch]);

  return {
    members,
    isLoading,
    error,
    refetch: fetchMembers
  };
};
