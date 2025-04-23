
import { supabase } from '@/services/supabaseClient';
import { MembershipPlan } from '@/types/membership';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/use-branch';

export const membershipService = {
  // Fetch membership plans with branch filtering
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    try {
      const { currentBranch } = useBranch();
      
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('branch_id', currentBranch?.id || null)
        .eq('is_active', true);

      if (error) throw error;

      return (data || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        durationDays: plan.duration_days,
        durationLabel: getDurationLabel(plan.duration_days),
        benefits: plan.features ? JSON.parse(plan.features) : [],
        allowedClasses: 'all', // Default, update based on your actual data
        status: plan.is_active ? 'active' : 'inactive',
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
      }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch membership plans');
      return [];
    }
  },

  // Create a new membership plan
  async createMembershipPlan(plan: Partial<MembershipPlan>): Promise<MembershipPlan | null> {
    try {
      const { currentBranch } = useBranch();
      
      const { data, error } = await supabase
        .from('memberships')
        .insert({
          name: plan.name,
          description: plan.description || '',
          price: plan.price,
          duration_days: plan.durationDays,
          features: JSON.stringify(plan.benefits || []),
          is_active: plan.status === 'active',
          branch_id: currentBranch?.id || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Membership plan created successfully');
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: data.price,
        durationDays: data.duration_days,
        durationLabel: getDurationLabel(data.duration_days),
        benefits: data.features ? JSON.parse(data.features) : [],
        allowedClasses: 'all', // Default, update based on your actual data
        status: data.is_active ? 'active' : 'inactive',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create membership plan');
      return null;
    }
  },

  // Update existing membership plan
  async updateMembershipPlan(plan: MembershipPlan): Promise<MembershipPlan | null> {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .update({
          name: plan.name,
          description: plan.description || '',
          price: plan.price,
          duration_days: plan.durationDays,
          features: JSON.stringify(plan.benefits || []),
          is_active: plan.status === 'active',
        })
        .eq('id', plan.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Membership plan updated successfully');
      
      return {
        ...plan,
        updatedAt: data.updated_at,
      };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update membership plan');
      return null;
    }
  },

  // Delete membership plan
  async deleteMembershipPlan(planId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast.success('Membership plan deleted successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete membership plan');
      return false;
    }
  },
};

// Helper function to convert duration to label
function getDurationLabel(days: number): MembershipDuration {
  switch (days) {
    case 30: return '1-month';
    case 90: return '3-month';
    case 180: return '6-month';
    case 365: return '12-month';
    default: return '1-month';
  }
}

