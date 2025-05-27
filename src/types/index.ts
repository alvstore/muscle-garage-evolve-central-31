
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
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  content: string;
  subject?: string;
  created_at?: string;
  created_by?: string;
}
