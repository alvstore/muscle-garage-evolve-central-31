
import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useBranch } from "@/hooks/use-branch";
import { MembershipAssignment } from "@/types/membership-assignment";

export const useMembershipAssignment = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { currentBranch } = useBranch();

  const assignMembership = async (data: MembershipAssignment): Promise<boolean> => {
    setLoading(true);

    try {
      // Get the membership plan details first
      const { data: membershipPlan, error: planError } = await supabase
        .from('memberships')
        .select('name, price')
        .eq('id', data.membershipId)
        .single();

      if (planError) throw planError;

      // Get the member name
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('name')
        .eq('id', data.memberId)
        .single();

      if (memberError) throw memberError;

      // 1. Create the membership assignment
      const { data: assignment, error } = await supabase
        .from('member_memberships')
        .insert({
          member_id: data.memberId,
          membership_id: data.membershipId,
          start_date: data.startDate.toISOString().split('T')[0],
          end_date: data.endDate.toISOString().split('T')[0],
          total_amount: data.amount || membershipPlan.price,
          amount_paid: data.amountPaid || 0,
          payment_status: data.paymentStatus,
          branch_id: currentBranch?.id,
          trainer_id: data.trainerId || null
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Update member's membership status
      const { error: updateError } = await supabase
        .from('members')
        .update({
          membership_id: data.membershipId,
          membership_status: 'active',
          membership_start_date: data.startDate.toISOString(),
          membership_end_date: data.endDate.toISOString(),
          trainer_id: data.trainerId || null
        })
        .eq('id', data.memberId);

      if (updateError) throw updateError;

      // 3. Create an invoice for this membership
      const invoiceItems = [{
        id: `item-${Date.now()}`,
        name: membershipPlan.name,
        quantity: 1,
        unitPrice: data.amount || membershipPlan.price,
      }];

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          member_id: data.memberId,
          membership_plan_id: data.membershipId,
          amount: data.amount || membershipPlan.price,
          status: data.paymentStatus === 'paid' ? 'paid' : 'pending',
          issued_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          paid_date: data.paymentStatus === 'paid' ? new Date().toISOString() : null,
          items: invoiceItems,
          branch_id: currentBranch?.id,
          created_by: user?.id,
          description: `Membership: ${membershipPlan.name}`,
          payment_method: data.paymentStatus === 'paid' ? data.paymentMethod : null
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // 4. If payment status is paid, record a payment and transaction
      if (data.paymentStatus === 'paid' && data.amountPaid && data.amountPaid > 0) {
        // Record payment
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            member_id: data.memberId,
            membership_id: data.membershipId,
            amount: data.amountPaid,
            payment_date: new Date().toISOString(),
            branch_id: currentBranch?.id,
            staff_id: user?.id,
            status: 'completed',
            payment_method: data.paymentMethod,
            notes: `Payment for ${membershipPlan.name} membership`,
            invoice_id: invoice.id
          });

        if (paymentError) throw paymentError;

        // Record transaction
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            type: 'income',
            amount: data.amountPaid,
            transaction_date: new Date().toISOString(),
            description: `Payment received for ${membershipPlan.name} membership (${memberData.name})`,
            reference_id: invoice.id,
            branch_id: currentBranch?.id,
            recorded_by: user?.id,
            payment_method: data.paymentMethod,
          });

        if (transactionError) throw transactionError;
      }

      toast.success('Membership assigned successfully');
      return true;
    } catch (error: any) {
      console.error('Error assigning membership:', error);
      toast.error('Failed to assign membership');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignMembership,
    loading
  };
};
