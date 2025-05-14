
export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
  is_active: boolean;
  isActive?: boolean;  // For compatibility with old code
  branch_code: string;
  max_capacity?: number;
  opening_hours?: string;
  closing_hours?: string;
  region?: string;
  tax_rate?: number;
  timezone?: string;
  manager_id?: string;
  created_at: string;
  updated_at: string;
}
