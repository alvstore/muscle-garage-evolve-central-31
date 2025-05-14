
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch } from '@/types';

export interface BranchContextType {
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch | null) => void;
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  isLoading: boolean;
  fetchBranches: () => Promise<Branch[]>;
  createBranch: (branchData: Partial<Branch>) => Promise<Branch | null>;
  updateBranch: (id: string, branchData: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
}

const BranchContext = createContext<BranchContextType>({
  currentBranch: null,
  setCurrentBranch: () => {},
  branches: [],
  setBranches: () => {},
  isLoading: false,
  fetchBranches: async () => [],
  createBranch: async () => null,
  updateBranch: async () => null,
  deleteBranch: async () => false
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

  // Mock function to create a branch
  const createBranch = async (branchData: Partial<Branch>): Promise<Branch | null> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const newBranch: Branch = {
        id: Math.random().toString(),
        name: branchData.name || 'New Branch',
        address: branchData.address || '',
        city: branchData.city || '',
        state: branchData.state || '',
        country: branchData.country || 'USA',
        email: branchData.email || '',
        phone: branchData.phone || '',
        is_active: branchData.is_active !== undefined ? branchData.is_active : true,
        manager_id: branchData.manager_id || null,
        branch_code: branchData.branch_code || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setBranches([...branches, newBranch]);
      return newBranch;
    } catch (error) {
      console.error('Error creating branch:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to update a branch
  const updateBranch = async (id: string, branchData: Partial<Branch>): Promise<Branch | null> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const updatedBranches = branches.map(branch => {
        if (branch.id === id) {
          return {
            ...branch,
            ...branchData,
            updated_at: new Date().toISOString()
          };
        }
        return branch;
      });
      
      setBranches(updatedBranches);
      const updatedBranch = updatedBranches.find(branch => branch.id === id);
      return updatedBranch || null;
    } catch (error) {
      console.error('Error updating branch:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to delete a branch
  const deleteBranch = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const filteredBranches = branches.filter(branch => branch.id !== id);
      setBranches(filteredBranches);
      
      if (currentBranch?.id === id) {
        setCurrentBranch(filteredBranches[0] || null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting branch:', error);
      return false;
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
        fetchBranches,
        createBranch,
        updateBranch,
        deleteBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);

export default BranchContext;
