
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';

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
    // Check if user is already logged in (from localStorage or token)
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would be an API call to validate token
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Ensure the role is a valid UserRole
          if (['admin', 'staff', 'trainer', 'member'].includes(parsedUser.role)) {
            // Make sure the user object has all required fields
            setUser({
              ...parsedUser,
              avatar: parsedUser.avatar || null // Ensure avatar field exists
            } as User);
          } else {
            console.error("Invalid user role stored in localStorage");
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        localStorage.removeItem('user');
      } finally {
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
