
export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: string[];
  access_level?: string;
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  max_freeze_days?: number;
  allow_guest_access?: boolean;
  discount_percentage?: number;
}

export enum MembershipDuration {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  YEARLY = 'yearly'
}

export interface ClassType {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  duration_minutes: number;
  branch_id?: string;
  is_active?: boolean;
}

export enum MembershipPlanStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

// Add other types as needed for membership functionality

