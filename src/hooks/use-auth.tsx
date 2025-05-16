
import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from 'sonner';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  role: string | null;
  userRole: string | null; // Added for compatibility
  login: (email: string, password: string) => Promise<{ data: any; error: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, metadata: object) => Promise<{ data: any; error: any }>;
  forgotPassword: (email: string) => Promise<{ data: any; error: any }>;
  resetPassword: (accessToken: string, newPassword: string) => Promise<{ data: any; error: any }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>; // Added method
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  role: null,
  userRole: null,
  login: async () => ({ data: null, error: null }),
  logout: async () => {},
  register: async () => ({ data: null, error: null }),
  forgotPassword: async () => ({ data: null, error: null }),
  resetPassword: async () => ({ data: null, error: null }),
  changePassword: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      setIsLoading(true);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (!session) {
          setIsAuthenticated(false);
          setUser(null);
          setRole(null);
          return;
        }

        const { user: authUser } = session;
        
        if (!authUser) {
          setIsAuthenticated(false);
          setUser(null);
          setRole(null);
          return;
        }

        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        const userData: User = {
          id: authUser.id,
          email: authUser.email || undefined,
          ...profileData
        };

        setUser(userData);
        setRole(profileData?.role || null);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        getUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      // Clean up the subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return { data, error: error.message };
      }

      return { data, error: null, success: true };
    } catch (error: any) {
      toast.error('Login failed');
      return { data: null, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const register = async (email: string, password: string, metadata: object) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        toast.error(error.message);
        return { data, error: error.message };
      }
      
      return { data, error: null };
    } catch (error: any) {
      toast.error('Registration failed');
      return { data: null, error: error.message };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        toast.error(error.message);
        return { data, error: error.message };
      }
      
      return { data, error: null };
    } catch (error: any) {
      toast.error('Password reset request failed');
      return { data: null, error: error.message };
    }
  };

  const resetPassword = async (accessToken: string, newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        toast.error(error.message);
        return { data, error: error.message };
      }
      
      return { data, error: null };
    } catch (error: any) {
      toast.error('Password reset failed');
      return { data: null, error: error.message };
    }
  };

  // Added changePassword method
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });
      
      if (signInError) {
        toast.error('Current password is incorrect');
        return false;
      }
      
      // Then update to the new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password changed successfully');
      return true;
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        role,
        userRole: role, // Added for compatibility
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        changePassword, // Added method
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
