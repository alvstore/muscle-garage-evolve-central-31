
import { toast } from 'sonner';
import { User, UserRole } from '@/types';
import { useAuthState } from './use-auth-state';

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
    avatar: "/admin-avatar.png",
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
    avatar: "/staff-avatar.png",
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
    avatar: "/trainer-avatar.png",
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
    avatar: "/member-avatar.png",
  }
};

export function useAuthActions() {
  const { setUser, setIsLoading } = useAuthState();

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
        avatar: foundUser.avatar,
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
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    
    const userData = JSON.parse(userStr) as User;
    
    const updatedUser = {
      ...userData,
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

  return {
    login,
    logout,
    register,
    updateUserBranch
  };
}
