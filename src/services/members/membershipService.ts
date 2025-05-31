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
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        read: false
        // created_at will be set by the database default
      })
      .select()
      .single();
      
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
      branchId?: string | null;
      startDate?: Date;
      endDate?: Date;
      notes?: string;
      staffId?: string;
      trainerId?: string;
    } = {}
  ): Promise<MembershipAssignmentResult> => {
    const client = supabase;
    const staffId = options.staffId || memberId; // Fallback to memberId if staffId not provided
    
    try {
      console.log('Starting membership assignment with options:', { 
        memberId, 
        membershipId, 
        payment: { ...payment, transaction_id: payment.transaction_id ? '***' : undefined },
        options: { ...options, staffId: options.staffId ? '***' : undefined }
      });
      
      // 1. Validate input
      if (!memberId || !membershipId) {
        throw new Error('Member ID and Membership ID are required');
      }
      
      // 2. Validate member exists and is active
      // Check if member exists in members table
      const { data: member, error: memberError } = await client
        .from('members')
        .select('id, name, email, status, membership_status, user_id')
        .eq('id', memberId)
        .single();
        
      if (memberError || !member) {
        throw new Error(`Member not found: ${memberId}. Please ensure the member is registered in the system.`);
      }
      
      // Check if member is active
      if (member.status !== 'active' || member.membership_status !== 'active') {
        throw new Error(`Member ${member.name} (${member.email}) is not active. Current status: ${member.status || 'unknown'}`);
      }

      // 2. Get membership plan details
      const { data: membershipPlan, error: planError } = await client
        .from('memberships')
        .select('*')
        .eq('id', membershipId)
        .eq('is_active', true)
        .single();

      if (planError || !membershipPlan) {
        throw new Error(`Invalid or inactive membership plan: ${membershipId}`);
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

      // 5. Check for existing active memberships
      const { data: existingMemberships, error: existingError } = await client
        .from('member_memberships')
        .select('id, end_date, status')
        .eq('member_id', memberId)
        .eq('status', 'active')
        .gt('end_date', new Date().toISOString());
        
      if (existingError) {
        console.error('Error checking existing memberships:', existingError);
        throw new Error('Failed to check existing memberships');
      }
      
      if (existingMemberships && existingMemberships.length > 0) {
        console.warn(`Member ${memberId} already has active memberships:`, existingMemberships);
        // Optionally handle this case (e.g., by expiring old memberships)
      }
      
      // 6. Create membership record directly
      // Use user_id from the members table for the member_id foreign key
      const membershipData = {
        member_id: member.user_id, // Use the user_id from the members table
        membership_id: membershipId,
        branch_id: options.branchId || null,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'active',
        total_amount: totalAmount,
        amount_paid: payment.amount,
        payment_status: paymentStatus,
        notes: options.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Creating membership with data:', membershipData);
      
      const { data: membership, error: membershipError } = await client
        .from('member_memberships')
        .insert(membershipData)
        .select()
        .single();
      
      if (membershipError) {
        console.error('Error creating membership:', membershipError);
        throw new Error(`Failed to create membership: ${membershipError.message}`);
      }
      
      // 7. Update the member's membership info
      const { error: updateMemberError } = await client
        .from('members')
        .update({
          membership_id: membershipId,
          membership_status: 'active',
          membership_start_date: startDate.toISOString(),
          membership_end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId);
        
      if (updateMemberError) {
        console.error('Error updating member record:', updateMemberError);
        // Don't fail the whole process if this update fails
      }
      
      // Success - no transaction to commit

      // 7. Create invoice for the membership
      let invoice = null;
      try {
        const invoiceData = {
          member_id: memberId,
          amount: membershipPlan.price, // Total amount of the membership
          amount_paid: payment.amount,
          balance: Math.max(0, membershipPlan.price - payment.amount), // Calculate remaining balance
          status: paymentStatus === 'paid' && payment.amount >= membershipPlan.price ? 'paid' : 
                 payment.amount > 0 ? 'partial' : 'pending',
          issued_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          paid_date: paymentStatus === 'paid' || payment.amount > 0 ? new Date().toISOString() : null,
          payment_method: payment.method,
          items: [
            {
              name: membershipPlan.name,
              description: `Membership for ${member.name} (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`,
              quantity: 1,
              unit_price: membershipPlan.price,
              total: membershipPlan.price
            }
          ],
          branch_id: options.branchId || null,
          membership_plan_id: membershipId,
          member_membership_id: membership.id, // Link to the membership record
          description: `Membership: ${membershipPlan.name} (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`,
          notes: options.notes || `Payment method: ${payment.method}${payment.transaction_id ? `, Transaction: ${payment.transaction_id}` : ''}`,
          created_by: member.user_id
        };

        const { data: createdInvoice, error: invoiceError } = await client
          .from('invoices')
          .insert(invoiceData)
          .select()
          .single();

        if (invoiceError) {
          console.error('Error creating invoice:', invoiceError);
          // Don't fail the whole process if invoice creation fails
          toast.error('Membership assigned, but there was an error creating the invoice');
        } else {
          invoice = createdInvoice;
          console.log('Created invoice for membership:', {
            membershipId: membership.id,
            invoiceId: invoice.id,
            total: membershipPlan.price,
            paid: payment.amount,
            balance: membershipPlan.price - payment.amount
          });
        }
      } catch (invoiceError) {
        console.error('Error in invoice creation process:', invoiceError);
        toast.error('Membership assigned, but there was an error creating the invoice');
        // Continue with the process even if invoice creation fails
      }

      // 8. Record payment if any amount was paid
      let transactionId: string | undefined;
      if (payment.amount > 0) {
        try {
          const transactionData = {
            type: 'income',
            amount: payment.amount,
            transaction_date: new Date().toISOString(),
            category_id: null,
            description: `Membership payment for ${membershipPlan.name}`,
            reference_id: invoice?.id || null,
            payment_method: payment.method,
            transaction_id: payment.transaction_id || null,
            branch_id: options.branchId || null,
            recorded_by: member.user_id // This must be a valid auth.users.id
          };

          const { data: transaction, error: transactionError } = await client
            .from('transactions')
            .insert(transactionData)
            .select()
            .single();

          if (transactionError) {
            console.error('Error recording transaction:', transactionError);
            // Don't fail the process if transaction recording fails
          } else {
            transactionId = transaction.id;
          }
        } catch (error) {
          console.error('Error in transaction recording process:', error);
          // Continue even if transaction recording fails
        }
      }

      // 9. Send notifications
      try {
        // Notify member - use member.user_id which is the auth.users.id
        if (member.user_id) {
          await sendNotification(
            member.user_id,
            'Membership Assigned',
            `You have been assigned a ${membershipPlan.name} membership. Status: ${paymentStatus.toUpperCase()}`,
            paymentStatus === 'paid' ? 'success' : 'info'
          );
        } else {
          console.warn('Member user_id is missing, cannot send notification');
        }

        // Notify staff if different from member
        if (staffId && staffId !== memberId) {
          // Get staff user_id from profiles table
          const { data: staffProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', staffId)
            .single();
            
          if (staffProfile?.id) {
            await sendNotification(
              staffProfile.id,
              'Membership Assignment',
              `Assigned ${membershipPlan.name} to ${member.full_name || 'member'}. Status: ${paymentStatus.toUpperCase()}`,
              'success'
            );
          } else {
            console.warn('Staff profile not found for staffId:', staffId);
          }
        }
      } catch (notificationError) {
        console.error('Error sending notifications:', notificationError);
        // Don't fail the whole process if notifications fail
      }

      return {
        success: true,
        membership_id: membership.id,
        invoice_id: invoice?.id,
        transaction_id: transactionId,
        message: `Membership assigned successfully. Status: ${paymentStatus.toUpperCase()}`
      };

    } catch (error) {
      console.error('Error in assignMembership:', error);
      
      // Handle specific error cases
      let errorMessage = 'Failed to assign membership';
      
      if (error instanceof Error) {
        if (error.message.includes('violates foreign key constraint')) {
          if (error.message.includes('member_id')) {
            errorMessage = 'Invalid member ID. The specified member does not exist.';
          } else if (error.message.includes('membership_id')) {
            errorMessage = 'Invalid membership plan. The selected plan does not exist.';
          } else if (error.message.includes('branch_id')) {
            errorMessage = 'Invalid branch. The specified branch does not exist.';
          }
        } else if (error.message.includes('duplicate key value')) {
          errorMessage = 'A membership with these details already exists.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
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
