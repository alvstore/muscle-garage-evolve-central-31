
export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  duration_months?: number;
  is_active: boolean;
  features?: any[];
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}
