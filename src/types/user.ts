
export type UserRole = 'admin' | 'manager' | 'trainer' | 'staff' | 'member';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  branch_id?: string;
  accessible_branch_ids?: string[];
  address?: string; // Adding missing fields
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
