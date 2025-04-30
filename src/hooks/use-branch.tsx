import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { Branch } from '@/types/branch';

interface BranchContextData {
  currentBranch: Branch | null;
  availableBranches: Branch[];
  branches: Branch[];
  isLoading: boolean;
  error: string | null;
  switchBranch: (branchId: string) => void;
  refreshBranches: () => Promise<void>;
  createBranch: (branchData: Omit<Branch, 'id'>) => Promise<Branch | null>;
  updateBranch: (id: string, branchData: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
}

const BranchContext = createContext<BranchContextData>({
  currentBranch: null,
  availableBranches: [],
  branches: [],
  isLoading: false,
  error: null,
  switchBranch: () => {},
  refreshBranches: async () => {},
  createBranch: async () => null,
  updateBranch: async () => null,
  deleteBranch: async () => false,
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, updateUserBranch } = useAuth();

  const fetchBranches = async (): Promise<void> => {
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
        
        if (data.length > 0 && !currentBranch) {
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

  const createBranch = async (branchData: Omit<Branch, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([branchData])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        await fetchBranches();
        return data as Branch;
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
      const { data, error } = await supabase
        .from('branches')
        .update(branchData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        await fetchBranches();
        return data as Branch;
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
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchBranches();
      return true;
    } catch (error: any) {
      console.error('Error deleting branch:', error);
      toast.error('Failed to delete branch');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBranches();

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
      
      if (updateUserBranch) {
        updateUserBranch(branchId).catch(err => {
          console.error('Error updating user branch:', err);
        });
      }
      
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
        branches: availableBranches,
        isLoading,
        error,
        switchBranch,
        refreshBranches: fetchBranches,
        createBranch,
        updateBranch,
        deleteBranch,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
