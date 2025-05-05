
import React, { createContext, useState, useEffect, ReactNode } from 'react';
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
  isActive: boolean; // Make this required, not optional
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
  fetchBranches: () => Promise<Branch[]>;  // Uncomment this line
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

  const fetchBranches = async () => {
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
      }
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
      
      toast.error('Failed to load branch information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetCurrentBranch = (branch: Branch) => {
    setCurrentBranch(branch);
    localStorage.setItem('currentBranchId', branch.id);
  };

  useEffect(() => {
    if (user) {
      fetchBranches();
    }
  }, [user]);

  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        setCurrentBranch: handleSetCurrentBranch,
        isLoading,
        error,
        refetchBranches: fetchBranches,
        fetchBranches, // Add this line
        // You also need to implement these methods or remove them from the interface
        switchBranch: (branchId) => {
          const branch = branches.find(b => b.id === branchId);
          if (branch) handleSetCurrentBranch(branch);
        },
        createBranch: async () => null, // Implement or remove from interface
        updateBranch: async () => null, // Implement or remove from interface
        deleteBranch: async () => false, // Implement or remove from interface
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};
