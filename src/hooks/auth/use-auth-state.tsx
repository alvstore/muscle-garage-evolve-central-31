
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createContext, useContext, ReactNode } from 'react';
import { UserRole } from '@/types';

interface AuthStateContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthStateContext = createContext<AuthStateContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
});

export const AuthStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const setupAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up the auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            if (event === 'SIGNED_OUT') {
              setUser(null);
              setSession(null);
            } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
              setUser(newSession?.user || null);
              setSession(newSession);
            }
          }
        );

        // Then check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setUser(currentSession.user);
          setSession(currentSession);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth setup error:', error);
        toast.error('Authentication setup failed');
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  return (
    <AuthStateContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
