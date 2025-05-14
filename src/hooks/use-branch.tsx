
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Branch } from '@/types/branch';
import { useAuth } from './use-auth';

// Context type definition
interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;
  error: string;
  fetchBranches: () => Promise<Branch[]>;
  fetchBranchById: (id: string) => Promise<Branch | null>;
  createBranch: (branchData: Omit<Branch, "id">) => Promise<Branch | null>;
  updateBranch: (id: string, branchUpdates: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
  switchBranch: (branchId: string) => void;
}

// Create the context with a default value
const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  isLoading: false,
  error: '',
  fetchBranches: async () => [],
  fetchBranchById: async () => null,
  createBranch: async () => null,
  updateBranch: async () => null,
  deleteBranch: async () => false,
  switchBranch: () => {},
});

// Provider Component
export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Load branches and set current branch on mount
  useEffect(() => {
    if (user) {
      fetchBranches().then(() => {
        // Get saved branch from localStorage or use the first available
        const savedBranchId = localStorage.getItem('currentBranchId');
        if (savedBranchId) {
          fetchBranchById(savedBranchId).then((branch) => {
            if (branch) {
              setCurrentBranch(branch);
            } else if (branches.length > 0) {
              setCurrentBranch(branches[0]);
              localStorage.setItem('currentBranchId', branches[0].id);
            }
          });
        } else if (branches.length > 0) {
          setCurrentBranch(branches[0]);
          localStorage.setItem('currentBranchId', branches[0].id);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch all branches
  const fetchBranches = async (): Promise<Branch[]> => {
    try {
      setIsLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      const branchesData = data as Branch[];
      setBranches(branchesData);
      return branchesData;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch branches';
      console.error('Error fetching branches:', errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a specific branch by ID
  const fetchBranchById = async (id: string): Promise<Branch | null> => {
    try {
      setError('');
      
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Branch;
    } catch (err: any) {
      const errorMessage = err.message || `Failed to fetch branch with ID: ${id}`;
      console.error('Error fetching branch:', errorMessage);
      setError(errorMessage);
      return null;
    }
  };

  // Create a new branch
  const createBranch = async (branchData: Omit<Branch, "id">): Promise<Branch | null> => {
    try {
      setError('');
      
      // Fix isActive to is_active conversion
      if ('isActive' in branchData) {
        (branchData as any).is_active = (branchData as any).isActive;
        delete (branchData as any).isActive;
      }
      
      const { data, error } = await supabase
        .from('branches')
        .insert(branchData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newBranch = data as Branch;
      setBranches(prev => [...prev, newBranch]);
      toast.success('Branch created successfully');
      return newBranch;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create branch';
      console.error('Error creating branch:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  // Update an existing branch
  const updateBranch = async (id: string, branchUpdates: Partial<Branch>): Promise<Branch | null> => {
    try {
      setError('');
      
      // Fix isActive to is_active conversion
      if ('isActive' in branchUpdates) {
        branchUpdates.is_active = branchUpdates.isActive;
        delete branchUpdates.isActive;
      }
      
      const { data, error } = await supabase
        .from('branches')
        .update(branchUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedBranch = data as Branch;
      setBranches(prev => prev.map(branch => 
        branch.id === id ? updatedBranch : branch
      ));
      
      // If updating current branch, update current branch state
      if (currentBranch?.id === id) {
        setCurrentBranch(updatedBranch);
      }
      
      toast.success('Branch updated successfully');
      return updatedBranch;
    } catch (err: any) {
      const errorMessage = err.message || `Failed to update branch with ID: ${id}`;
      console.error('Error updating branch:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  // Delete a branch
  const deleteBranch = async (id: string): Promise<boolean> => {
    try {
      setError('');
      
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setBranches(prev => prev.filter(branch => branch.id !== id));
      
      // If deleting current branch, switch to another branch
      if (currentBranch?.id === id && branches.length > 1) {
        const newCurrentBranch = branches.find(branch => branch.id !== id);
        if (newCurrentBranch) {
          setCurrentBranch(newCurrentBranch);
          localStorage.setItem('currentBranchId', newCurrentBranch.id);
        } else {
          setCurrentBranch(null);
          localStorage.removeItem('currentBranchId');
        }
      }
      
      toast.success('Branch deleted successfully');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || `Failed to delete branch with ID: ${id}`;
      console.error('Error deleting branch:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  // Switch current branch
  const switchBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      localStorage.setItem('currentBranchId', branchId);
      toast.success(`Switched to branch: ${branch.name}`);
    } else {
      toast.error('Branch not found');
    }
  };

  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        isLoading,
        error,
        fetchBranches,
        fetchBranchById,
        createBranch,
        updateBranch,
        deleteBranch,
        switchBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

// Custom hook to use the branch context
export const useBranch = () => useContext(BranchContext);

// Default export for the context itself
export default BranchContext;
