
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AuthStateContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const AuthStateContext = createContext<AuthStateContextType | undefined>(undefined);

export const AuthStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        // First set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              // Get user profile data
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (profileError && profileError.code !== 'PGRST116') {
                console.error("Error fetching user profile:", profileError);
                setUser(null);
                setIsLoading(false);
                return;
              }
              
              // Create user object for auth context
              const userData: User = {
                id: session.user.id,
                name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: (profile?.role as any) || 'member',
                branchId: profile?.branch_id,
                branchIds: profile?.accessible_branch_ids || [],
                isBranchManager: profile?.is_branch_manager || false,
                avatar: profile?.avatar_url,
              };
              
              // Store user data in localStorage
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
            } else {
              localStorage.removeItem('user');
              setUser(null);
            }
            setIsLoading(false);
          }
        );

        // Then check for an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Try to get from localStorage as fallback
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              // Validate stored user by checking with Supabase
              const { data } = await supabase.auth.getUser();
              if (data.user) {
                setUser(parsedUser as User);
              } else {
                // Invalid stored user, clear it
                localStorage.removeItem('user');
              }
            } catch (e) {
              console.error("Error parsing stored user:", e);
              localStorage.removeItem('user');
            }
          }
          setIsLoading(false);
        }
        
        // Cleanup function
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth status check failed:", error);
        localStorage.removeItem('user');
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);
  
  return (
    <AuthStateContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        setIsLoading,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthState = (): AuthStateContextType => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthStateProvider');
  }
  return context;
};
