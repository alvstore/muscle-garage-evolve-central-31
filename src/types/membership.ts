
export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: any;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  plan_name?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  memberCount: number;
  features?: string[];
  benefits?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}
