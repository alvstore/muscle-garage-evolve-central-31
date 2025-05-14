
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Extend the User type to include properties used in the app
export interface User {
  id: string;
  email?: string;
  name?: string;
  fullName?: string;
  avatar?: string;
  avatarUrl?: string;
  role?: string;
  branch_id?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
  photoURL?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userRole?: string;
  forgotPassword: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: false,
  error: null,
  isAuthenticated: false,
  forgotPassword: async () => false,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        const session = data.session;
        
        if (session) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userError && userError.code !== 'PGRST116') {
            throw userError;
          }
          
          const userWithMetadata: User = {
            id: session.user.id,
            email: session.user.email,
            fullName: userData?.full_name || session.user.email?.split('@')[0] || 'User',
            name: userData?.name || session.user.email?.split('@')[0] || 'User',
            avatar: userData?.avatar_url,
            avatarUrl: userData?.avatar_url,
            photoURL: userData?.avatar_url,
            role: userData?.role || 'member',
            branch_id: userData?.branch_id,
            user_metadata: {
              full_name: userData?.full_name,
              avatar_url: userData?.avatar_url,
              role: userData?.role
            }
          };
          
          setUser(userWithMetadata);
          setUserRole(userData?.role);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error('Error getting session:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (userError && userError.code !== 'PGRST116') {
              throw userError;
            }
            
            const userWithMetadata: User = {
              id: session.user.id,
              email: session.user.email,
              fullName: userData?.full_name || session.user.email?.split('@')[0] || 'User',
              name: userData?.name || session.user.email?.split('@')[0] || 'User',
              avatar: userData?.avatar_url,
              avatarUrl: userData?.avatar_url,
              photoURL: userData?.avatar_url,
              role: userData?.role || 'member',
              branch_id: userData?.branch_id,
              user_metadata: {
                full_name: userData?.full_name,
                avatar_url: userData?.avatar_url,
                role: userData?.role
              }
            };
            
            setUser(userWithMetadata);
            setUserRole(userData?.role);
            setIsAuthenticated(true);
          } catch (error: any) {
            console.error('Error getting user data:', error);
            setError(error.message);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error('Error logging out:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Alias for logout to maintain compatibility
  const signOut = logout;

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      error,
      isAuthenticated,
      userRole,
      forgotPassword,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;
