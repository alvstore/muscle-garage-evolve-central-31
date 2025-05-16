
// This file defines the types used for notifications
// We'll create a simple version to fix the compatibility issues

// For backward compatibility with finance module
export interface Invoice {
  id: string;
  member_id: string;
  member_name?: string;
  amount: number;
  description?: string;
  status: string;
  due_date: string;
  payment_date?: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  issued_date?: string;
  branch_id?: string;
  items?: any[];
  membership_plan_id?: string;
}

export interface Notification {
  id: string;
  title: string;
  message?: string;
  read?: boolean;
  type?: string;
  user_id: string;
  created_at?: string;
  is_read?: boolean;
}
