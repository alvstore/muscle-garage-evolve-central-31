
// User and authentication types
export type UserRole = 'admin' | 'staff' | 'trainer' | 'member' | 'guest';

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  name?: string;
  avatar_url?: string;
  avatar?: string;
  role: UserRole;
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  zipCode?: string;
  gender?: string;
  department?: string;
  is_trainer?: boolean;
  is_staff?: boolean;
  is_branch_manager?: boolean;
  isBranchManager?: boolean;
  accessible_branch_ids?: string[];
  branchIds?: string[];
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  gender?: string;
  accessible_branch_ids?: string[];
  is_branch_manager?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role?: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
  branch_id?: string;
}
