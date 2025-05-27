
// Main types export file
export * from './notification';
export * from './crm';
export * from './finance';
export * from './permissions';
export * from './webhooks';

// Basic types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membership_status: string;
  created_at: string;
  branch_id: string;
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
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
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
