
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
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
  const { currentBranch } = useBranch();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeMemberCount, setActiveMemberCount] = useState(0);

  // Function to fetch members from Supabase
  const fetchMembers = async () => {
    if (!currentBranch?.id) {
      setMembers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('branch_id', currentBranch.id);

      if (error) throw error;

      // Count active members correctly based on the 'status' column in members table
      // not from profiles table
      const activeCount = data?.filter(m => m.status === 'active').length || 0;
      setActiveMemberCount(activeCount);
      
      setMembers(data || []);
    } catch (err: any) {
      console.error('Error fetching members:', err);
      setError(err);
      toast.error('Failed to fetch members');
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (member: Omit<Member, 'id'>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('members')
        .insert({
          ...member,
          branch_id: currentBranch?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // After successfully creating a member, let's assign a default membership if one was provided
      if (member.membership_id) {
        try {
          const { error: membershipError } = await supabase
            .from('member_memberships')
            .insert({
              member_id: data.id,
              membership_id: member.membership_id,
              start_date: member.membership_start_date || new Date().toISOString(),
              end_date: member.membership_end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              branch_id: currentBranch?.id,
              total_amount: 0, // Default value, should be updated later
              amount_paid: 0,
              payment_status: 'pending'
            });
            
          if (membershipError) {
            console.error('Error assigning membership:', membershipError);
            toast.error('Member created but failed to assign membership');
          } else {
            // Update member with membership status
            await supabase
              .from('members')
              .update({
                membership_status: 'active',
                status: 'active'
              })
              .eq('id', data.id);
          }
        } catch (membershipErr) {
          console.error('Error in membership assignment:', membershipErr);
          toast.error('Member created but failed to assign membership');
        }
      }
      
      setMembers(prev => [data as Member, ...prev]);
      toast.success('Member added successfully');
      return data as Member;
    } catch (err: any) {
      console.error('Error adding member:', err);
      toast.error('Failed to add member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setMembers(prev => 
        prev.map(member => 
          member.id === id ? data as Member : member
        )
      );
      toast.success('Member updated successfully');
      return data as Member;
    } catch (err: any) {
      console.error('Error updating member:', err);
      toast.error('Failed to update member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMembers(prev => prev.filter(member => member.id !== id));
      toast.success('Member deleted successfully');
    } catch (err: any) {
      console.error('Error deleting member:', err);
      toast.error('Failed to delete member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    
    // Set up real-time subscription
    if (currentBranch?.id) {
      const channel = supabase
        .channel('members_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'members',
          filter: `branch_id=eq.${currentBranch.id}`
        }, () => {
          fetchMembers();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentBranch?.id]);

  return {
    members,
    activeMemberCount,
    isLoading,
    error,
    refetch: fetchMembers,
    addMember,
    updateMember,
    deleteMember
  };
};
