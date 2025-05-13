
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as AuthUser } from '@supabase/supabase-js';
import { UserRole } from '@/types';

// Extended user type with additional properties we need
export interface ExtendedAuthUser extends AuthUser {
  name?: string;
  branch_id?: string;
}

// Auth context type definition
export interface AuthContextType {
  user: ExtendedAuthUser | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUserData: (data: Partial<ExtendedAuthUser>) => Promise<{ success: boolean; error?: string }>;
}

// Default context value
const defaultContext: AuthContextType = {
  user: null,
  userRole: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false, error: 'Not implemented' }),
  signup: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => {},
  changePassword: async () => ({ success: false, error: 'Not implemented' }),
  resetPassword: async () => ({ success: false, error: 'Not implemented' }),
  updateUserData: async () => ({ success: false, error: 'Not implemented' }),
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultContext);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedAuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user as ExtendedAuthUser);
        await fetchUserRole(session.user.id);
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user as ExtendedAuthUser);
            await fetchUserRole(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setUserRole(null);
          } else if (event === 'USER_UPDATED' && session?.user) {
            setUser(session.user as ExtendedAuthUser);
            await fetchUserRole(session.user.id);
          }
        }
      );
      
      setIsLoading(false);
      
      // Clean up subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  // Fetch user role from profiles table
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, name, branch_id')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        setUserRole(data.role as UserRole);
        
        // Update user with additional data
        setUser(prev => {
          if (prev) {
            return {
              ...prev,
              name: data.name,
              branch_id: data.branch_id
            };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        await fetchUserRole(data.user.id);
        return { success: true };
      }
      
      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.'
      };
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        // Create user profile with default role
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            name,
            role: 'member',
            email
          });
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'Signup failed. Please try again.' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Signup failed. Please try again.'
      };
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // First verify current password by trying to sign in
      if (!user?.email) {
        return { success: false, error: 'User email not found' };
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (signInError) {
        return { success: false, error: 'Current password is incorrect' };
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update password. Please try again.'
      };
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Password reset link has been sent to your email');
      return { success: true };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send reset link. Please try again.'
      };
    }
  };

  // Update user data function
  const updateUserData = async (data: Partial<ExtendedAuthUser>) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }
      
      const updates: Partial<ExtendedAuthUser> = { ...data };
      
      // Update auth data if needed
      if (updates.email) {
        const { error } = await supabase.auth.updateUser({
          email: updates.email
        });
        
        if (error) {
          throw error;
        }
      }
      
      // Update profile data
      const { name, branch_id } = updates;
      if (name || branch_id) {
        const profileUpdates: any = {};
        if (name) profileUpdates.name = name;
        if (branch_id) profileUpdates.branch_id = branch_id;
        
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update(profileUpdates)
          .eq('user_id', user.id);
          
        if (profileError) {
          throw profileError;
        }
        
        // Update local user state
        setUser(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast.success('User profile updated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile. Please try again.'
      };
    }
  };

  // Context value
  const value = {
    user,
    userRole,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    changePassword,
    resetPassword,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Default export for the context itself
export default AuthContext;
