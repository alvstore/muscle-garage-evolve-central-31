
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch } from '@/types';

export interface BranchContextType {
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch | null) => void;
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  isLoading: boolean;
  fetchBranches: () => Promise<Branch[]>;
}

const BranchContext = createContext<BranchContextType>({
  currentBranch: null,
  setCurrentBranch: () => {},
  branches: [],
  setBranches: () => {},
  isLoading: false,
  fetchBranches: async () => []
});

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock function to fetch branches - replace with actual implementation
  const fetchBranches = async (): Promise<Branch[]> => {
    setIsLoading(true);
    try {
      // Implement actual API call here
      const branchesData: Branch[] = [
        {
          id: '1',
          name: 'Main Branch',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          email: 'main@example.com',
          phone: '123-456-7890',
          is_active: true,
          manager_id: 'user1',
          branch_code: 'MB001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setBranches(branchesData);
      return branchesData;
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    // Set the first branch as current if available and none is selected
    if (branches.length > 0 && !currentBranch) {
      setCurrentBranch(branches[0]);
    }
  }, [branches, currentBranch]);

  return (
    <BranchContext.Provider 
      value={{ 
        currentBranch, 
        setCurrentBranch, 
        branches, 
        setBranches, 
        isLoading,
        fetchBranches 
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);

export default BranchContext;
