
// Branch types for settings
export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  manager_id?: string | null;
  branch_code?: string | null;
  max_capacity?: number | null;
  opening_hours?: string | null;
  closing_hours?: string | null;
  region?: string | null;
  tax_rate?: number | null;
  timezone?: string | null;
  zip_code?: string;
}

export interface BranchFormData {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  branch_code?: string;
  manager_id?: string;
  max_capacity?: number;
  opening_hours?: string;
  closing_hours?: string;
  region?: string;
  tax_rate?: number;
  timezone?: string;
  zip_code?: string;
}

export interface BranchStats {
  total_members: number;
  active_members: number;
  monthly_revenue: number;
  total_classes: number;
  staff_count: number;
  trainer_count: number;
}
