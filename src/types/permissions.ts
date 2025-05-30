
export type Permission = 
  | 'view_dashboard'
  | 'manage_members'
  | 'manage_staff'
  | 'manage_trainers'
  | 'manage_classes'
  | 'manage_finance'
  | 'manage_settings'
  | 'manage_website'
  | 'view_reports'
  | 'manage_crm'
  | 'manage_access_control'
  | 'view_attendance'
  | 'manage_attendance';

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
}
