import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MembershipPlan, Membership } from '@/types/membership';
import { toast } from 'sonner';
import { useBranch } from './use-branch';

export const useMembershipOperations = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('branch_id', currentBranch?.id || '')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPlans(formatPlans(data));
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      toast.error('Failed to fetch membership plans');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const fetchMemberships = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('branch_id', currentBranch?.id || '')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMemberships(data.map(formatMembership));
    } catch (error) {
      console.error('Error fetching memberships:', error);
      toast.error('Failed to fetch memberships');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const createPlan = async (plan: Omit<MembershipPlan, 'id'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('membership_plans')
        .insert([
          {
            ...plan,
            branch_id: currentBranch?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setPlans([formatPlans([data])[0], ...plans]);
      toast.success('Membership plan created successfully');
      return data;
    } catch (error) {
      console.error('Error creating membership plan:', error);
      toast.error('Failed to create membership plan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlan = async (id: string, updates: Partial<MembershipPlan>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('membership_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPlans(plans.map(p => p.id === id ? formatPlans([data])[0] : p));
      toast.success('Membership plan updated successfully');
    } catch (error) {
      console.error('Error updating membership plan:', error);
      toast.error('Failed to update membership plan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlan = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('membership_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPlans(plans.filter(p => p.id !== id));
      toast.success('Membership plan deleted successfully');
    } catch (error) {
      console.error('Error deleting membership plan:', error);
      toast.error('Failed to delete membership plan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const formatPlans = (plans: any[]): MembershipPlan[] => {
    return plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      duration_days: plan.duration_days,
      description: plan.description,
      features: plan.features || [],
      is_active: plan.is_active !== false,
      branch_id: plan.branch_id,
      created_at: plan.created_at,
      updated_at: plan.updated_at
    }));
  };

  const formatMembership = (membership: any): Membership => {
    return {
      id: membership.id,
      name: membership.name,
      price: membership.price,
      duration_days: membership.duration_days,
      description: membership.description,
      features: membership.features || [],
      is_active: membership.is_active !== false,
      status: membership.status || 'active',
      branch_id: membership.branch_id,
      created_at: membership.created_at,
      updated_at: membership.updated_at
    };
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchPlans();
      fetchMemberships();
    }
  }, [currentBranch?.id, fetchPlans, fetchMemberships]);

  return {
    plans,
    memberships,
    isLoading,
    fetchPlans,
    fetchMemberships,
    createPlan,
    updatePlan,
    deletePlan
  };
};
