
import { create } from 'zustand';
import { User } from '@/types';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
}

interface BranchStore {
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;
  selectBranch: (branchId: string) => void;
  fetchBranches: () => Promise<void>;
  fetchUserBranches: (user: User) => Promise<void>;
  updateUserBranch: (user: User, branchId: string) => Promise<void>;
}

// Mock data for branches
const mockBranches: Branch[] = [
  {
    id: 'branch1',
    name: 'Downtown Branch',
    address: '123 Main St, Downtown',
    phone: '555-1234',
    email: 'downtown@example.com',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    isActive: true,
  },
  {
    id: 'branch2',
    name: 'Uptown Branch',
    address: '456 High St, Uptown',
    phone: '555-5678',
    email: 'uptown@example.com',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    isActive: true,
  },
];

export const useBranchStore = create<BranchStore>((set, get) => ({
  branches: [],
  currentBranch: null,
  isLoading: false,
  
  selectBranch: (branchId: string) => {
    const branch = get().branches.find(b => b.id === branchId) || null;
    set({ currentBranch: branch });
  },
  
  fetchBranches: async () => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ branches: mockBranches, isLoading: false });
      
      // Set the first branch as current if none is selected
      if (!get().currentBranch && mockBranches.length > 0) {
        set({ currentBranch: mockBranches[0] });
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      set({ isLoading: false });
    }
  },
  
  fetchUserBranches: async (user: User) => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call filtered by user
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter branches for this user if they have branchIds
      let userBranches = user.branchIds && user.branchIds.length > 0
        ? mockBranches.filter(b => user.branchIds?.includes(b.id))
        : mockBranches;
      
      set({ branches: userBranches, isLoading: false });
      
      // Set user's primary branch as current, or first branch if none
      if (user.primaryBranchId) {
        const primaryBranch = userBranches.find(b => b.id === user.primaryBranchId);
        if (primaryBranch) {
          set({ currentBranch: primaryBranch });
        } else if (userBranches.length > 0) {
          set({ currentBranch: userBranches[0] });
        }
      } else if (userBranches.length > 0) {
        set({ currentBranch: userBranches[0] });
      }
    } catch (error) {
      console.error('Error fetching user branches:', error);
      set({ isLoading: false });
    }
  },
  
  updateUserBranch: async (user: User, branchId: string) => {
    // In a real app, this would update the user's primary branch in the database
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock update successful
      console.log(`Updated ${user.name}'s primary branch to ${branchId}`);
      
      // Update current branch
      const branch = get().branches.find(b => b.id === branchId) || null;
      if (branch) {
        set({ currentBranch: branch });
      }
    } catch (error) {
      console.error('Error updating user branch:', error);
      throw error;
    }
  },
}));

export const useBranch = () => {
  const store = useBranchStore();
  
  return {
    branches: store.branches,
    currentBranch: store.currentBranch,
    isLoading: store.isLoading,
    selectBranch: store.selectBranch,
    fetchBranches: store.fetchBranches,
    fetchUserBranches: store.fetchUserBranches,
    updateUserBranch: async (branchId: string) => {
      // Since we don't have direct access to the user in this hook,
      // we would ideally get the user from authentication context
      // But for simplicity, we'll create a mock user here
      const mockUser: User = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        primaryBranchId: store.currentBranch?.id,
        branchIds: store.branches.map(b => b.id),
      };
      
      await store.updateUserBranch(mockUser, branchId);
    }
  };
};
