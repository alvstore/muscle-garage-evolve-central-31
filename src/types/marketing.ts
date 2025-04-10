
export type PromoCodeType = "percentage" | "fixed" | "free-product";
export type PromoCodeStatus = "active" | "inactive" | "expired" | "scheduled";
export type ReferralStatus = "pending" | "approved" | "rejected" | "rewarded";

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: PromoCodeType;
  value: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  status: PromoCodeStatus;
  usageLimit?: number;
  currentUsage: number;
  applicableProducts?: string[]; // product IDs or "all"
  applicableMemberships?: string[]; // membership IDs or "all"
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Referral {
  id: string;
  referrerId: string; // Member who referred
  referrerName: string;
  referredEmail: string;
  referredName?: string;
  referredId?: string; // New member ID if converted
  status: ReferralStatus;
  promoCodeId?: string;
  promoCode?: string;
  createdAt: string;
  convertedAt?: string;
  rewardAmount?: number;
  rewardDescription?: string;
  rewardStatus?: "pending" | "processed" | "cancelled";
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  rewardType: "fixed" | "percentage" | "product" | "membership-extension";
  rewardValue: number;
  rewardProductId?: string;
  extensionDays?: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  terms?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}
