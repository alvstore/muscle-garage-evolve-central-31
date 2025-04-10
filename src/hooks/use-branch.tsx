
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branch } from '@/types/branch';
import { useAuth } from './use-auth';

// Mock data for branches
const mockBranches: Branch[] = [
  {
    id: "branch1",
    name: "Downtown Fitness Center",
    address: "123 Main St, Downtown",
    phone: "555-1234",
    email: "downtown@musclegarage.com",
    manager: "John Miller",
    managerId: "user5",
    isActive: true,
    createdAt: "2023-01-15T08:00:00Z",
    updatedAt: "2023-05-20T14:30:00Z",
    maxCapacity: 200,
    openingHours: "06:00",
    closingHours: "22:00"
  },
  {
    id: "branch2",
    name: "Westside Gym",
    address: "456 West Blvd, Westside",
    phone: "555-5678",
    email: "westside@musclegarage.com",
    manager: "Sarah Johnson",
    managerId: "user8",
    isActive: true,
    createdAt: "2023-02-10T09:30:00Z",
    updatedAt: "2023-06-15T11:20:00Z",
    maxCapacity: 150,
    openingHours: "05:00",
    closingHours: "23:00"
  },
  {
    id: "branch3",
    name: "Northside Fitness",
    address: "789 North Ave, Northside",
    phone: "555-9012",
    email: "northside@musclegarage.com",
    manager: "Michael Thompson",
    managerId: "user12",
    isActive: true,
    createdAt: "2023-03-05T10:15:00Z",
    updatedAt: "2023-07-10T16:45:00Z",
    maxCapacity: 180,
    openingHours: "06:30",
    closingHours: "21:30"
  }
];

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  isLoading: boolean;
  fetchBranches: () => Promise<Branch[]>;
}

const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  setCurrentBranch: () => {},
  isLoading: false,
  fetchBranches: async () => [],
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const fetchBranches = async (): Promise<Branch[]> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      setBranches(mockBranches);
      return mockBranches;
    } catch (error) {
      console.error("Error fetching branches:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const initializeBranches = async () => {
      const branchList = await fetchBranches();
      
      // Load last selected branch from localStorage if available
      const savedBranchId = localStorage.getItem('currentBranchId');
      const savedBranch = savedBranchId ? branchList.find(b => b.id === savedBranchId) : null;
      
      if (savedBranch) {
        setCurrentBranch(savedBranch);
      } else if (branchList.length > 0) {
        // Default to first branch if no saved preference
        setCurrentBranch(branchList[0]);
      }
    };
    
    if (user) {
      initializeBranches();
    }
  }, [user]);
  
  const handleSetCurrentBranch = (branch: Branch) => {
    setCurrentBranch(branch);
    localStorage.setItem('currentBranchId', branch.id);
  };
  
  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        setCurrentBranch: handleSetCurrentBranch,
        isLoading,
        fetchBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
