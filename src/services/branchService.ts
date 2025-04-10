
import { User } from "@/types";

export interface Branch {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email?: string;
  isActive: boolean;
}

// Mock branch data
const mockBranches: Branch[] = [
  {
    id: "branch-1",
    name: "Downtown Fitness Center",
    address: "123 Main St, Downtown",
    phoneNumber: "+1234567890",
    email: "downtown@musclegarage.com",
    isActive: true
  },
  {
    id: "branch-2",
    name: "Uptown Fitness Center",
    address: "456 High St, Uptown",
    phoneNumber: "+1234567891",
    email: "uptown@musclegarage.com",
    isActive: true
  },
  {
    id: "branch-3",
    name: "Westside Fitness Center",
    address: "789 West St, Westside",
    phoneNumber: "+1234567892",
    email: "westside@musclegarage.com",
    isActive: true
  }
];

export const branchService = {
  /**
   * Get all branches
   */
  getAllBranches: async (): Promise<Branch[]> => {
    // In a real app, this would be an API call
    return Promise.resolve(mockBranches);
  },
  
  /**
   * Get branches that a user has access to
   */
  getUserBranches: async (user: User): Promise<Branch[]> => {
    // In a real app, this would be an API call
    if (user.role === "admin") {
      // Admins can access all branches
      return Promise.resolve(mockBranches);
    } else if (user.branchIds && user.branchIds.length > 0) {
      // Filter branches by user's accessible branch IDs
      return Promise.resolve(
        mockBranches.filter(branch => user.branchIds?.includes(branch.id))
      );
    } else if (user.branchId) {
      // User has access to a single branch
      return Promise.resolve(
        mockBranches.filter(branch => branch.id === user.branchId)
      );
    }
    
    // Default to empty array if no branches are accessible
    return Promise.resolve([]);
  },
  
  /**
   * Check if user can access the specified branch
   */
  canAccessBranch: (user: User, branchId: string): boolean => {
    if (user.role === "admin") {
      return true; // Admins can access all branches
    } else if (user.branchIds && user.branchIds.length > 0) {
      return user.branchIds.includes(branchId);
    } else if (user.branchId) {
      return user.branchId === branchId;
    }
    return false;
  }
};
