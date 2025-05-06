
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  managerId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  
  // Additional properties needed by components
  phone?: string;
  email?: string;
  manager?: string;
  maxCapacity?: number;
  openingHours?: string;
  closingHours?: string;
  region?: string;
  branchCode?: string;
  taxRate?: number;
  timezone?: string;
}

interface BranchContextProps {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  isLoading: boolean;
  error: string | null;
  refetchBranches: () => void;
  fetchBranches: () => Promise<Branch[]>;
  switchBranch: (branchId: string) => void;
  createBranch: (branchData: Partial<Branch>) => Promise<Branch | null>;
  updateBranch: (id: string, branchData: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
}

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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
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
        localStorage.setItem('currentBranchId', defaultBranch.id);
      }
      
      return branchesData || [];
    } catch (err: any) {
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
  }, [user]);

  // Use an effect to show toast notifications when error state changes
  useEffect(() => {
    if (error) {
      toast.error('Failed to load branch information');
    }
  }, [error]);

  const handleSetCurrentBranch = (branch: Branch) => {
    console.log('Setting current branch:', branch);
    setCurrentBranch(branch);
    localStorage.setItem('currentBranchId', branch.id);
    // Verify it was saved
    console.log('Saved to localStorage:', localStorage.getItem('currentBranchId')); 
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

  const createBranch = async (branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([{ ...branchData, is_active: true }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchBranches(); // Refresh branch list
      toast.success('Branch created successfully');
      return data as Branch;
    } catch (err: any) {
      console.error('Error creating branch:', err);
      toast.error(err.message || 'Failed to create branch');
      return null;
    }
  };

  const updateBranch = async (id: string, branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .update(branchData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchBranches(); // Refresh branch list
      toast.success('Branch updated successfully');
      return data as Branch;
    } catch (err: any) {
      console.error('Error updating branch:', err);
      toast.error(err.message || 'Failed to update branch');
      return null;
    }
  };

  const deleteBranch = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('branches')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      await fetchBranches(); // Refresh branch list
      toast.success('Branch deactivated successfully');
      return true;
    } catch (err: any) {
      console.error('Error deactivating branch:', err);
      toast.error(err.message || 'Failed to deactivate branch');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching branches...');
      fetchBranches().then(branchesData => {
        console.log('Branches fetched:', branchesData?.length || 0);
        console.log('Current branch after fetch:', currentBranch);
      });
    }
  }, [user, fetchBranches]);

  // Create a value object with all context values
  const contextValue = {
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
    deleteBranch
  };

  return (
    <BranchContext.Provider value={contextValue}>
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
