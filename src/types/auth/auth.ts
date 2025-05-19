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
  // Member permissions
  | 'view:members' 
  | 'create:members' 
  | 'edit:members' 
  | 'delete:members'
  
  // Trainer permissions
  | 'view:trainers' 
  | 'create:trainers' 
  | 'edit:trainers' 
  | 'delete:trainers'
  
  // Staff permissions
  | 'view:staff' 
  | 'create:staff' 
  | 'edit:staff' 
  | 'delete:staff'
  
  // Class permissions
  | 'view:classes' 
  | 'create:classes' 
  | 'edit:classes' 
  | 'delete:classes'
  
  // Membership permissions
  | 'view:memberships' 
  | 'create:memberships' 
  | 'edit:memberships' 
  | 'delete:memberships'
  
  // System permissions
  | 'view:reports'
  | 'view:dashboard'
  | 'view:settings'
  | 'edit:settings'
  | 'view:finances'
  | 'create:finances'
  | 'view:branches'
  | 'create:branches'
  | 'edit:branches'
  | 'export_data';
