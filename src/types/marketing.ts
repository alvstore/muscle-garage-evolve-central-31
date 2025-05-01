
export type ReferralStatus = 'pending' | 'approved' | 'rejected' | 'rewarded';
export type RewardStatus = 'pending' | 'processed' | 'failed';
export type PromoCodeType = 'percentage' | 'fixed' | 'free-product' | 'membership_extension';
export type PromoCodeStatus = 'active' | 'inactive' | 'expired' | 'scheduled';
export type ReferralRewardType = 'discount' | 'points' | 'membership_extension';

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
  type: PromoCodeType;
  value: number;
  status: PromoCodeStatus;
  start_date: string;
  end_date: string;
  usage_limit?: number;
  current_usage: number;
  applicable_memberships?: string[];
  applicable_products?: string[];
  branch_id?: string;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  // For UI components
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number;
  currentUsage?: number;
  applicableProducts?: string[];
  applicableMemberships?: string[];
}

export interface ReferralProgram {
  id: string;
  name: string;
  description?: string;
  reward_type: ReferralRewardType;
  reward_value: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  branch_id?: string;
  extensionDays?: number;
  terms?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  // For UI components
  rewardType?: string;
  rewardValue?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  rewardProductId?: string;
}
