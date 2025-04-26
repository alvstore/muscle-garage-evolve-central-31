
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  is_active: boolean;
}

interface BranchContextData {
  currentBranch: Branch | null;
  availableBranches: Branch[];
  isLoading: boolean;
  error: string | null;
  switchBranch: (branchId: string) => void;
  refreshBranches: () => Promise<void>;
}

const BranchContext = createContext<BranchContextData>({
  currentBranch: null,
  availableBranches: [],
  isLoading: false,
  error: null,
  switchBranch: () => {},
  refreshBranches: async () => {},
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchBranches = async () => {
    if (!user) {
      setAvailableBranches([]);
      setCurrentBranch(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let query = supabase.from('branches').select('*');

      // If not admin, limit to accessible branches
      if (user.role !== 'admin' && profile?.accessible_branch_ids) {
        query = query.in('id', profile.accessible_branch_ids);
      }

      if (user.role !== 'admin' && profile?.branch_id) {
        query = query.eq('id', profile.branch_id);
      }

      const { data, error } = await query.order('name');

      if (error) {
        console.error('Error fetching branches:', error);
        setError('Failed to load branches');
        return;
      }

      if (data) {
        setAvailableBranches(data);
        
        // If we have branches but no current branch, set the first one
        if (data.length > 0 && !currentBranch) {
          // Prioritize user's primary branch if it exists
          const primaryBranch = profile?.branch_id ? 
            data.find(b => b.id === profile.branch_id) : null;
            
          setCurrentBranch(primaryBranch || data[0]);
          localStorage.setItem('currentBranchId', primaryBranch?.id || data[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error in fetchBranches:', err);
      setError(err.message || 'Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBranches();

      // Try to restore previously selected branch from localStorage
      const savedBranchId = localStorage.getItem('currentBranchId');
      if (savedBranchId) {
        switchBranch(savedBranchId);
      }
    }
  }, [user, user?.id]);

  const switchBranch = (branchId: string) => {
    const branch = availableBranches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      localStorage.setItem('currentBranchId', branchId);
      toast.success(`Switched to ${branch.name}`);
    } else {
      toast.error('Branch not found');
    }
  };

  return (
    <BranchContext.Provider
      value={{
        currentBranch,
        availableBranches,
        isLoading,
        error,
        switchBranch,
        refreshBranches: fetchBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
