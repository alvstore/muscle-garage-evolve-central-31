
export interface Membership {
  id: string;
  name: string;
  plan_name?: string;
  description?: string;
  price: number;
  is_active?: boolean;
  features?: Array<string>;
  duration_days: number;
  duration_months?: number;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}
