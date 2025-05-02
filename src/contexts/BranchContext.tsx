
import { createContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Branch } from '@/types/branch';
import { fetchUserBranches, formatBranchData } from '@/utils/branchOperations';
import { useBranchOperations } from '@/hooks/useBranchOperations';

interface BranchContextData {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  isLoading: boolean;
  error: string | null;
  switchBranch: (branchId: string) => boolean;
  fetchBranches: () => Promise<void>;
  createBranch: (branch: Omit<Branch, 'id'>) => Promise<Branch | null>;
  updateBranch: (id: string, branch: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
}

export const BranchContext = createContext<BranchContextData>({
  branches: [],
  currentBranch: null,
  setCurrentBranch: () => {},
  isLoading: true,
  error: null,
  switchBranch: () => false,
  fetchBranches: async () => {},
  createBranch: async () => null,
  updateBranch: async () => null,
  deleteBranch: async () => false,
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, updateUserBranch } = useAuth();
  const { createBranch: createBranchOp, updateBranch: updateBranchOp } = useBranchOperations();
  
  // Reference to previous branch ID to prevent duplicate notifications
  const previousBranchIdRef = useRef<string | null>(null);
  // Use an initialized flag to prevent infinite re-renders
  const initializedRef = useRef<boolean>(false);

  const fetchBranches = useCallback(async (): Promise<void> => {
    if (!user) {
      setBranches([]);
      setCurrentBranch(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { branchesData, primaryBranchId } = await fetchUserBranches(user.id);
      const formattedBranches = branchesData.map(formatBranchData);
      
      setBranches(formattedBranches);

      if (formattedBranches.length > 0) {
        // If primaryBranchId is not found, default to first branch
        const primaryBranch = primaryBranchId 
          ? formattedBranches.find(b => b.id === primaryBranchId) 
          : formattedBranches[0];
        
        if (primaryBranch && (!currentBranch || (primaryBranchId && primaryBranchId !== previousBranchIdRef.current))) {
          setCurrentBranch(primaryBranch);
          previousBranchIdRef.current = primaryBranch.id;
          
          // Only show toast if we're actually switching branches and not on initial load
          if (currentBranch && initializedRef.current && primaryBranchId !== previousBranchIdRef.current) {
            toast.success(`Switched to ${primaryBranch.name}`);
          }
          
          // Save to localStorage
          localStorage.setItem('currentBranchId', primaryBranch.id);
        }
      }
      
      // Mark as initialized after the first successful fetch
      initializedRef.current = true;
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setError(err.message || 'Failed to load branch data');
    } finally {
      setIsLoading(false);
    }
  }, [user, currentBranch]);

  const createBranch = async (branchData: Omit<Branch, 'id'>) => {
    try {
      const newBranch = await createBranchOp(branchData);
      if (newBranch) {
        await fetchBranches();
        return newBranch;
      }
      return null;
    } catch (error: any) {
      console.error('Error creating branch:', error);
      toast.error('Failed to create branch');
      return null;
    }
  };

  const updateBranch = async (id: string, branchData: Partial<Branch>) => {
    try {
      const updatedBranch = await updateBranchOp(id, branchData);
      if (updatedBranch) {
        // If we're updating the current branch, update the state
        if (currentBranch?.id === id) {
          setCurrentBranch(prevBranch => ({
            ...prevBranch!,
            ...updatedBranch
          }));
        }
        await fetchBranches();
        return updatedBranch;
      }
      return null;
    } catch (error: any) {
      console.error('Error updating branch:', error);
      toast.error('Failed to update branch');
      return null;
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      // Logic for deleting a branch would go here
      await fetchBranches();
      return true;
    } catch (error: any) {
      console.error('Error deleting branch:', error);
      toast.error('Failed to delete branch');
      return false;
    }
  };

  const switchBranch = useCallback((branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    
    if (branch) {
      // Only update if actually switching to a different branch
      if (currentBranch?.id !== branch.id) {
        // Prevent multiple updates by checking if we're already in the process
        if (previousBranchIdRef.current !== branch.id) {
          setCurrentBranch(branch);
          previousBranchIdRef.current = branch.id;
          localStorage.setItem('currentBranchId', branch.id);
          
          // Only show toast if already initialized
          if (initializedRef.current) {
            toast.success(`Switched to ${branch.name}`);
          }
        }
      }
      return true;
    }
    return false;
  }, [branches, currentBranch]);

  useEffect(() => {
    // Only fetch branches once when user loads and when user changes
    if (user && !initializedRef.current) {
      fetchBranches();
    }
  }, [user, fetchBranches]);

  // Handle saved branch from localStorage, but only once on initial load
  useEffect(() => {
    if (user && branches.length > 0 && !currentBranch) {
      const savedBranchId = localStorage.getItem('currentBranchId');
      if (savedBranchId) {
        switchBranch(savedBranchId);
      }
    }
  }, [user, branches, currentBranch, switchBranch]);

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
        updateBranch,
        deleteBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};
