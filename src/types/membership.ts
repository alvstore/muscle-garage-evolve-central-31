
export type MembershipDuration = '1-month' | '3-month' | '6-month' | '12-month';
export type ClassType = 'all' | 'group-only' | 'basic-only';
export type MembershipPlanStatus = 'active' | 'inactive';

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  duration_label?: MembershipDuration;
  benefits: string[];
  allowed_classes: ClassType;
  status: MembershipPlanStatus;
  created_at: string;
  updated_at: string;
}
