
// Authentication and user types
export type UserRole = 'admin' | 'staff' | 'trainer' | 'member' | 'guest';

export interface User {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  avatar?: string;
  role: UserRole;
  branch_id?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  branch_id?: string;
  accessible_branch_ids?: string[];
  is_branch_manager?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  error: any;
}
