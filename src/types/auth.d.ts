import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  // Add missing properties
  fullName?: string;
  avatar?: string;
  photoURL?: string;
  avatarUrl?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  branch_id?: string;
  role?: string;
  email?: string;
  id: string;
}

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, data?: any) => Promise<any>;
  signOut: () => Promise<any>;
  loading: boolean;
  error: string | null;
  isAdmin?: boolean;
  resetPassword?: (email: string) => Promise<any>;
}
