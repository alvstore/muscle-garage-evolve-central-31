
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MembershipAssignment } from '@/types/membership-assignment';
import { registerMemberInBiometricDevice } from './biometricService';
import { Member } from '@/types/member';

interface AssignMembershipParams {
  memberId: string;
  membershipId: string;
  startDate: Date;
  endDate: Date;
  amount?: number;
  amountPaid?: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  paymentMethod?: string;
  branchId: string;
  trainerId?: string;
  notes?: string;
}

export const membershipService = {
  /**
   * Gets all membership plans for the current branch
   */
  async getMembershipPlans() {
    try {
      console.log('[DEBUG] Fetching membership plans...');
      // Get current branch from localStorage
      const branchId = localStorage.getItem('currentBranchId');
      console.log('[DEBUG] Current branch ID:', branchId);
      
      if (!branchId) {
        console.error('[ERROR] No branch selected');
        throw new Error('No branch selected');
      }
      
      // First try to query from the memberships table directly
      const { data: membershipsData, error: membershipsError } = await supabase
        .from('memberships')
        .select('*')
        .eq('branch_id', branchId)
        .order('name', { ascending: true });
        
      // If that works, use it
      if (!membershipsError && membershipsData && membershipsData.length > 0) {
        return membershipsData.map(plan => ({
          ...plan,
          // Add default values for any fields that might be missing
          price: plan.price || 0,
          duration_days: plan.duration_days || 30,
          durationDays: plan.duration_days || 30,
          is_active: plan.is_active !== false,
          isActive: plan.is_active !== false,
          features: plan.features || [],
          benefits: plan.benefits || [],
          allowed_classes: plan.allowed_classes || 'all',
          status: plan.status || 'active'
        }));
      }
      
      // Fallback to the membership_plans view
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('branch_id', branchId)
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      // If we have no data, create a default plan
      if (!data || data.length === 0) {
        return [{
          id: 'default-plan',
          name: 'Basic Membership',
          description: 'Monthly membership with access to all facilities',
          price: 1999,
          duration_days: 30,
          durationDays: 30,
          duration_label: '1 Month',
          features: ['Access to gym equipment', 'Locker access', '24/7 facility access'],
          benefits: ['Fitness assessment', 'Personalized workout plan', 'Nutrition guidance'],
          allowed_classes: 'all',
          branch_id: branchId,
          is_active: true,
          isActive: true,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }];
      }
      
      // Transform the data to match the expected format
      return data.map(plan => ({
        ...plan,
        // Add default values for any fields that might be missing
        price: plan.price || 0,
        duration_days: plan.duration_days || 30,
        durationDays: plan.duration_days || 30,
        is_active: plan.is_active !== false,
        isActive: plan.is_active !== false,
        features: plan.features || [],
        benefits: plan.benefits || [],
        allowed_classes: plan.allowed_classes || 'all',
        status: plan.status || 'active'
      }));
    } catch (error: any) {
      console.error('Error fetching membership plans:', error);
      throw new Error(error.message || 'Failed to fetch membership plans');
    }
  },
  
  /**
   * Gets a specific membership plan by ID
   */
  async getMembershipPlanById(planId: string) {
    try {
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (error) throw error;
      
      // Return with default values for any expected fields not in the view
      return {
        ...data,
        price: data.price || 0,
        duration_days: data.duration_days || 30,
        is_active: data.is_active !== false // Default to true if not specified
      };
    } catch (error: any) {
      console.error(`Error fetching membership plan ${planId}:`, error);
      throw new Error(error.message || 'Failed to fetch membership plan');
    }
  },
  
  /**
   * Gets a member's current subscription
   */
  async getMemberSubscription(memberId: string) {
    try {
      const { data, error } = await supabase
        .from('member_memberships')
        .select(`
          *,
          membership:membership_id (
            *,
            membership_plan:membership_plan_id (*)
          )
        `)
        .eq('member_id', memberId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" error
      
      if (!data) return null;
      
      // Transform the data to ensure it has all expected fields
      return {
        ...data,
        // Ensure membership has all required fields with defaults
        membership: data.membership ? {
          ...data.membership,
          price: data.membership.price || 0,
          duration_days: data.membership.duration_days || 30,
          is_active: data.membership.is_active !== false
        } : null
      };
    } catch (error: any) {
      console.error(`Error fetching subscription for member ${memberId}:`, error);
      throw new Error(error.message || 'Failed to fetch member subscription');
    }
  },
  
  /**
   * Creates a new subscription for a member
   */
  async createSubscription(memberId: string, planId: string) {
    // Implementation will depend on your business logic
    throw new Error('Not implemented');
  },
  
  /**
   * Cancels a subscription
   */
  async cancelSubscription(subscriptionId: string, reason?: string) {
    // Implementation will depend on your business logic
    throw new Error('Not implemented');
  },
  
  /**
   * Gets a payment link for a subscription
   */
  async getPaymentLink(planId: string, memberId: string, promoCode?: string) {
    // Implementation will depend on your payment gateway
    throw new Error('Not implemented');
  },
  
  /**
   * Verifies a payment
   */
  async verifyPayment(paymentId: string, orderId: string, signature: string, subscriptionData: any) {
    // Implementation will depend on your payment gateway
    throw new Error('Not implemented');
  },
  /**
   * Assigns a membership to a member and handles all related operations:
   * - Creates membership assignment
   * - Updates member record
   * - Generates invoice
   * - Creates income record if payment is made
   * - Registers member in biometric devices if enabled
   */
  async assignMembership(params: AssignMembershipParams): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    invoiceId?: string;
    biometricRegistration?: {
      success: boolean;
      message: string;
    };
  }> {
    try {
      const {
        memberId,
        membershipId,
        startDate,
        endDate,
        amount,
        amountPaid = 0,
        paymentStatus,
        paymentMethod,
        branchId,
        trainerId,
        notes
      } = params;

      // Get user info for recording transactions
      const { data: { user } } = await supabase.auth.getUser();

      // Verify that the member exists before proceeding
      const { data: memberExists, error: memberCheckError } = await supabase
        .from('members')
        .select('id')
        .eq('id', memberId)
        .single();

      if (memberCheckError || !memberExists) {
        throw new Error(`Member with ID ${memberId} does not exist. Please ensure the member is created first.`);
      }

      // Get membership details
      const { data: membershipData, error: membershipError } = await supabase
        .from('memberships')
        .select('name, price, duration_days')
        .eq('id', membershipId)
        .single();

      if (membershipError) throw new Error(`Failed to fetch membership: ${membershipError.message}`);
      
      // Calculate actual amount if not provided
      const totalAmount = amount || membershipData.price;
      
      // 1. Create membership assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from('member_memberships')
        .insert({
          member_id: memberId,
          membership_id: membershipId,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          total_amount: totalAmount,
          amount_paid: amountPaid,
          payment_status: paymentStatus,
          branch_id: branchId,
          trainer_id: trainerId
        })
        .select()
        .single();

      if (assignmentError) throw new Error(`Failed to create membership assignment: ${assignmentError.message}`);

      // 2. Update member's membership status
      const { error: memberUpdateError } = await supabase
        .from('members')
        .update({
          membership_id: membershipId,
          membership_status: 'active',
          membership_start_date: startDate.toISOString(),
          membership_end_date: endDate.toISOString(),
          trainer_id: trainerId || null
        })
        .eq('id', memberId);

      if (memberUpdateError) throw new Error(`Failed to update member: ${memberUpdateError.message}`);
      
      // Get member details for invoice and biometric registration
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('name, phone, email')
        .eq('id', memberId)
        .single();
        
      if (memberError) throw new Error(`Failed to fetch member: ${memberError.message}`);

      // 3. Create invoice
      const invoiceItems = [{
        id: `item-${Date.now()}`,
        name: membershipData.name,
        description: `Membership from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
        quantity: 1,
        price: totalAmount
      }];

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          member_id: memberId,
          membership_plan_id: membershipId,
          amount: totalAmount,
          status: paymentStatus === 'paid' ? 'paid' : paymentStatus === 'partial' ? 'partially_paid' : 'pending',
          issued_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 7 days
          paid_date: paymentStatus === 'paid' ? new Date().toISOString() : null,
          items: invoiceItems,
          branch_id: branchId,
          created_by: user?.id,
          description: `Membership: ${membershipData.name}`,
          payment_method: paymentStatus === 'paid' || paymentStatus === 'partial' ? paymentMethod : null,
          notes
        })
        .select()
        .single();

      if (invoiceError) throw new Error(`Failed to create invoice: ${invoiceError.message}`);

      // 4. If payment is made (full or partial), create income record
      if ((paymentStatus === 'paid' || paymentStatus === 'partial') && amountPaid > 0) {
        const { error: incomeError } = await supabase
          .from('income_records')
          .insert({
            source: memberData.name,
            description: `Payment for ${membershipData.name} membership`,
            category: 'Membership',
            amount: amountPaid,
            payment_method: paymentMethod,
            reference: invoice.id,
            branch_id: branchId,
            date: new Date().toISOString()
          });

        if (incomeError) throw new Error(`Failed to record income: ${incomeError.message}`);

        // Also create a payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            member_id: memberId,
            membership_id: membershipId,
            amount: amountPaid,
            payment_date: new Date().toISOString(),
            branch_id: branchId,
            staff_id: user?.id,
            status: 'completed',
            payment_method: paymentMethod,
            notes: `Payment for ${membershipData.name} membership`,
            invoice_id: invoice.id
          });

        if (paymentError) throw new Error(`Failed to record payment: ${paymentError.message}`);
        
        // Create transaction for reporting
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            type: 'income',
            amount: amountPaid,
            transaction_date: new Date().toISOString(),
            description: `Payment received for ${membershipData.name} membership (${memberData.name})`,
            reference_id: invoice.id,
            branch_id: branchId,
            recorded_by: user?.id,
            payment_method: paymentMethod,
          });

        if (transactionError) console.error('Error recording transaction:', transactionError);
      }

      // 5. Register member in biometric devices if enabled for the branch
      const biometricResult = await this.registerInBiometricDevices(
        { id: memberId, name: memberData.name, phone: memberData.phone || '' },
        branchId
      );

      if (!biometricResult.success) {
        console.warn('Biometric device registration warning:', biometricResult.message);
        // Don't fail the membership assignment, just log the warning
      }

      return { 
        success: true, 
        data: assignment,
        invoiceId: invoice.id,
        biometricRegistration: biometricResult
      };
    } catch (error: any) {
      console.error('Error assigning membership:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to assign membership' 
      };
    }
  },

  /**
   * Registers a member in biometric devices if available for the branch
   */
  async registerInBiometricDevices(member: Member, branchId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // First check if any biometric settings are enabled for this branch
      const { data: hikvisionSettings } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .maybeSingle();

      const { data: esslSettings } = await supabase
        .from('essl_device_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .maybeSingle();

      let registrationResult = { success: false, message: 'No biometric devices configured' };

      if (hikvisionSettings) {
        // Register in Hikvision device
        registrationResult = await registerMemberInBiometricDevice({
          memberId: member.id,
          name: member.name,
          phone: member.phone || '',
          branchId,
          deviceType: 'hikvision'
        });
      } else if (esslSettings) {
        // Register in ESSL device
        registrationResult = await registerMemberInBiometricDevice({
          memberId: member.id,
          name: member.name,
          phone: member.phone || '',
          branchId,
          deviceType: 'essl'
        });
      }

      return registrationResult;
    } catch (error: any) {
      console.error('Error registering in biometric devices:', error);
      return {
        success: false,
        message: `Error registering in biometric devices: ${error.message}`
      };
    }
  },
  
  /**
   * Calculates end date based on start date and membership duration
   */
  calculateEndDate(startDate: Date, durationDays: number): Date {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    return endDate;
  },
  
  /**
   * Gets active memberships for a member
   */
  async getMemberActiveMemberships(memberId: string): Promise<any[]> {
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
          trainer_id,
          memberships (name, price, duration_days)
        `)
        .eq('member_id', memberId)
        .eq('status', 'active')
        .order('end_date', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching member active memberships:', error);
      return [];
    }
  },
  
  /**
   * Gets invoice history for a member
   */
  async getMemberInvoiceHistory(memberId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          amount,
          status,
          issued_date,
          due_date,
          paid_date,
          payment_method,
          items,
          description
        `)
        .eq('member_id', memberId)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching member invoice history:', error);
      return [];
    }
  },

  /**
   * Gets attendance settings for a branch
   */
  async getAttendanceSettings(branchId: string) {
    try {
      const { data, error } = await supabase
        .from('attendance_settings')
        .select('*')
        .eq('branch_id', branchId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching attendance settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAttendanceSettings:', error);
      return null;
    }
  }
};
