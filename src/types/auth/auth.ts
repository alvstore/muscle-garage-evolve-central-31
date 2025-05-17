export type UserRole = 'admin' | 'staff' | 'trainer' | 'member';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  photoURL: string | null;
  lastSignIn: string;
  createdAt: string;
  updatedAt: string;
  branch_id: string | null;
  permissions: Permission[];
}

export type Permission = 
  | 'manage_members'
  | 'manage_trainers'
  | 'manage_classes'
  | 'manage_memberships'
  | 'manage_payments'
  | 'manage_reports'
  | 'manage_settings'
  | 'view_dashboard'
  | 'view_reports';
