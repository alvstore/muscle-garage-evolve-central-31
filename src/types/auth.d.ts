
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  fullName?: string;
  name?: string;
  photoURL?: string;
  avatarUrl?: string;
  role?: UserRole;
  branch_id?: string;
}

export type UserRole = 'admin' | 'staff' | 'trainer' | 'member';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  userRole?: UserRole | null;
  status: AuthStatus;
  isAdmin: () => boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, data?: any) => Promise<any>;
  refreshSession: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  role: UserRole | null;
  userRole?: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
