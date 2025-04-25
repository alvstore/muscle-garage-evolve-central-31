
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  user_id?: string;
  branch_id?: string;
  membership_status?: string;
  status?: string;
  trainer_id?: string;
  membership_id?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  gender?: string;
  date_of_birth?: string;
  blood_group?: string;
  occupation?: string;
  goal?: string;
  created_at: string;
  updated_at: string;
}

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase.from('members').select('*');
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMembers(data as Member[]);
      }
    } catch (err: any) {
      console.error('Error fetching members:', err);
      setError(err);
      toast.error('Failed to fetch members');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const createMember = async (member: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      
      const newMember = {
        ...member,
        branch_id: member.branch_id || currentBranch?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('members')
        .insert(newMember)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMembers(prevMembers => [data as Member, ...prevMembers]);
        toast.success('Member created successfully');
        return data as Member;
      }
    } catch (err: any) {
      console.error('Error creating member:', err);
      toast.error('Failed to create member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      setIsLoading(true);
      
      const updatedMember = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('members')
        .update(updatedMember)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMembers(prevMembers => 
          prevMembers.map(member => 
            member.id === id ? data as Member : member
          )
        );
        toast.success('Member updated successfully');
        return data as Member;
      }
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
      
      if (error) {
        throw error;
      }
      
      setMembers(prevMembers => 
        prevMembers.filter(member => member.id !== id)
      );
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
  }, [fetchMembers]);

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
