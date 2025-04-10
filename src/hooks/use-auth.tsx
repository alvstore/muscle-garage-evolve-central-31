
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';

// Define mock users for demo purposes
const MOCK_USERS = {
  admin: {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
    branchId: "branch1",
    branchIds: ["branch1", "branch2", "branch3"],
    isBranchManager: true,
  },
  staff: {
    id: "staff1",
    name: "Staff User",
    email: "staff@example.com",
    password: "staff123",
    role: "staff" as UserRole,
    branchId: "branch1",
    branchIds: ["branch1"],
    isBranchManager: false,
  },
  trainer: {
    id: "trainer1",
    name: "Trainer User",
    email: "trainer@example.com",
    password: "trainer123",
    role: "trainer" as UserRole,
    branchId: "branch1",
    branchIds: ["branch1"],
    isBranchManager: false,
  },
  member: {
    id: "member1",
    name: "Member User",
    email: "member@example.com",
    password: "member123",
    role: "member" as UserRole,
    branchId: "branch1",
    branchIds: ["branch1"],
    isBranchManager: false,
  }
};

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
      // Mock authentication for demo purposes
      // Find user in our mock data
      const foundUser = Object.values(MOCK_USERS).find(
        user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Create user object for auth context
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        branchId: branchId || foundUser.branchId,
        branchIds: foundUser.branchIds,
        isBranchManager: foundUser.isBranchManager,
      };
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      toast.success(`Welcome, ${userData.name}!`);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again.");
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
      toast.success("Logged out successfully");
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
      toast.success("Registration successful! You can now log in.");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
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
