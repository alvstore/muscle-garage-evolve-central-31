
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Branch } from '@/types/branch';

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranchId: (id: string) => void;
  loading: boolean;
  isLoading: boolean; // Adding for compatibility
  refreshBranches: () => Promise<void>;
  fetchBranches: () => Promise<void>; // Adding for compatibility
  switchBranch: (id: string) => void; // Adding for compatibility
  createBranch: (branch: Omit<Branch, 'id'>) => Promise<Branch | null>;
  updateBranch: (id: string, branch: Partial<Branch>) => Promise<Branch | null>;
}

const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  setCurrentBranchId: () => {},
  loading: true,
  isLoading: true,
  refreshBranches: async () => {},
  fetchBranches: async () => {},
  switchBranch: () => {},
  createBranch: async () => null,
  updateBranch: async () => null,
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

  const switchBranch = (branchId: string) => {
    setCurrentBranchId(branchId);
  };

  const refreshBranches = async () => {
    setLoading(true);
    await fetchBranches();
  };

  const createBranch = async (branch: Omit<Branch, 'id'>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert(branch)
        .select()
        .single();

      if (error) throw error;
      
      const newBranches = [...branches, data as Branch];
      setBranches(newBranches);
      toast.success("Branch created successfully");
      return data as Branch;
    } catch (err: any) {
      console.error("Error creating branch:", err);
      toast.error(err.message || "Failed to create branch");
      return null;
    }
  };

  const updateBranch = async (id: string, branch: Partial<Branch>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .update(branch)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedBranches = branches.map(b => 
        b.id === id ? { ...b, ...data } as Branch : b
      );
      setBranches(updatedBranches);
      
      // Update current branch if it's the one being updated
      if (currentBranch?.id === id) {
        setCurrentBranch({ ...currentBranch, ...data } as Branch);
      }
      
      toast.success("Branch updated successfully");
      return data as Branch;
    } catch (err: any) {
      console.error("Error updating branch:", err);
      toast.error(err.message || "Failed to update branch");
      return null;
    }
  };

  return (
    <BranchContext.Provider
      value={{ 
        branches, 
        currentBranch, 
        setCurrentBranchId,
        loading,
        isLoading: loading,
        refreshBranches,
        fetchBranches,
        switchBranch,
        createBranch,
        updateBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
