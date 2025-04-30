
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranchId: (id: string) => void;
  loading: boolean;
  refreshBranches: () => Promise<void>;
}

const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  setCurrentBranchId: () => {},
  loading: true,
  refreshBranches: async () => {},
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBranches = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      if (data) {
        setBranches(data);
        
        // Set default branch if no branch is currently selected
        const storedBranchId = localStorage.getItem('currentBranchId');
        if (!currentBranch && data.length > 0) {
          const defaultBranch = storedBranchId 
            ? data.find(b => b.id === storedBranchId) 
            : data[0];
          
          if (defaultBranch) {
            setCurrentBranch(defaultBranch);
            localStorage.setItem('currentBranchId', defaultBranch.id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [user]);

  const setCurrentBranchId = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      localStorage.setItem('currentBranchId', branchId);
      toast.success(`Switched to ${branch.name} branch`);
    }
  };

  const refreshBranches = async () => {
    setLoading(true);
    await fetchBranches();
  };

  return (
    <BranchContext.Provider
      value={{ branches, currentBranch, setCurrentBranchId, loading, refreshBranches }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
