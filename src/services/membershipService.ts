
import { supabase } from '@/services/supabaseClient';
import { MembershipPlan, MembershipSubscription, MembershipDuration } from '@/types/membership';
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

  // Get a single membership plan by ID
  async getMembershipPlanById(planId: string): Promise<MembershipPlan | null> {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      if (!data) return null;

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
      toast.error(error.message || 'Failed to fetch membership plan');
      return null;
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

  // Get member subscription
  async getMemberSubscription(memberId: string): Promise<MembershipSubscription | null> {
    try {
      // Fetch the most recent active subscription for the member
      const { data, error } = await supabase
        .from('member_memberships')
        .select(`
          *,
          memberships:membership_id (*)
        `)
        .eq('member_id', memberId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No subscription found
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        memberId: data.member_id,
        planId: data.membership_id,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status,
        autoRenew: false, // Default value, update if your schema has this field
        paymentStatus: data.payment_status,
        invoiceId: data.id, // Using subscription ID as invoice ID for now
      };
    } catch (error: any) {
      console.error('Failed to fetch member subscription:', error);
      return null;
    }
  },

  // Create a new subscription
  async createSubscription(memberId: string, planId: string): Promise<MembershipSubscription | null> {
    try {
      // Get the membership plan to calculate end date
      const plan = await this.getMembershipPlanById(planId);
      if (!plan) throw new Error('Membership plan not found');

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.durationDays);

      const { currentBranch } = useBranch();
      
      const { data, error } = await supabase
        .from('member_memberships')
        .insert({
          member_id: memberId,
          membership_id: planId,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          payment_status: 'pending',
          total_amount: plan.price,
          branch_id: currentBranch?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Membership subscription created successfully');

      return {
        id: data.id,
        memberId: data.member_id,
        planId: data.membership_id,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status,
        autoRenew: false,
        paymentStatus: data.payment_status,
        invoiceId: data.id,
      };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create subscription');
      return null;
    }
  },

  // Cancel a subscription
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('member_memberships')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      toast.success('Subscription cancelled successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel subscription');
      return false;
    }
  },

  // Generate payment link
  async getPaymentLink(planId: string, memberId: string, promoCode?: string): Promise<string | null> {
    try {
      // In a real implementation, this would call an API to create a payment link
      // For now, we'll simulate it by returning a mock payment link
      const plan = await this.getMembershipPlanById(planId);
      if (!plan) throw new Error('Plan not found');
      
      // This is just a placeholder. In production, you would integrate with
      // your payment processor to generate a real payment link
      return `https://example.com/pay/${planId}/${memberId}`;
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate payment link');
      return null;
    }
  },

  // Verify payment
  async verifyPayment(
    paymentId: string, 
    orderId: string, 
    signature: string,
    subscriptionData: any
  ): Promise<boolean> {
    try {
      // In a real implementation, this would call an API to verify the payment
      // For now, we'll simulate successful payment verification
      
      // Update the subscription payment status to 'paid'
      const { error } = await supabase
        .from('member_memberships')
        .update({
          payment_status: 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionData.planId);

      if (error) throw error;

      toast.success('Payment verified successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify payment');
      return false;
    }
  }
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
