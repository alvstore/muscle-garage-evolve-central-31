
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
}
