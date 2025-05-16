
// Define the possible user roles
export type UserRole = 'admin' | 'staff' | 'trainer' | 'member' | 'guest';

// Define the User interface for authentication
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  user_metadata?: any;
  app_metadata?: any;
}
