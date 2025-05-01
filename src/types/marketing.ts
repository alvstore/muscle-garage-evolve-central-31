
export type ReferralStatus = 'pending' | 'approved' | 'rejected' | 'rewarded';
export type RewardStatus = 'pending' | 'processed' | 'failed';

export interface Referral {
  id: string;
  referrer_id?: string;
  referrer_name: string;
  referred_email: string;
  referred_name?: string;
  referred_id?: string;
  status: ReferralStatus;
  promoCodeId?: string;
  promoCode?: string;
  created_at: string;
  converted_at?: string;
  reward_amount?: number;
  reward_description?: string;
  reward_status?: RewardStatus;
  branch_id?: string;
  promo_code?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'membership_extension';
  value: number;
  status: 'active' | 'expired' | 'disabled';
  start_date: Date;
  end_date: Date;
  usage_limit?: number;
  current_usage: number;
  applicable_memberships?: string[];
  applicable_products?: string[];
  branch_id?: string;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description?: string;
  reward_type: 'discount' | 'points' | 'membership_extension';
  reward_value: number;
  start_date: Date;
  end_date?: Date;
  is_active: boolean;
  branch_id?: string;
}
