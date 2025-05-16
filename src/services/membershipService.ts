
import { supabase } from '@/integrations/supabase/client';
import { MembershipPlan } from '@/types';
import { toast } from 'sonner';

export const membershipService = {
  getMembershipPlans: async (branchId?: string): Promise<MembershipPlan[]> => {
    try {
      let query = supabase
        .from('memberships')
        .select('*')
        .eq('is_active', true)
        .order('price');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching membership plans:', error);
        throw error;
      }
      
      const membershipPlans: MembershipPlan[] = data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        duration_days: plan.duration_days,
        durationDays: plan.duration_days, // For backward compatibility
        features: plan.features || [],
        benefits: [],
        is_active: plan.is_active,
        isActive: plan.is_active, // For backward compatibility
        status: plan.status || 'active'
      }));
      
      return membershipPlans;
    } catch (err) {
      console.error('Membership service error:', err);
      toast.error('Failed to load membership plans');
      return [];
    }
  },
  
  getMembershipPlan: async (id: string): Promise<MembershipPlan | null> => {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching membership plan:', error);
        throw error;
      }
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: data.price,
        duration_days: data.duration_days,
        durationDays: data.duration_days, // For backward compatibility
        features: data.features || [],
        benefits: [],
        is_active: data.is_active,
        isActive: data.is_active, // For backward compatibility
        status: data.status || 'active'
      };
    } catch (err) {
      console.error('Membership service error:', err);
      toast.error('Failed to load membership plan details');
      return null;
    }
  },
  
  createMembershipPlan: async (plan: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan | null> => {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .insert([{
          name: plan.name,
          description: plan.description,
          price: plan.price,
          duration_days: plan.duration_days || plan.durationDays,
          features: plan.features || [],
          is_active: plan.is_active !== undefined ? plan.is_active : (plan.isActive !== undefined ? plan.isActive : true),
          status: plan.status || 'active'
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating membership plan:', error);
        throw error;
      }
      
      toast.success('Membership plan created successfully');
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: data.price,
        duration_days: data.duration_days,
        durationDays: data.duration_days, // For backward compatibility
        features: data.features || [],
        benefits: [],
        is_active: data.is_active,
        isActive: data.is_active, // For backward compatibility
        status: data.status || 'active'
      };
    } catch (err) {
      console.error('Membership service error:', err);
      toast.error('Failed to create membership plan');
      return null;
    }
  },
  
  updateMembershipPlan: async (id: string, updates: Partial<MembershipPlan>): Promise<MembershipPlan | null> => {
    try {
      const updateObject: any = {};
      
      if (updates.name !== undefined) updateObject.name = updates.name;
      if (updates.description !== undefined) updateObject.description = updates.description;
      if (updates.price !== undefined) updateObject.price = updates.price;
      if (updates.duration_days !== undefined) updateObject.duration_days = updates.duration_days;
      else if (updates.durationDays !== undefined) updateObject.duration_days = updates.durationDays;
      if (updates.features !== undefined) updateObject.features = updates.features;
      if (updates.is_active !== undefined) updateObject.is_active = updates.is_active;
      else if (updates.isActive !== undefined) updateObject.is_active = updates.isActive;
      if (updates.status !== undefined) updateObject.status = updates.status;
      
      const { data, error } = await supabase
        .from('memberships')
        .update(updateObject)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating membership plan:', error);
        throw error;
      }
      
      toast.success('Membership plan updated successfully');
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: data.price,
        duration_days: data.duration_days,
        durationDays: data.duration_days, // For backward compatibility
        features: data.features || [],
        benefits: [],
        is_active: data.is_active,
        isActive: data.is_active, // For backward compatibility
        status: data.status || 'active'
      };
    } catch (err) {
      console.error('Membership service error:', err);
      toast.error('Failed to update membership plan');
      return null;
    }
  },
  
  deleteMembershipPlan: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting membership plan:', error);
        throw error;
      }
      
      toast.success('Membership plan deleted successfully');
      return true;
    } catch (err) {
      console.error('Membership service error:', err);
      toast.error('Failed to delete membership plan');
      return false;
    }
  }
};
