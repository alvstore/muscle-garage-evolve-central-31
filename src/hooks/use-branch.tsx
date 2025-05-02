
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/types/branch';
import { toast } from 'sonner';

export interface BranchContextProps {
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;
  error: Error | null;
  fetchBranches: () => Promise<Branch[]>;
  switchBranch: (branchId: string) => void;
  createBranch: (branchData: Partial<Branch>) => Promise<Branch | null>;
  updateBranch: (id: string, branchData: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
}

const BranchContext = createContext<BranchContextProps>({
  branches: [],
  currentBranch: null,
  isLoading: false,
  error: null,
  fetchBranches: async () => [],
  switchBranch: () => {},
  createBranch: async () => null,
  updateBranch: async () => null,
  deleteBranch: async () => false
});

interface BranchProviderProps {
  children: ReactNode;
}

export const BranchProvider: React.FC<BranchProviderProps> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch all branches from Supabase
  const fetchBranches = async (): Promise<Branch[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      const branchesWithDefaults = data.map(branch => ({
        ...branch,
        isActive: branch.is_active ?? true
      }));
      
      setBranches(branchesWithDefaults);
      return branchesWithDefaults;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Error fetching branches:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Switch to a different branch
  const switchBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId) || null;
    if (branch) {
      setCurrentBranch(branch);
      localStorage.setItem('selectedBranchId', branchId);
      toast.success(`Switched to ${branch.name} branch`);
    } else {
      toast.error('Branch not found');
    }
  };
  
  // Create a new branch
  const createBranch = async (branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([branchData])
        .select()
        .single();
        
      if (error) throw error;
      
      const newBranch = { ...data, isActive: data.is_active ?? true };
      setBranches(prev => [...prev, newBranch]);
      toast.success('Branch created successfully');
      return newBranch;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Error creating branch:', error);
      toast.error('Failed to create branch');
      return null;
    }
  };
  
  // Update an existing branch
  const updateBranch = async (id: string, branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      // Map any custom props back to DB column names
      const dbData = {
        ...branchData,
        is_active: branchData.isActive
      };
      
      const { data, error } = await supabase
        .from('branches')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      const updatedBranch = { ...data, isActive: data.is_active ?? true };
      
      setBranches(prev => 
        prev.map(branch => branch.id === id ? updatedBranch : branch)
      );
      
      // If we're updating the current branch, update it in state
      if (currentBranch?.id === id) {
        setCurrentBranch(updatedBranch);
      }
      
      toast.success('Branch updated successfully');
      return updatedBranch;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Error updating branch:', error);
      toast.error('Failed to update branch');
      return null;
    }
  };
  
  // Delete a branch
  const deleteBranch = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setBranches(prev => prev.filter(branch => branch.id !== id));
      
      // If we're deleting the current branch, reset currentBranch
      if (currentBranch?.id === id) {
        setCurrentBranch(null);
        localStorage.removeItem('selectedBranchId');
      }
      
      toast.success('Branch deleted successfully');
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Error deleting branch:', error);
      toast.error('Failed to delete branch');
      return false;
    }
  };
  
  // Initialize branches
  useEffect(() => {
    fetchBranches().then(fetchedBranches => {
      // Check for saved branch preference
      const savedBranchId = localStorage.getItem('selectedBranchId');
      
      if (savedBranchId) {
        const savedBranch = fetchedBranches.find(b => b.id === savedBranchId);
        if (savedBranch) {
          setCurrentBranch(savedBranch);
          return;
        }
      }
      
      // Default to first branch if no saved preference or saved branch not found
      if (fetchedBranches.length > 0) {
        setCurrentBranch(fetchedBranches[0]);
      }
    });
  }, []);
  
  return (
    <BranchContext.Provider value={{
      branches,
      currentBranch,
      isLoading,
      error,
      fetchBranches,
      switchBranch,
      createBranch,
      updateBranch,
      deleteBranch
    }}>
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
