
// Branch management types
export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  branch_code?: string;
  region?: string;
  timezone?: string;
  manager_id?: string;
  is_active: boolean;
  max_capacity?: number;
  opening_hours?: string;
  closing_hours?: string;
  tax_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBranchInput {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  branch_code?: string;
  region?: string;
  timezone?: string;
  manager_id?: string;
  max_capacity?: number;
  opening_hours?: string;
  closing_hours?: string;
  tax_rate?: number;
}

export interface UpdateBranchInput extends Partial<CreateBranchInput> {
  is_active?: boolean;
}
