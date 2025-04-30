
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Branch } from '@/types/branch';
import { fetchUserBranches, formatBranchData } from '@/utils/branchOperations';
import { useBranchOperations } from '@/hooks/useBranchOperations';

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  isLoading: boolean;
  error: string | null;
  switchBranch: (branchId: string) => boolean;
  fetchBranches: () => Promise<void>;
  createBranch: (branch: Omit<Branch, 'id'>) => Promise<Branch | null>;
  updateBranch: (id: string, branch: Partial<Branch>) => Promise<Branch | null>;
}

export const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  setCurrentBranch: () => {},
  isLoading: true,
  error: null,
  switchBranch: () => false,
  fetchBranches: async () => {},
  createBranch: async () => null,
  updateBranch: async () => null,
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { createBranch: createBranchOp, updateBranch: updateBranchOp } = useBranchOperations();

  const fetchBranches = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { branchesData, primaryBranchId } = await fetchUserBranches(user.id);
      const formattedBranches = branchesData.map(formatBranchData);
      
      setBranches(formattedBranches);

      if (formattedBranches.length > 0) {
        const primaryBranch = formattedBranches.find(b => b.id === primaryBranchId) || formattedBranches[0];
        setCurrentBranch(primaryBranch);
      }
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branch data');
      toast.error('Failed to load branch data');
    } finally {
      setIsLoading(false);
    }
  };

  const switchBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      return true;
    }
    return false;
  };

  const createBranch = async (branchData: Omit<Branch, 'id'>): Promise<Branch | null> => {
    try {
      const newBranch = await createBranchOp(branchData);
      if (newBranch) {
        setBranches([...branches, newBranch]);
      }
      return newBranch;
    } catch (err: any) {
      console.error('Error creating branch:', err);
      setError('Failed to create branch');
      toast.error('Failed to create branch');
      return null;
    }
  };

  const updateBranch = async (id: string, branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      const updatedBranch = await updateBranchOp(id, branchData);
      if (updatedBranch) {
        setBranches(branches.map(b => b.id === id ? updatedBranch : b));
        
        // Update currentBranch if it's the one being updated
        if (currentBranch?.id === id) {
          setCurrentBranch(updatedBranch);
        }
      }
      return updatedBranch;
    } catch (err: any) {
      console.error('Error updating branch:', err);
      setError('Failed to update branch');
      toast.error('Failed to update branch');
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBranches();
    }
  }, [user]);

  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        setCurrentBranch,
        isLoading,
        error,
        switchBranch,
        fetchBranches,
        createBranch,
        updateBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};
