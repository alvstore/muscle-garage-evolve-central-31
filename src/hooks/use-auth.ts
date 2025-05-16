import React, { useState, useCallback, createContext, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/services/supabaseClient';
import { User, UserRole } from '@/types';

// Define the auth context interface
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<{ success: boolean; data: any; error: any }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error: any }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error: any }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error: any }>;
}

// Create the auth context with a default undefined value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Define the auth provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Create the auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            ...session.user,
            ...profile
          } as User);
          
          setRole((profile?.role as UserRole) || null);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            ...session.user,
            ...profile
          } as User);
          
          setRole((profile?.role as UserRole) || null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRole(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Create login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create register function
  const register = useCallback(async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, data: null, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create forgot password function
  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create reset password function
  const resetPassword = useCallback(async (newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email as string,
        password: currentPassword,
      });
      
      if (signInError) throw new Error('Current password is incorrect');
      
      // Then update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create the context value
  const contextValue: AuthContextProps = {
    user,
    isLoading,
    isAuthenticated: !!user,
    role,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );

};

// Custom hook to use the auth context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
