
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, branchId?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUserBranch: (branchId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUserBranch: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
          if (isValidUserRole(parsedUser.role)) {
            setUser(parsedUser as User);
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

  // Helper function to validate UserRole
  const isValidUserRole = (role: any): role is UserRole => {
    return ['admin', 'staff', 'trainer', 'member'].includes(role);
  };

  const login = async (email: string, password: string, branchId?: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Mock authentication with branch data
      const userData = {
        id: "user1",
        name: "John Doe",
        email: email,
        role: "admin" as UserRole,
        branchId: branchId || "branch1", // Default branch or selected branch
        branchIds: ["branch1", "branch2", "branch3"], // All branches the admin can access
        isBranchManager: true,
      };
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserBranch = (branchId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      branchId
    };
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update state
    setUser(updatedUser);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to invalidate token
      // For now, just remove from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('currentBranchId');
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      console.log("Register user:", userData);
      // After successful registration, you might want to auto-login the user
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
        register,
        updateUserBranch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
