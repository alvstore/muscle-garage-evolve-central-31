
export interface Membership {
  id: string;
  name: string;
  plan_name?: string;
  description?: string;
  price: number;
  duration_days: number;
  duration_months?: number;
  features?: any[];
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export enum MembershipDuration {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
  ONE_MONTH = '1-month',
  THREE_MONTH = '3-month',
  SIX_MONTH = '6-month',
  TWELVE_MONTH = '12-month'
}

export enum ClassType {
  ALL = 'all',
  GROUP_ONLY = 'group-only',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  BASIC_ONLY = 'basic-only',
  NONE = 'none'
}

export enum MembershipPlanStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

// Adding a more comprehensive MembershipPlan type that includes all fields used in components
export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: MembershipDuration;
  durationDays?: number;
  durationLabel?: string;
  features?: string[];
  benefits?: string[];
  status: MembershipPlanStatus;
  branch_id?: string;
  allowedClasses?: ClassType[];
  created_at?: string;
  updated_at?: string;
  isActive?: boolean;
  memberCount?: number;
}
