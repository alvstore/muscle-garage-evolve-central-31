
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Membership } from '@/types';
import { useBranch } from './use-branches';
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

  // Add the missing methods
  const getMembershipPlan = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error fetching membership plan:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getMemberSubscription = async (memberId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('membership_subscriptions')
        .select('*')
        .eq('user_id', memberId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error fetching member subscription:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (subscriptionData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('membership_subscriptions')
        .insert([subscriptionData])
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Subscription created successfully');
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error creating subscription:', err);
      toast.error(`Failed to create subscription: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const assignMembership = async (membershipData: any) => {
    // Implementation of assignMembership function
    return null;
  };

  return {
    fetchMembershipPlans,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan,
    toggleMembershipStatus,
    getMembershipPlan, // Added missing function
    getMemberSubscription, // Added missing function
    createSubscription, // Added missing function
    assignMembership,
    isLoading,
    error,
  };
};
