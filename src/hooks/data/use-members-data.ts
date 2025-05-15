import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '../use-branch';
import { Member } from '@/types/member';
import { toast } from '@/utils/toast-manager';

export const useMembersData = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchMembers = useCallback(async () => {
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
      
      if (data) {
        // Map database fields to Member type
        const mappedMembers: Member[] = convertDbMembers(data);
        
        setMembers(mappedMembers);
      }
    } catch (err: any) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

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
  }, [currentBranch?.id, fetchMembers]);

  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      setIsLoading(true);
      
      if (!currentBranch?.id) {
        throw new Error('No branch selected');
      }
      
      // Ensure branch_id is set
      const dataWithBranch = { 
        ...memberData, 
        branch_id: currentBranch.id 
      };
      
      const { data, error } = await supabase
        .from('members')
        .insert([dataWithBranch])
        .select();
        
      if (error) throw error;
      
      toast.success('Member added successfully');
      await fetchMembers();
      return data?.[0] as Member;
    } catch (err: any) {
      console.error('Error adding member:', err);
      toast.error(err.message || 'Failed to add member');
      return null;
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
        .select();
        
      if (error) throw error;
      
      toast.success('Member updated successfully');
      await fetchMembers();
      return data?.[0] as Member;
    } catch (err: any) {
      console.error('Error updating member:', err);
      toast.error(err.message || 'Failed to update member');
      return null;
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
      
      toast.success('Member deleted successfully');
      await fetchMembers();
      return true;
    } catch (err: any) {
      console.error('Error deleting member:', err);
      toast.error(err.message || 'Failed to delete member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    members,
    isLoading,
    error,
    refetch: fetchMembers,
    addMember,
    updateMember,
    deleteMember
  };
};

// Fix issue with membershipStartDate and membershipEndDate
const convertDbMembers = (data: any[]): Member[] => {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    status: item.status,
    membershipStatus: item.membership_status,
    membershipId: item.membership_id,
    membershipStartDate: item.membership_start_date ? item.membership_start_date.toString() : '', // Convert to string
    membershipEndDate: item.membership_end_date ? item.membership_end_date.toString() : '', // Convert to string
    role: "member",
    branchId: item.branch_id
    // Add any other fields needed
  }));
};
