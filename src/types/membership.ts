
export type MembershipDuration = '1-month' | '3-month' | '6-month' | '12-month';
export type ClassType = 'all' | 'group-only' | 'basic-only';
export type MembershipPlanStatus = 'active' | 'inactive';

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  durationDays?: number; // For backward compatibility
  duration_label?: MembershipDuration;
  benefits: string[];
  features?: string[]; // Alternate naming used in some components
  allowed_classes: ClassType;
  status: MembershipPlanStatus;
  is_active?: boolean; // Used in some components
  isActive?: boolean; // For backward compatibility
  created_at: string;
  updated_at: string;
  memberCount?: number; // Used in UI
}
