
import { supabase } from '@/integrations/supabase/client';

export const createMembershipSubscription = async (
  memberId: string,
  membershipId: string,
  startDate: Date,
  endDate: Date,
  totalAmount: number,
  amountPaid: number,
  branchId: string,
  trainerId?: string
) => {
  const { data, error } = await supabase
    .from('member_memberships')
    .insert({
      member_id: memberId,
      membership_id: membershipId,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      total_amount: totalAmount,
      amount_paid: amountPaid,
      branch_id: branchId,
      trainer_id: trainerId,
      payment_status: amountPaid >= totalAmount ? 'paid' : 'partial',
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const recordPayment = async (
  memberId: string,
  membershipId: string,
  amount: number,
  paymentMethod: string,
  branchId: string,
  staffId: string,
  notes?: string
) => {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      member_id: memberId,
      membership_id: membershipId,
      amount,
      payment_method: paymentMethod,
      branch_id: branchId,
      staff_id: staffId,
      notes,
      status: 'completed'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMembershipPlans = async () => {
  const { data, error } = await supabase
    .from('memberships')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) throw error;
  return data;
};
