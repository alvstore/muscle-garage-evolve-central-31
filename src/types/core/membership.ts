
// Membership plans and subscriptions
export type MembershipPlanStatus = 'active' | 'inactive' | 'draft';
export type SubscriptionStatus = 'active' | 'inactive' | 'expired' | 'cancelled' | 'pending';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'cancelled';

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  allowed_classes?: string;
  status: MembershipPlanStatus;
  benefits?: string[];
  branch_id?: string;
  is_popular?: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemberSubscription {
  id: string;
  member_id: string;
  membership_plan_id: string;
  branch_id: string;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  total_amount: number;
  amount_paid: number;
  payment_status: PaymentStatus;
  payment_method?: string;
  transaction_id?: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionInput {
  member_id: string;
  membership_plan_id: string;
  branch_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_method?: string;
  notes?: string;
}
