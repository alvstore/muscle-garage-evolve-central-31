
export type Permission = 
  | 'view_dashboard' 
  | 'manage_members' 
  | 'manage_trainers'
  | 'manage_classes'
  | 'manage_memberships'
  | 'manage_finances'
  | 'manage_branch'
  | 'manage_settings'
  | 'view_branch_data'
  | 'manage_website'
  | 'manage_inventory'
  | 'feature_trainer_dashboard'
  | 'trainer_view_classes'
  | 'trainer_view_attendance'
  | 'trainer_view_members'
  | 'trainer_edit_fitness'
  | 'manage_staff'
  | 'feature_email_campaigns'
  | 'access_communication'
  | 'view_staff'
  | string; // Allow string for flexibility with other permissions

export interface NavItem {
  href: string;
  label: string;
  permission: Permission;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

export interface NavSection {
  name: string;
  items: NavItem[];
  icon?: React.ReactNode; // Add icon property to support trainerNavigation
}
