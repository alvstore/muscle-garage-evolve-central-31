
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  gender?: string;
  department?: string;
  is_trainer?: boolean;
  is_staff?: boolean;
  is_branch_manager?: boolean;
  accessible_branch_ids?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role?: UserRole;
  login: (email: string, password: string) => Promise<{ success: boolean; error: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<{ success: boolean; error: any }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error: any }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: any }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function isUserRole(value: string): value is UserRole {
  return ['admin', 'staff', 'trainer', 'member', 'guest'].includes(value);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const isAuthenticated = !!user && !!session;

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email || supabaseUser.email,
          full_name: profile.full_name,
          name: profile.full_name,
          avatar_url: profile.avatar_url,
          avatar: profile.avatar_url,
          role: profile.role || 'member',
          branch_id: profile.branch_id,
          is_active: profile.is_active,
          created_at: profile.created_at,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          zip_code: profile.zip_code,
          gender: profile.gender,
          is_trainer: profile.is_trainer,
          is_staff: profile.is_staff,
          is_branch_manager: profile.is_branch_manager,
          accessible_branch_ids: profile.accessible_branch_ids
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      if (data.user) {
        await fetchUserProfile(data.user);
        toast.success('Login successful');
        return { success: true, error: null };
      }

      return { success: false, error: new Error('No user returned') };
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed');
      } else {
        setUser(null);
        setSession(null);
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      if (data.user) {
        toast.success('Registration successful');
        return { success: true, error: null };
      }

      return { success: false, error: new Error('Registration failed') };
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Password reset email sent');
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset email');
      return { success: false, error };
    }
  };

  const resetPassword = async (email: string) => {
    // This is typically handled by the email link flow
    return forgotPassword(email);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Password changed successfully');
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Change password error:', error);
      toast.error('Failed to change password');
      return { success: false, error };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    role: user?.role,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
