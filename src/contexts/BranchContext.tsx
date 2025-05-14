import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

// Rename the imported type to avoid conflict
import { Branch as BranchType } from '@/types/branch';

interface BranchContextProps {
  branches: BranchType[];
  currentBranch: BranchType | null;
  setCurrentBranch: (branch: BranchType) => void;
  isLoading: boolean;
  error: string | null;
  refetchBranches: () => void;
  fetchBranches: () => Promise<BranchType[]>;
  switchBranch: (branchId: string) => void;
  createBranch: (branchData: Partial<BranchType>) => Promise<BranchType | null>;
  updateBranch: (id: string, branchData: Partial<BranchType>) => Promise<BranchType | null>;
  deleteBranch: (id: string) => Promise<boolean>;
}

// Create the context with default values
export const BranchContext = createContext<BranchContextProps>({
  branches: [],
  currentBranch: null,
  setCurrentBranch: () => {},
  isLoading: false,
  error: null,
  refetchBranches: () => {},
  fetchBranches: async () => [],
  switchBranch: () => {},
  createBranch: async () => null,
  updateBranch: async () => null,
  deleteBranch: async () => false,
});

interface BranchProviderProps {
  children: ReactNode;
}

export const BranchProvider: React.FC<BranchProviderProps> = ({ children }) => {
  const [branches, setBranches] = useState<BranchType[]>([]);
  const [currentBranch, setCurrentBranch] = useState<BranchType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  const fetchBranches = useCallback(async () => {
    if (!user || !user.id) {
      setError('User not authenticated');
      setIsLoading(false);
      return [];
    }
    
    try {
      setIsLoading(true);
      setError(null);
  
      // Check if session is valid
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found');
      }
      
      // Get user's branch and accessible branches
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('branch_id, accessible_branch_ids, role')
        .eq('id', user.id)
        .single();
  
      if (profileError) throw profileError;

      // Admin fetches all branches
      // Regular staff fetch only their assigned branch and accessible branches
      let branchQuery = supabase.from('branches').select('*');
      
      if (profileData.role !== 'admin') {
        const accessibleIds = [profileData.branch_id];
        if (profileData.accessible_branch_ids && profileData.accessible_branch_ids.length > 0) {
          accessibleIds.push(...profileData.accessible_branch_ids);
        }
        branchQuery = branchQuery.in('id', accessibleIds);
      }
      
      const { data: branchesData, error: branchesError } = await branchQuery
        .eq('is_active', true)
        .order('name');

      if (branchesError) throw branchesError;

      // Remove this debug logging line
      // console.log('Fetched branches:', branchesData);
      
      setBranches(branchesData || []);

      // Set current branch
      if (branchesData && branchesData.length > 0) {
        // Try to get from local storage first
        const savedBranchId = localStorage.getItem('currentBranchId');
        const savedBranch = savedBranchId 
          ? branchesData.find(b => b.id === savedBranchId)
          : null;
        
        // Default to user's primary branch if no saved branch or saved branch not found
        const defaultBranch = savedBranch || branchesData.find(b => b.id === profileData.branch_id) || branchesData[0];
        setCurrentBranch(defaultBranch);
      }
      
      return branchesData || [];
    } catch (err) {
      console.error('Error fetching branches:', err);
      
      // More specific error messages
      if (err.message?.includes('fetch')) {
        setError('Network error: Unable to connect to database');
      } else if (err.code === 'PGRST301') {
        setError('Authentication error: Please log in again');
      } else {
        setError(err.message || 'Failed to load branches');
      }
      
      // Move toast to useEffect to avoid React state updates during render
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]); // <-- Added comma and dependency array here

  // Use an effect to show toast notifications when error state changes
  useEffect(() => {
    if (error) {
      toast.error('Failed to load branch information');
    }
  }, [error]);

  const handleSetCurrentBranch = (branch: BranchType) => {
    console.log('Setting current branch:', branch); // Add this line
    setCurrentBranch(branch);
    localStorage.setItem('currentBranchId', branch.id);
    // Verify it was saved
    console.log('Saved to localStorage:', localStorage.getItem('currentBranchId')); // Add this line
  };

  const switchBranch = useCallback((branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      handleSetCurrentBranch(branch);
    } else {
      console.error(`Branch with ID ${branchId} not found`);
      toast.error('Selected branch not found');
    }
  }, [branches]);

  // Add implementation for createBranch
  const createBranch = async (branchData: Partial<BranchType>): Promise<BranchType | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: createError } = await supabase
        .from('branches')
        .insert([branchData])
        .select()
        .single();
      
      if (createError) throw createError;
      
      // Refresh branch list
      fetchBranches();
      
      return data;
    } catch (err: any) {
      console.error('Error creating branch:', err);
      setError(err.message || 'Failed to create branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Add implementation for updateBranch
  const updateBranch = async (id: string, branchData: Partial<BranchType>): Promise<BranchType | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('branches')
        .update(branchData)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Refresh branch list
      fetchBranches();
      
      // If we're updating the current branch, update the current branch state
      if (currentBranch && currentBranch.id === id) {
        setCurrentBranch({ ...currentBranch, ...branchData });
      }
      
      return data;
    } catch (err: any) {
      console.error('Error updating branch:', err);
      setError(err.message || 'Failed to update branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Add implementation for deleteBranch
  const deleteBranch = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      // Remove branch from state
      setBranches(branches.filter(branch => branch.id !== id));
      
      // If we deleted the current branch, set current branch to the first available branch
      if (currentBranch && currentBranch.id === id && branches.length > 1) {
        const newCurrentBranch = branches.find(branch => branch.id !== id);
        if (newCurrentBranch) {
          setCurrentBranch(newCurrentBranch);
        } else {
          setCurrentBranch(null);
        }
      }
      
      return true;
    } catch (err: any) {
      console.error('Error deleting branch:', err);
      setError(err.message || 'Failed to delete branch');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching branches...'); // Add this line
      fetchBranches().then(branchesData => {
        console.log('Branches fetched:', branchesData?.length || 0); // Add this line
        // Log the current branch after fetching
        console.log('Current branch after fetch:', currentBranch); // Add this line
      });
    }
  }, [user, fetchBranches]); // Add fetchBranches to dependencies

  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        setCurrentBranch: handleSetCurrentBranch,
        isLoading,
        error,
        refetchBranches: fetchBranches,
        fetchBranches,
        switchBranch,
        createBranch,
        updateBranch,
        deleteBranch,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

// Custom hook to use branch context
export const useBranch = () => {
  const context = React.useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
