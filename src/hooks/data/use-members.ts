
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '../use-branch';
import { useSupabaseQuery } from '../use-supabase-query';
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
  
  // Use custom query with proper typings
  const queryResult = useSupabaseQuery<Member>({
    tableName: 'members',
    select: '*',
    orderBy: { column: 'name', ascending: true },
    filters: currentBranch?.id ? [{ column: 'branch_id', operator: 'eq', value: currentBranch.id }] : [],
    enabled: !!currentBranch?.id
  });
  
  // Extract properties with the correct names to match expected interface
  const { 
    data: members, 
    isLoading, 
    error, 
    refetch 
  } = queryResult;

  // Define missing methods to match the expected return type
  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
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
      refetch();
      return data?.[0] as Member;
    } catch (err: any) {
      console.error('Error adding member:', err);
      toast.error(err.message || 'Failed to add member');
      return null;
    }
  };
  
  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      toast.success('Member updated successfully');
      refetch();
      return data?.[0] as Member;
    } catch (err: any) {
      console.error('Error updating member:', err);
      toast.error(err.message || 'Failed to update member');
      return null;
    }
  };
  
  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Member deleted successfully');
      refetch();
      return true;
    } catch (err: any) {
      console.error('Error deleting member:', err);
      toast.error(err.message || 'Failed to delete member');
      return false;
    }
  };

  return {
    members,
    isLoading,
    error,
    refetch,
    addMember,
    updateMember,
    deleteMember
  };
};
