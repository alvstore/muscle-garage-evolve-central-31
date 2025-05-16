import { createContext, useContext, useState, useEffect } from 'react';
// No longer using useNavigate to avoid router context dependency
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  // Alias methods for backward compatibility
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A helper function to handle navigation safely without relying on useNavigate
const navigateToPath = (path: string) => {
  window.location.href = path;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            setUser(null);
            setUserRole(null);
          } else {
            const userProfile = {
              ...session.user,
              ...profile
            } as User;
            setUser(userProfile);
            setUserRole(profile?.role || 'member');
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Unexpected error loading session:", error);
        setUser(null);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching profile after sign-in:", error);
              setUser(null);
              setUserRole(null);
            } else {
              const userProfile = {
                ...session.user,
                ...data
              } as User;
              setUser(userProfile);
              setUserRole(data?.role || 'member');
            }
          });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
      }
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile after sign-in:", profileError);
        setUser(null);
        setUserRole(null);
      } else {
        const userProfile = {
          ...data.user,
          ...profile
        } as User;
        setUser(userProfile);
        setUserRole(profile?.role || 'member');
      }
      navigateToPath('/dashboard');
    } catch (error: any) {
      console.error("Sign-in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      navigateToPath('/login');
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            ...userData,
          }
        }
      });

      if (error) {
        throw error;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user?.id,
          email: email,
          ...userData,
          role: 'member'
        }]);

      if (profileError) {
        throw profileError;
      }

      setUser({
        ...data.user,
        ...userData,
        email: email,
      } as User);
      setUserRole('member');
      navigateToPath('/dashboard');
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, ...userData } : null);
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating user:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Alias methods for backward compatibility
  const login = signIn;
  const logout = signOut;
  const register = signUp;
  const forgotPassword = resetPassword;
  
  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      setIsLoading(false);
      return Promise.resolve();
    } catch (error) {
      console.error('Error changing password:', error);
      setIsLoading(false);
      return Promise.reject(error);
    }
  };

  const value = {
    user,
    userRole,
    isLoading,
    isAdmin: userRole === 'admin',
    // New methods
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    // Alias methods for backward compatibility
    signIn: signIn,
    signOut: signOut,
    signUp: signUp,
    updateUser: updateUser,
  } as const;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
