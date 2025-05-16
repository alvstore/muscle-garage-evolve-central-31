
export type UserRole = 'admin' | 'member' | 'trainer' | 'staff' | 'manager';

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  gender?: string;
  department?: string;
  is_trainer?: boolean;
  is_staff?: boolean;
  is_branch_manager?: boolean; // Added this field
  isBranchManager?: boolean; // For backward compatibility
  accessible_branch_ids?: string[];
}
