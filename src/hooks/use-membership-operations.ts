
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Membership } from '@/types';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export const useMembershipOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();
  
  const fetchMembershipPlans = async (branchId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = branchId || currentBranch?.id;
      
      let query = supabase
        .from('memberships')
        .select('*');
      
      if (targetBranchId) {
        // Either no branch ID (global) or matches the target branch
        query = query.or(`branch_id.is.null,branch_id.eq.${targetBranchId}`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      setError(err);
      console.error('Error fetching membership plans:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const createMembershipPlan = async (membershipData: Omit<Membership, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = membershipData.branch_id || currentBranch?.id;
      
      // Remove unnecessary fields if present
      const { data, error } = await supabase
        .from('memberships')
        .insert([{
          ...membershipData,
          branch_id: targetBranchId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Membership plan created successfully');
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error creating membership plan:', err);
      toast.error(`Failed to create membership plan: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateMembershipPlan = async (id: string, updates: Partial<Membership>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('memberships')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Membership plan updated successfully');
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error updating membership plan:', err);
      toast.error(`Failed to update membership plan: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteMembershipPlan = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Membership plan deleted successfully');
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error deleting membership plan:', err);
      toast.error(`Failed to delete membership plan: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMembershipStatus = async (id: string, status: boolean) => {
    return updateMembershipPlan(id, { is_active: status });
  };

  return {
    fetchMembershipPlans,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan,
    toggleMembershipStatus,
    isLoading,
    error,
  };
};
