
/** @jsxImportSource react */
// Authentication hook with provider
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define valid user roles
export type UserRole = 'admin' | 'staff' | 'trainer' | 'member' | 'guest';

// Type guard to check if a string is a valid UserRole
export const isUserRole = (role: string): role is UserRole => {
  return ['admin', 'staff', 'trainer', 'member', 'guest'].includes(role);
};

export interface User {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  avatar?: string;
  role?: UserRole;
  branch_id?: string;
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

const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  role: undefined,
  login: async () => ({ success: false, error: new Error('Auth not initialized') }),
  logout: async () => {},
  register: async () => ({ success: false, error: new Error('Auth not initialized') }),
  forgotPassword: async () => ({ success: false, error: new Error('Auth not initialized') }),
  resetPassword: async () => ({ success: false, error: new Error('Auth not initialized') }),
  changePassword: async () => ({ success: false, error: new Error('Auth not initialized') }),
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // First try to get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (session?.user) {
          // Fetch profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Profile error:', profileError);
            throw profileError;
          }
          
          // Ensure the role is valid, default to 'member' if not
          const userRole = profile?.role && isUserRole(profile.role) 
            ? profile.role 
            : 'member' as UserRole;

          // Set user data from session and profile
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || profile?.name || '',
            full_name: profile?.full_name,
            avatar: profile?.avatar_url,
            role: userRole,
            branch_id: profile?.branch_id
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear any invalid session
        await supabase.auth.signOut();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email,
            full_name: session.user.user_metadata?.full_name || profile?.full_name,
            avatar: session.user.user_metadata?.avatar_url,
            role: profile?.role || 'member',
            branch_id: profile?.branch_id
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error };
      }

      if (data?.user) {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          return { success: false, error: profileError };
        }

        // Ensure the role is valid, default to 'member' if not
        const userRole = profile?.role && isUserRole(profile.role) 
          ? profile.role 
          : 'member' as UserRole;

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.full_name || profile?.name || data.user.email || '',
          full_name: profile?.full_name,
          avatar: profile?.avatar_url,
          role: userRole,
          branch_id: profile?.branch_id
        });

        return { success: true, error: null };
      }

      return { success: false, error: 'No user data returned' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
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

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error };
    }
  };

  const resetPassword = async (email: string) => {
    // Alias for forgotPassword for backward compatibility
    return forgotPassword(email);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
