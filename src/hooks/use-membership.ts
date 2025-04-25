
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  features?: string[];
  isActive?: boolean;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useMembershipPlans = () => {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchMembershipPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!currentBranch?.id) {
        setMembershipPlans([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('memberships')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (fetchError) throw fetchError;
      
      // Format the data for the frontend
      const formattedPlans: MembershipPlan[] = data?.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        durationDays: plan.duration_days,
        features: plan.features?.features || [],
        isActive: plan.is_active,
        branchId: plan.branch_id,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at
      })) || [];
      
      setMembershipPlans(formattedPlans);
    } catch (err) {
      console.error('Error fetching membership plans:', err);
      setError('Failed to load membership plans');
      toast.error('Failed to load membership plans');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!currentBranch?.id) {
      setMembershipPlans([]);
      setIsLoading(false);
      return;
    }
    
    fetchMembershipPlans();
    
    // Set up real-time subscription for memberships table
    const channel = supabase
      .channel('membership_plans_realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'memberships',
          filter: `branch_id=eq.${currentBranch.id}`
        }, 
        (payload) => {
          console.log('Membership plans data changed:', payload);
          fetchMembershipPlans();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch]);

  return {
    membershipPlans,
    isLoading,
    error,
    refetch: fetchMembershipPlans
  };
};
