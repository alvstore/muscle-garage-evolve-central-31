
export interface Membership {
  id: string;
  name: string;
  plan_name?: string;
  description?: string;
  price: number;
  duration_days: number;
  duration_months?: number; // Adding this to fix the errors
  features?: any[];
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Adding all the missing types
export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: MembershipDuration;
  features?: string[];
  status: MembershipPlanStatus;
  branch_id?: string;
  classAccess?: ClassType[];
  created_at?: string;
  updated_at?: string;
  updated_at_str?: string;
  updatedAt?: string;
  durationLabel?: string;
  allowedClasses?: ClassType[];
  benefits?: string[];
}

export enum MembershipDuration {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export enum ClassType {
  ALL = 'all',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  NONE = 'none'
}

export enum MembershipPlanStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}
