
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
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
  const { data: members, isLoading, error, refreshData, addItem, updateItem, deleteItem } = useSupabaseQuery<Member>({
    tableName: 'members',
    filterBranch: true,
    subscribeToChanges: true,
    branchId: currentBranch?.id
  });

  const refetch = () => {
    refreshData();
  };

  return {
    members,
    isLoading,
    error,
    refetch,
    addMember: addItem,
    updateMember: updateItem,
    deleteMember: deleteItem
  };
};
