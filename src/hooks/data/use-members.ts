
import { useSupabaseQuery } from '../use-supabase-query';
import { Member } from '@/types/member';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useBranch } from '../use-branch';
import { toast } from 'sonner';

interface UseMembersOptions {
  branchScoped?: boolean;
  limit?: number;
  filterActive?: boolean;
  filterExpiring?: boolean;
  searchQuery?: string;
}

export const useMembers = ({
  branchScoped = true,
  limit,
  filterActive = false,
  filterExpiring = false,
  searchQuery = ''
}: UseMembersOptions = {}) => {
  const { currentBranch } = useBranch();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, error, isLoading, refresh } = useSupabaseQuery<Member>({
    table: 'members',
    branchScoped,
    limit,
    filters: (query) => {
      let q = query;
      
      if (filterActive) {
        q = q.eq('status', 'active');
      }
      
      if (filterExpiring) {
        // Members with membership expiring in the next 30 days
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        
        q = q
          .gte('membership_end_date', today.toISOString())
          .lte('membership_end_date', thirtyDaysLater.toISOString());
      }
      
      if (searchQuery) {
        q = q.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      }
      
      return q;
    },
    orderBy: {
      column: 'created_at',
      ascending: false
    }
  });

  const createMember = async (memberData: Partial<Member>): Promise<Member | null> => {
    setIsProcessing(true);
    try {
      if (branchScoped && currentBranch) {
        memberData.branchId = currentBranch.id;
      }

      const { data, error } = await supabase
        .from('members')
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Member created successfully');
      refresh();
      return data;
    } catch (error: any) {
      console.error('Error creating member:', error);
      toast.error(`Failed to create member: ${error.message}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const updateMember = async (id: string, memberData: Partial<Member>): Promise<Member | null> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .update(memberData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Member updated successfully');
      refresh();
      return data;
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast.error(`Failed to update member: ${error.message}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteMember = async (id: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Member deleted successfully');
      refresh();
      return true;
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast.error(`Failed to delete member: ${error.message}`);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    members: data,
    isLoading: isLoading || isProcessing,
    error,
    refresh,
    createMember,
    updateMember,
    deleteMember
  };
};
