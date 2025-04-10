
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { UserRole } from '@/types';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user is already stored in localStorage
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsLoading(false);
        return true;
      }
      
      // If no user in localStorage, clear any token and return false
      await authService.logout();
      setUser(null);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response && response.user) {
        setUser(response.user);
        setIsLoading(false);
        
        // Navigate based on user role
        const role = response.user.role;
        navigate('/dashboard');
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear state regardless of API success
      setUser(null);
      setIsLoading(false);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
