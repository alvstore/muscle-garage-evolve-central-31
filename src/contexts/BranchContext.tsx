
import { createContext, useEffect, useState, ReactNode, useRef } from 'react';
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
  const { createBranch, updateBranch } = useBranchOperations();
  
  // Reference to previous branch ID to prevent duplicate notifications
  const previousBranchIdRef = useRef<string | null>(null);

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
        // If primaryBranchId is not found, default to first branch
        const primaryBranch = primaryBranchId 
          ? formattedBranches.find(b => b.id === primaryBranchId) 
          : formattedBranches[0];
        
        if (primaryBranch) {
          // When initializing or switching branches
          if (!currentBranch || (primaryBranchId && primaryBranchId !== previousBranchIdRef.current)) {
            setCurrentBranch(primaryBranch);
            previousBranchIdRef.current = primaryBranch.id;
            
            // Only show toast if we're actually switching branches
            if (currentBranch && primaryBranchId !== previousBranchIdRef.current) {
              toast.success(`Switched to ${primaryBranch.name}`);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branch data');
      // Only show toast if we have branches but failed to load them
      if (formattedBranches.length > 0) {
        toast.error('Failed to load branch data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    
    if (branch) {
      // Only update if actually switching to a different branch
      if (currentBranch?.id !== branch.id) {
        // Prevent multiple updates by checking if we're already in the process
        if (previousBranchIdRef.current !== branch.id) {
          setCurrentBranch(branch);
          previousBranchIdRef.current = branch.id;
          
          // Debounce the toast message
          setTimeout(() => {
            toast.success(`Switched to ${branch.name}`);
          }, 100);
        }
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (user) {
      // Only fetch branches if we don't have any branches loaded
      if (!branches.length) {
        fetchBranches();
      }
      
      // Check if we need to update the current branch based on user's branch_id
      const userBranchId = user.branch_id;
      if (userBranchId && previousBranchIdRef.current !== userBranchId) {
        const branch = branches.find(b => b.id === userBranchId);
        if (branch) {
          setCurrentBranch(branch);
          previousBranchIdRef.current = userBranchId;
        }
      }
    }
  }, [user, branches]);

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
