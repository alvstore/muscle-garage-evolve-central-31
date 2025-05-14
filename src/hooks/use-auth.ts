
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
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: false,
  error: null,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          
          setUser({
            id: session.user.id,
            email: session.user.email,
            fullName: userData?.full_name || session.user.email?.split('@')[0] || 'User',
            name: userData?.name || session.user.email?.split('@')[0] || 'User',
            avatar: userData?.avatar_url,
            avatarUrl: userData?.avatar_url,
            role: userData?.role || 'member',
          });
        } else {
          setUser(null);
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
            
            setUser({
              id: session.user.id,
              email: session.user.email,
              fullName: userData?.full_name || session.user.email?.split('@')[0] || 'User',
              name: userData?.name || session.user.email?.split('@')[0] || 'User',
              avatar: userData?.avatar_url,
              avatarUrl: userData?.avatar_url,
              role: userData?.role || 'member',
            });
          } catch (error: any) {
            console.error('Error getting user data:', error);
            setError(error.message);
          }
        } else {
          setUser(null);
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
    } catch (error: any) {
      console.error('Error logging out:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;
