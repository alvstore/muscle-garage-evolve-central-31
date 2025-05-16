
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { branchService } from '@/services';
import { Branch } from '@/types/branch';
import { useAuth } from './use-auth';

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch | null) => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createBranch: (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => Promise<Branch | null>;
  updateBranch: (branchId: string, updates: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (branchId: string) => Promise<boolean>;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchBranches = useCallback(async () => {
    if (!user) {
      setBranches([]);
      setCurrentBranch(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const branchesData = await branchService.getBranches();
      setBranches(branchesData);
      
      // If no current branch is selected, select first active branch
      if (!currentBranch && branchesData.length > 0) {
        const defaultBranch = branchesData.find(b => b.is_active) || branchesData[0];
        setCurrentBranch(defaultBranch);
      }
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch branches'));
      setIsLoading(false);
    }
  }, [user, currentBranch]);

  // Effect to fetch branches on mount and auth changes
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const createBranch = async (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>): Promise<Branch | null> => {
    try {
      const newBranch = await branchService.createBranch(branch);
      if (newBranch) {
        setBranches(prev => [...prev, newBranch]);
        
        // If this is the first branch, set it as current
        if (branches.length === 0) {
          setCurrentBranch(newBranch);
        }
      }
      return newBranch;
    } catch (err) {
      console.error('Error creating branch:', err);
      return null;
    }
  };

  const updateBranch = async (branchId: string, updates: Partial<Branch>): Promise<Branch | null> => {
    try {
      const updatedBranch = await branchService.updateBranch(branchId, updates);
      if (updatedBranch) {
        setBranches(prev => prev.map(b => b.id === branchId ? updatedBranch : b));
        
        // If current branch was updated, update it here too
        if (currentBranch?.id === branchId) {
          setCurrentBranch(updatedBranch);
        }
      }
      return updatedBranch;
    } catch (err) {
      console.error('Error updating branch:', err);
      return null;
    }
  };

  const deleteBranch = async (branchId: string): Promise<boolean> => {
    try {
      const success = await branchService.deleteBranch(branchId);
      if (success) {
        setBranches(prev => prev.filter(b => b.id !== branchId));
        
        // If current branch was deleted, select another
        if (currentBranch?.id === branchId) {
          const nextBranch = branches.find(b => b.id !== branchId);
          setCurrentBranch(nextBranch || null);
        }
      }
      return success;
    } catch (err) {
      console.error('Error deleting branch:', err);
      return false;
    }
  };

  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        setCurrentBranch,
        isLoading,
        error,
        refetch: fetchBranches,
        createBranch,
        updateBranch,
        deleteBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranches = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranches must be used within a BranchProvider');
  }
  return context;
};
