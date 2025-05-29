import { supabase } from '@/integrations/supabase/client';
import { MembershipPlan } from '@/types/members/membership';
import { toast } from 'sonner';

// Helper function to send notifications
const sendNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  type: 'success' | 'error' | 'info' | 'warning' = 'info'
) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        is_read: false,
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in sendNotification:', error);
    return false;
  }
};

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'upi' | 'other';

export interface PaymentDetails {
  amount: number;
  method: PaymentMethod;
  transaction_id?: string;
  reference_number?: string;
  paid_at?: string;
  notes?: string;
}

export interface MembershipAssignmentResult {
  success: boolean;
  membership_id?: string;
  invoice_id?: string;
  transaction_id?: string;
  message?: string;
  error?: string;
}

interface MembershipData {
  id: string;
  membership_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  amount_paid: number;
  payment_status: string;
  memberships: {
    name: string;
    price: number;
    duration_days: number;
  };
}

interface Invoice {
  id: string;
  amount: number;
  status: string;
  issued_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  description?: string;
}

export const membershipService = {
  // ... (keep existing methods unchanged until assignMembership)

  /**
   * Assign a membership to a member with payment details
   * @param memberId ID of the member
   * @param membershipId ID of the membership plan
   * @param payment Payment details
   * @param options Additional options (startDate, endDate, notes, etc.)
   * @returns MembershipAssignmentResult with status and created record IDs
   */
  assignMembership: async (
    memberId: string,
    membershipId: string,
    payment: PaymentDetails,
    options: {
      branchId?: string;
      startDate?: Date;
      endDate?: Date;
      notes?: string;
      staffId?: string;
    } = {}
  ): Promise<MembershipAssignmentResult> => {
    const client = supabase;
    const staffId = options.staffId || memberId; // Fallback to memberId if staffId not provided
    
    try {
      // 1. Validate input
      if (!memberId || !membershipId) {
        throw new Error('Member ID and Membership ID are required');
      }

      // 2. Get membership plan details
      const { data: membershipPlan, error: planError } = await client
        .from('memberships')
        .select('*')
        .eq('id', membershipId)
        .single();

      if (planError || !membershipPlan) {
        throw new Error('Invalid membership plan');
      }

      // 3. Prepare dates
      const startDate = options.startDate || new Date();
      const endDate = options.endDate || membershipService.calculateEndDate(
        startDate,
        membershipPlan.duration_days || 30
      );

      // 4. Calculate payment status
      const totalAmount = membershipPlan.price;
      const paymentStatus = payment.amount >= totalAmount ? 'paid' : 
                          payment.amount > 0 ? 'partial' : 'pending';

      // 5. Create membership record
      const { data: membership, error: membershipError } = await client
        .from('member_memberships')
        .insert({
          member_id: memberId,
          membership_id: membershipId,
          branch_id: options.branchId || null,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          total_amount: totalAmount,
          amount_paid: payment.amount,
          payment_status: paymentStatus,
          notes: options.notes
        })
        .select()
        .single();
      
      if (membershipError) throw membershipError;

      // 6. Create invoice
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const invoiceData = {
        member_id: memberId,
        membership_plan_id: membershipId,
        branch_id: options.branchId || null,
        amount: totalAmount,
        status: paymentStatus,
        issued_date: new Date().toISOString(),
        due_date: dueDate.toISOString(),
        paid_date: paymentStatus === 'paid' ? new Date().toISOString() : null,
        payment_method: paymentStatus === 'paid' ? payment.method : null,
        description: `Membership: ${membershipPlan.name}`,
        items: [{
          id: `item-${Date.now()}`,
          name: `Membership: ${membershipPlan.name}`,
          description: membershipPlan.description || '',
          quantity: 1,
          unit_price: totalAmount,
          total: totalAmount
        }],
        created_by: staffId,
        notes: options.notes
      };

      const { data: invoice, error: invoiceError } = await client
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // 7. Record payment if any amount was paid
      let transactionId: string | undefined;
      
      if (payment.amount > 0) {
        const { data: transaction, error: transactionError } = await client
          .from('transactions')
          .insert({
            type: 'income',
            amount: payment.amount,
            transaction_date: payment.paid_at || new Date().toISOString(),
            description: `Membership payment: ${membershipPlan.name}`,
            payment_method: payment.method,
            status: 'completed',
            reference_id: invoice.id,
            reference_type: 'invoice',
            member_id: memberId,
            branch_id: options.branchId || null,
            recorded_by: staffId,
            notes: payment.notes
          })
          .select()
          .single();

        if (transactionError) throw transactionError;
        transactionId = transaction.id;
      }

      // 8. Send notifications
      try {
        // Notify member
        await sendNotification(
          memberId,
          'Membership Assigned',
          `You have been assigned a ${membershipPlan.name} membership. Status: ${paymentStatus.toUpperCase()}`,
          paymentStatus === 'paid' ? 'success' : 'info'
        );

        // Notify staff if different from member
        if (staffId !== memberId) {
          const { data: member } = await client
            .from('profiles')
            .select('name')
            .eq('id', memberId)
            .single();

          await sendNotification(
            staffId,
            'Membership Assignment',
            `Assigned ${membershipPlan.name} to ${member?.name || 'member'}. Status: ${paymentStatus.toUpperCase()}`,
            'success'
          );
        }
      } catch (notificationError) {
        console.error('Error sending notifications:', notificationError);
        // Don't fail the whole process if notifications fail
      }

      return {
        success: true,
        membership_id: membership.id,
        invoice_id: invoice.id,
        transaction_id: transactionId,
        message: `Membership assigned successfully. Status: ${paymentStatus.toUpperCase()}`
      };

    } catch (error) {
      console.error('Error in assignMembership:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to assign membership'
      };
    }
  },

  /**
   * Get all active memberships for a member
   * @param memberId The ID of the member
   * @returns Array of active memberships
   */
  getMemberActiveMemberships: async (memberId: string): Promise<MembershipData[]> => {
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
          memberships:membership_id (name, price, duration_days)
        `)
        .eq('member_id', memberId)
        .eq('status', 'active')
        .order('end_date', { ascending: true });

      if (error) {
        console.error('Error fetching active memberships:', error);
        throw error;
      }

      return data?.map(membership => ({
        ...membership,
        memberships: membership.memberships || { name: 'Unknown', price: 0, duration_days: 0 }
      })) || [];
    } catch (error) {
      console.error('Error in getMemberActiveMemberships:', error);
      throw error;
    }
  },

  /**
   * Get invoice history for a member
   * @param memberId The ID of the member
   * @returns Array of invoices
   */
  getMemberInvoiceHistory(memberId: string): Promise<Invoice[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('member_id', memberId)
          .order('issued_date', { ascending: false });

        if (error) throw error;
        resolve(data || []);
      } catch (error) {
        console.error('Error fetching invoice history:', error);
        reject(error);
      }
    });
  },

  /**
   * Get all membership plans for a specific branch
   * @param branchId The ID of the branch
   * @returns Array of membership plans
   */
  getMembershipPlans: async (branchId: string): Promise<MembershipPlan[]> => {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      throw error;
    }
  },

  /**
   * Calculate the end date based on start date and duration in days
   * @param startDate The start date of the membership
   * @param durationDays The duration of the membership in days
   * @returns The calculated end date
   */
  calculateEndDate: (startDate: Date, durationDays: number): Date => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    return endDate;
  }
};

export default membershipService;
