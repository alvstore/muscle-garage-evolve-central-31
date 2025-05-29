import { supabase } from '@/integrations/supabase/client';
import { MembershipPlan } from '@/types/members/membership';
import { toast } from 'sonner';

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
   * @param membershipData Membership and payment details
   * @returns Result with success status and IDs of created records
   */
  assignMembership: async (membershipData: {
    member_id: string;
    membership_id: string;  // Changed from membership_plan_id to match DB
    branch_id: string;
    start_date?: string | Date;
    end_date: string | Date;
    payment?: {
      amount?: number;
      method?: string;
      status?: string;
      transaction_id?: string;
      reference_number?: string;
      notes?: string;
    };
    total_amount?: number;
    notes?: string;
  }): Promise<{
    success: boolean;
    membership_id?: string;
    invoice_id?: string;
    transaction_id?: string;
    reference_number?: string;
    error?: string;
  }> => {
    const client = supabase;
    
    try {
      // 1. Start a transaction
      const { data: membershipPlan, error: planError } = await client
        .from('memberships')
        .select('*')
        .eq('id', membershipData.membership_id)
        .single();

      if (planError || !membershipPlan) {
        console.error('Error fetching membership plan:', planError);
        return { success: false, error: 'Invalid membership plan' };
      }

      // 2. Prepare dates
      const startDate = membershipData.start_date ? new Date(membershipData.start_date) : new Date();
      const endDate = new Date(membershipData.end_date);
      
      // 3. Calculate amounts
      const totalAmount = membershipData.total_amount || membershipPlan.price;
      const paymentAmount = membershipData.payment?.amount || totalAmount;
      const paymentStatus = paymentAmount >= totalAmount ? 'paid' : 'partial';
      const paymentMethod = membershipData.payment?.method || 'cash';
      const transactionId = membershipData.payment?.transaction_id || '';
      const referenceNumber = membershipData.payment?.reference_number || '';
      const notes = membershipData.notes || '';

      // 4. Create membership record
      const { data: newMembership, error: membershipError } = await client
        .from('member_memberships')
        .insert({
          member_id: membershipData.member_id,
          membership_id: membershipData.membership_id,  // Changed to match DB column
          branch_id: membershipData.branch_id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          total_amount: totalAmount,
          amount_paid: paymentAmount,
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

      // 5. Create invoice
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      
      const { data: newInvoice, error: invoiceError } = await client
        .from('invoices')
        .insert({
          member_id: membershipData.member_id,
          membership_id: membershipData.membership_id,  // Changed to match DB column
          branch_id: membershipData.branch_id,
          amount: totalAmount,
          status: paymentStatus,
          payment_method: paymentMethod,
          payment_date: paymentStatus === 'paid' ? new Date().toISOString() : null,
          due_date: dueDate.toISOString(),
          description: `Membership: ${membershipPlan.name}`,
          notes: notes,
          reference_number: referenceNumber,
          items: [{
            description: `Membership: ${membershipPlan.name}`,
            amount: totalAmount,
            quantity: 1,
            total: totalAmount
          }],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (invoiceError) {
        console.error('Error creating invoice:', invoiceError);
        return { success: false, error: invoiceError.message };
      }

      // 6. Create transaction record if payment was made
      if (paymentAmount > 0) {
        const { error: transactionError } = await client
          .from('transactions')
          .insert({
            type: 'income',
            amount: paymentAmount,
            description: `Membership payment: ${membershipPlan.name}`,
            payment_method: paymentMethod,
            status: paymentStatus,
            reference_id: newMembership.id,
            reference_type: 'membership',
            member_id: membershipData.member_id,
            branch_id: membershipData.branch_id,
            notes: notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (transactionError) {
          console.error('Error creating transaction:', transactionError);
          return { success: false, error: transactionError.message };
        }
      }

      return {
        success: true,
        membership_id: newMembership.id,
        invoice_id: newInvoice.id,
        transaction_id: transactionId,
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
  getMembershipPlans(branchId: string): Promise<MembershipPlan[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data, error } = await supabase
          .from('memberships')
          .select('*')
          .eq('branch_id', branchId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        resolve(data || []);
      } catch (error) {
        console.error('Error fetching membership plans:', error);
        reject(error);
      }
    });
  }

};

export default membershipService;
