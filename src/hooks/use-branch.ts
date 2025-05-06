
import { createContext, ReactNode, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { usePermissions } from './use-permissions';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  manager?: string;
  phone?: string;
  email?: string;
  openingHours?: string;
  closingHours?: string;
  created_at?: string;
  updated_at?: string;
  isActive: boolean;
}

export interface BranchContextProps {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  isLoading: boolean;
  error: string | null;
  fetchBranches: () => Promise<void>;
  createBranch: (newBranch: Partial<Branch>) => Promise<Branch | null>;
  updateBranch: (id: string, updates: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
  switchBranch: (branchId: string) => void;
}

const BranchContext = createContext<BranchContextProps | undefined>(undefined);

interface BranchProviderProps {
  children: ReactNode;
}

export const BranchProvider: React.FC<BranchProviderProps> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranchState] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { isAdmin, canViewAllBranches } = usePermissions();

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase.from('branches').select('*');
      
      // Non-admin users should only see branches they have access to
      if (!canViewAllBranches()) {
        // Get the user's profile to check accessible branches
        const { data: profile } = await supabase
          .from('profiles')
          .select('branch_id, accessible_branch_ids')
          .eq('id', user?.id)
          .single();
          
        if (profile) {
          const accessibleIds = [];
          
          // Add primary branch
          if (profile.branch_id) {
            accessibleIds.push(profile.branch_id);
          }
          
          // Add any additional accessible branches
          if (profile.accessible_branch_ids && profile.accessible_branch_ids.length > 0) {
            accessibleIds.push(...profile.accessible_branch_ids);
          }
          
          if (accessibleIds.length > 0) {
            query = query.in('id', accessibleIds);
          } else {
            // No branches accessible to this user
            setBranches([]);
            setIsLoading(false);
            return;
          }
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedBranches = data.map(branch => ({
        ...branch,
        isActive: branch.isActive !== undefined ? branch.isActive : true
      }));
      
      setBranches(formattedBranches);
      
      // Set current branch if not already set and branches are available
      if (!currentBranch && formattedBranches.length > 0) {
        // Try to get saved branch from local storage
        const savedBranchId = localStorage.getItem('currentBranchId');
        
        if (savedBranchId) {
          const savedBranch = formattedBranches.find(b => b.id === savedBranchId);
          if (savedBranch) {
            setCurrentBranchState(savedBranch);
          } else {
            setCurrentBranchState(formattedBranches[0]);
          }
        } else {
          setCurrentBranchState(formattedBranches[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
      toast.error('Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };

  const createBranch = async (newBranch: Partial<Branch>): Promise<Branch | null> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('branches')
        .insert([{ ...newBranch, isActive: true }])
        .select()
        .single();
      
      if (error) throw error;
      
      const formattedBranch = {
        ...data,
        isActive: data.isActive !== undefined ? data.isActive : true
      } as Branch;
      
      setBranches(prev => [...prev, formattedBranch]);
      toast.success('Branch created successfully');
      
      return formattedBranch;
    } catch (err) {
      console.error('Error creating branch:', err);
      setError(err instanceof Error ? err.message : 'Failed to create branch');
      toast.error('Failed to create branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBranch = async (id: string, updates: Partial<Branch>): Promise<Branch | null> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('branches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const formattedBranch = {
        ...data,
        isActive: data.isActive !== undefined ? data.isActive : true
      } as Branch;
      
      setBranches(prev => prev.map(branch => 
        branch.id === id ? formattedBranch : branch
      ));
      
      // Update current branch if it's the one being updated
      if (currentBranch?.id === id) {
        setCurrentBranchState(formattedBranch);
      }
      
      toast.success('Branch updated successfully');
      
      return formattedBranch;
    } catch (err) {
      console.error('Error updating branch:', err);
      setError(err instanceof Error ? err.message : 'Failed to update branch');
      toast.error('Failed to update branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBranch = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBranches(prev => prev.filter(branch => branch.id !== id));
      
      // If deleted current branch, select a new one
      if (currentBranch?.id === id) {
        const remainingBranches = branches.filter(branch => branch.id !== id);
        if (remainingBranches.length > 0) {
          setCurrentBranchState(remainingBranches[0]);
          localStorage.setItem('currentBranchId', remainingBranches[0].id);
        } else {
          setCurrentBranchState(null);
          localStorage.removeItem('currentBranchId');
        }
      }
      
      toast.success('Branch deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting branch:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete branch');
      toast.error('Failed to delete branch');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const switchBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranchState(branch);
      localStorage.setItem('currentBranchId', branchId);
      toast.success(`Switched to ${branch.name}`);
    }
  };

  const setCurrentBranch = (branch: Branch) => {
    setCurrentBranchState(branch);
    localStorage.setItem('currentBranchId', branch.id);
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchBranches();
    }
  }, [user]);

  const value = useMemo(
    () => ({
      branches,
      currentBranch,
      setCurrentBranch,
      isLoading,
      error,
      fetchBranches,
      createBranch,
      updateBranch,
      deleteBranch,
      switchBranch
    }),
    [branches, currentBranch, isLoading, error]
  );

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
