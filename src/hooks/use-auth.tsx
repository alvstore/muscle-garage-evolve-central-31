import { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signup: (email: string, password: string, metadata?: any) => Promise<{ error: any; data: any }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any; data: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any; data: any }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        setSession(newSession);
        
        // If we have a user from the session, fetch their profile data
        if (newSession?.user) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
              
            // Enhance user object with profile data
            if (profileData) {
              setUser({
                ...newSession.user,
                // Add any fields you need in the UI
                is_branch_manager: profileData.is_branch_manager,
                is_staff: profileData.is_staff,
                is_trainer: profileData.is_trainer,
                branch_id: profileData.branch_id,
                full_name: profileData.full_name,
                role: profileData.role
              });
            } else {
              setUser(newSession.user);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setUser(newSession.user);
          }
        } else {
          setUser(null);
        }
        
        setIsAuthenticated(!!newSession?.user);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          // Enhance user object with profile data
          if (profileData) {
            setUser({
              ...currentSession.user,
              // Add any fields you need in the UI
              is_branch_manager: profileData.is_branch_manager,
              is_staff: profileData.is_staff, 
              is_trainer: profileData.is_trainer,
              branch_id: profileData.branch_id,
              full_name: profileData.full_name,
              role: profileData.role
            });
          } else {
            setUser(currentSession.user);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(currentSession.user);
        }
      } else {
        setUser(null);
      }
      
      setIsAuthenticated(!!currentSession?.user);
      setIsLoading(false);
    }).catch(error => {
      console.error('Error getting session:', error);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error(error.message);
        return { error, data: null };
      }
      toast.success('Logged in successfully!');
      await refreshSession();
      return { error: null, data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during login');
      return { error, data: null };
    }
  };

  const signup = async (email: string, password: string, metadata?: any) => {
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
        return { error, data: null };
      }
      toast.success('Account created successfully! Please check your email for verification.');
      return { error: null, data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during signup');
      return { error, data: null };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Logged out successfully!');
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during logout');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
        return { error, data: null };
      }
      toast.success('Password reset instructions sent to your email');
      return { error: null, data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      return { error, data: null };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toast.error(error.message);
        return { error, data: null };
      }
      toast.success('Password updated successfully!');
      return { error: null, data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      return { error, data: null };
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          // Enhance user object with profile data
          if (profileData) {
            setUser({
              ...currentSession.user,
              // Add any fields you need in the UI
              is_branch_manager: profileData.is_branch_manager,
              is_staff: profileData.is_staff,
              is_trainer: profileData.is_trainer,
              branch_id: profileData.branch_id,
              full_name: profileData.full_name,
              role: profileData.role
            });
          } else {
            setUser(currentSession.user);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(currentSession.user);
        }
      } else {
        setUser(null);
      }
      
      setIsAuthenticated(!!currentSession?.user);
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
