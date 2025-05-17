
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/settings/use-branches';

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  membership_status?: string;
  status?: string;
  membership_end_date?: string;
  membership_id?: string;
  branch_id?: string;
  trainer_id?: string;
  avatar?: string;
  goal?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
  // Added missing fields to match the database schema
  id_type?: string;
  id_number?: string;
  profile_picture?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!currentBranch?.id) {
        console.warn("No branch selected, cannot fetch members");
        setMembers([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          memberships:membership_id (
            name
          )
        `)
        .eq('branch_id', currentBranch.id);

      if (error) {
        console.error('Supabase error fetching members:', error);
        throw error;
      }
      
      setMembers(data);
    } catch (err: any) {
      console.error('Error fetching members:', err);
      setError(err.message || 'Failed to load members');
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const createMember = async (member: Omit<Member, 'id'>): Promise<Member | null> => {
    setIsLoading(true);
    try {
      if (!currentBranch?.id) {
        toast.error('No branch selected');
        return null;
      }
      
      // Ensure all required fields are present and correctly named
      const memberWithBranch = {
        ...member,
        branch_id: currentBranch.id,
        // Ensure these fields exist with correct names
        id_type: member.id_type || null,
        id_number: member.id_number || null,
        profile_picture: member.profile_picture || member.avatar || null
      };
      
      const { data, error } = await supabase
        .from('members')
        .insert([memberWithBranch])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating member:', error);
        throw error;
      }
      
      setMembers(prev => [...prev, data as Member]);
      toast.success('Member created successfully');
      return data as Member;
    } catch (err: any) {
      console.error('Error creating member:', err);
      toast.error(err.message || 'Failed to create member');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>): Promise<Member | null> => {
    setIsLoading(true);
    try {
      // Ensure branch_id is not changed
      if (updates.branch_id && updates.branch_id !== currentBranch?.id) {
        delete updates.branch_id;
      }
      
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating member:', error);
        throw error;
      }
      
      setMembers(prev => prev.map(member => member.id === id ? {...member, ...data} : member));
      toast.success('Member updated successfully');
      return data as Member;
    } catch (err: any) {
      console.error('Error updating member:', err);
      toast.error(err.message || 'Failed to update member');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMember = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting member:', error);
        throw error;
      }
      
      setMembers(prev => prev.filter(member => member.id !== id));
      toast.success('Member deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting member:', err);
      toast.error(err.message || 'Failed to delete member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fix window auto-refresh by using an effect cleanup approach
  useEffect(() => {
    let isMounted = true;
    
    if (currentBranch?.id && isMounted) {
      fetchMembers();
    } else {
      // Clear members if no branch selected
      setMembers([]);
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [fetchMembers, currentBranch?.id]);

  return {
    members,
    isLoading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember
  };
};
