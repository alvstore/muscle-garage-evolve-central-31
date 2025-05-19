
import { supabase } from '@/integrations/supabase/client';
import { MembershipPlan } from '@/types/members/membership';
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
      // Validate required fields
      if (!plan.name || !plan.price || !(plan.duration_days || plan.durationDays)) {
        console.error('Missing required fields for membership plan');
        toast.error('Missing required fields for membership plan');
        return null;
      }

      // Ensure numeric fields are numbers
      const price = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
      const duration = typeof plan.duration_days === 'string' 
        ? parseInt(plan.duration_days) 
        : (plan.duration_days || plan.durationDays);

      // Prepare the data for insertion
      const membershipData = {
        name: plan.name,
        description: plan.description || '',
        price: price,
        duration_days: duration,
        features: Array.isArray(plan.features) ? plan.features : [],
        is_active: plan.is_active !== undefined ? plan.is_active : (plan.isActive !== undefined ? plan.isActive : true),
        status: plan.status || 'active',
        branch_id: plan.branch_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert the membership plan
      const { data, error } = await supabase
        .from('memberships')
        .insert([membershipData])
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
      // Validate that we have an ID
      if (!id) {
        console.error('Missing membership plan ID for update');
        toast.error('Missing membership plan ID');
        return null;
      }

      // Prepare the update data, only including fields that are provided
      const updateData: Record<string, any> = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description || '';
      
      // Handle numeric fields
      if (updates.price !== undefined) {
        updateData.price = typeof updates.price === 'string' ? parseFloat(updates.price) : updates.price;
      }
      
      if (updates.duration_days !== undefined || updates.durationDays !== undefined) {
        const duration = updates.duration_days || updates.durationDays;
        updateData.duration_days = typeof duration === 'string' ? parseInt(duration as string) : duration;
      }
      
      if (updates.features !== undefined) {
        updateData.features = Array.isArray(updates.features) ? updates.features : [];
      }
      
      if (updates.is_active !== undefined || updates.isActive !== undefined) {
        updateData.is_active = updates.is_active !== undefined ? updates.is_active : updates.isActive;
      }
      
      if (updates.status !== undefined) updateData.status = updates.status;
      
      // Always update the updated_at timestamp
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('memberships')
        .update(updateData)
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
  },

  // Add missing methods needed by components
  calculateEndDate: (startDate: Date, durationDays: number): Date => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    return endDate;
  },

  /**
   * Assign a membership to a member with payment details
   * @param params Membership and payment details
   * @returns Result with success status and IDs of created records
   */
  assignMembership: async (membershipData: any): Promise<{success: boolean; membership_id?: string; invoice_id?: string; transaction_id?: string; reference_number?: string; error?: string}> => {
    const client = supabase;
    
    try {
      // Validate required fields
      if (!membershipData.member_id || !membershipData.membership_plan_id || 
          !membershipData.branch_id || !membershipData.end_date) {
        return {
          success: false,
          error: 'Missing required fields: member_id, membership_plan_id, branch_id, and end_date are required'
        };
      }

      // Prepare payment details
      const payment = membershipData.payment || {};
      const startDate = membershipData.start_date ? new Date(membershipData.start_date) : new Date();
      const endDate = new Date(membershipData.end_date);
      const totalAmount = membershipData.total_amount || payment.amount || 0;
      const paymentMethod = payment.method || 'cash';
      const paymentStatus = payment.status || 'paid';
      const transactionId = payment.transaction_id || null;
      const referenceNumber = payment.reference_number || 
        `MEM${new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14)}${Math.random().toString(36).substring(2, 8)}`;
      const notes = payment.notes || membershipData.notes || null;
      
      // Start a transaction using multiple queries
      
      // 1. Get membership plan details
      const { data: membershipPlan, error: planError } = await client
        .from('memberships')
        .select('name')
        .eq('id', membershipData.membership_plan_id)
        .single();
        
      if (planError) {
        console.error('Error fetching membership plan:', planError);
        return { success: false, error: 'Membership plan not found' };
      }
      
      // 2. Deactivate any existing active memberships
      const { error: deactivateError } = await client
        .from('member_memberships')
        .update({ 
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('member_id', membershipData.member_id)
        .eq('status', 'active');
        
      if (deactivateError) {
        console.error('Error deactivating existing memberships:', deactivateError);
        // Continue anyway - this might be a first membership
      }
      
      // 3. Create new membership
      const { data: newMembership, error: membershipError } = await client
        .from('member_memberships')
        .insert({
          member_id: membershipData.member_id,
          membership_plan_id: membershipData.membership_plan_id,
          branch_id: membershipData.branch_id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          total_amount: totalAmount,
          amount_paid: paymentStatus === 'paid' ? totalAmount : 0,
          payment_status: paymentStatus,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          reference_number: referenceNumber,
          notes: notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (membershipError) {
        console.error('Error creating membership:', membershipError);
        return { success: false, error: membershipError.message };
      }
      
      // 4. Create invoice
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      
      const { data: newInvoice, error: invoiceError } = await client
        .from('invoices')
        .insert({
          member_id: membershipData.member_id,
          membership_plan_id: membershipData.membership_plan_id,
          branch_id: membershipData.branch_id,
          amount: totalAmount,
          status: paymentStatus,
          payment_method: paymentMethod,
          payment_date: paymentStatus === 'paid' ? new Date().toISOString() : null,
          due_date: dueDate.toISOString(),
          description: `Membership: ${membershipPlan.name}`,
          notes: notes,
          reference_number: referenceNumber,
          items: JSON.stringify([{
            description: `Membership: ${membershipPlan.name}`,
            amount: totalAmount,
            quantity: 1,
            total: totalAmount
          }]),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (invoiceError) {
        console.error('Error creating invoice:', invoiceError);
        // Continue anyway - invoice is secondary
      }
      
      // 5. Create transaction record
      const { data: newTransaction, error: transactionError } = await client
        .from('transactions')
        .insert({
          type: 'income',
          amount: totalAmount,
          transaction_date: new Date().toISOString(),
          category: 'Membership',
          description: `Membership Payment: ${membershipPlan.name}`,
          reference_id: newInvoice?.id || null,
          payment_method: paymentMethod,
          branch_id: membershipData.branch_id,
          status: paymentStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        // Continue anyway - transaction is secondary
      }
      
      // 6. Update member's membership info
      const { error: memberUpdateError } = await client
        .from('members')
        .update({
          membership_id: membershipData.membership_plan_id,
          membership_status: 'active',
          membership_start_date: startDate.toISOString().split('T')[0],
          membership_end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', membershipData.member_id);
        
      if (memberUpdateError) {
        console.error('Error updating member:', memberUpdateError);
        return { success: false, error: memberUpdateError.message };
      }
      
      // Return success with IDs
      return { 
        success: true, 
        membership_id: newMembership?.id,
        invoice_id: newInvoice?.id,
        transaction_id: newTransaction?.id,
        reference_number: referenceNumber
      };
    } catch (err) {
      console.error('Error in membership assignment process:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error occurred' 
      };
    }
  },

  /**
   * Get active memberships for a member
   * @param memberId - The member ID to fetch memberships for
   * @returns Promise with array of membership data
   */
  getMemberActiveMemberships: async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('member_memberships')
        .select(`
          id,
          membership_id,
          start_date,
          end_date,
          total_amount,
          amount_paid,
          payment_status,
          memberships:membership_id(name, price, duration_days)
        `)
        .eq('member_id', memberId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching member memberships:', error);
        throw error;
      }

      // Update the member's profile with the membership information
      if (data && data.length > 0) {
        const latestMembership = data[0];
        const { error: updateError } = await supabase
          .from('members')
          .update({
            membership_id: latestMembership.membership_id,
            membership_status: 'active',
            membership_start_date: latestMembership.start_date,
            membership_end_date: latestMembership.end_date,
            membership_name: latestMembership.memberships?.name
          })
          .eq('id', memberId);

        if (updateError) {
          console.error('Error updating member profile with membership info:', updateError);
          // Continue despite error
        }
      }

      return data || [];
    } catch (err) {
      console.error('Error in getMemberActiveMemberships:', err);
      return [];
    }
  },

  /**
   * Get invoice history for a member
   * @param memberId - The member ID to fetch invoices for
   * @returns Promise with array of invoice data
   */
  getMemberInvoiceHistory: async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching member invoices:', error);
        throw error;
      }

      return data || [];
    } catch (err) {
      console.error('Error in getMemberInvoiceHistory:', err);
      return [];
    }
  }
};
