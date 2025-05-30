// Main types export file
export * from './notification';
export * from './crm';
export * from './finance';
export * from './permissions';
export * from './webhooks';
export * from './invoice';
export * from './measurements';
export * from './workout';
export * from './diet';

// Basic types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membership_status: string;
  created_at: string;
  branch_id: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  membership_id?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  role?: string;
}

export interface Class {
  id: string;
  name: string;
  type: string;
  trainer: string;
  start_time: string;
  end_time: string;
  capacity: number;
  enrolled: number;
  status: string;
  branch_id: string;
  location?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
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

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  subject?: string;
  created_at?: string;
  created_by?: string;
}

// Re-export user types for compatibility
export * from './auth/user';
