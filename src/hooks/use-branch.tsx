import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Branch, BranchContextType } from '@/types/branch';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

// Create context
const BranchContext = createContext<BranchContextType>({} as BranchContextType);

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  // Check user role directly instead of using usePermissions to avoid circular dependency
  // Using useMemo to stabilize this value and prevent unnecessary re-renders
  const canViewAllBranches = useMemo(() => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  }, [user?.role]);
  
  // Fetch branches
  const fetchBranches = useCallback(async () => {
    if (!user) {
      setBranches([]);
      setCurrentBranch(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('branches').select('*');
      
      // If not admin or doesn't have all branch access, filter by user's branch
      if (!canViewAllBranches) {
        if (user.branch_id) {
          query = query.eq('id', user.branch_id);
        } else {
          // If user doesn't have a branch assigned and can't view all branches
          setBranches([]);
          setCurrentBranch(null);
          setIsLoading(false);
          return;
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const activeBranches = data as Branch[];
      setBranches(activeBranches);
      
      // Set current branch from localStorage or default to first branch
      const storedBranchId = localStorage.getItem('currentBranchId');
      
      // Check if stored branch exists and is in fetched branches
      if (storedBranchId && activeBranches.some(b => b.id === storedBranchId)) {
        const branch = activeBranches.find(b => b.id === storedBranchId) || null;
        setCurrentBranch(branch);
      } else if (activeBranches.length > 0) {
        // Default to first branch if no stored branch or stored branch not found
        setCurrentBranch(activeBranches[0]);
        localStorage.setItem('currentBranchId', activeBranches[0].id);
      } else {
        setCurrentBranch(null);
      }
      
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setError(err.message || 'Failed to fetch branches');
      
      toast({
        title: 'Error',
        description: 'Failed to load branch information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  // Using stable references to avoid infinite loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.branch_id, canViewAllBranches]);
  
  // Switch branch
  const switchBranch = useCallback((branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      localStorage.setItem('currentBranchId', branchId);
      
      toast({
        title: 'Branch changed',
        description: `Now viewing ${branch.name}`,
      });
    }
  }, [branches, toast]);
  
  // Add branch
  const addBranch = useCallback(async (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([branch])
        .select()
        .single();
      
      if (error) throw error;
      
      setBranches(prev => [...prev, data as Branch]);
      
      toast({
        title: 'Branch added',
        description: `${branch.name} has been added successfully`,
      });
      
      // If this is the first branch, set it as current
      if (branches.length === 0) {
        setCurrentBranch(data as Branch);
        localStorage.setItem('currentBranchId', (data as Branch).id);
      }
      
      return data as Branch;
    } catch (err: any) {
      console.error('Error adding branch:', err);
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to add branch',
        variant: 'destructive',
      });
      
      return null;
    }
  }, [branches, toast]);
  
  // Alias for addBranch to match usage in components
  const createBranch = useCallback(async (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => {
    return addBranch(branch);
  }, [addBranch]);
  
  // Update branch
  const updateBranch = useCallback(async (id: string, updates: Partial<Branch>) => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setBranches(prev =>
        prev.map(branch => (branch.id === id ? (data as Branch) : branch))
      );
      
      // Update current branch if it's the one being updated
      if (currentBranch?.id === id) {
        setCurrentBranch(data as Branch);
      }
      
      toast({
        title: 'Branch updated',
        description: `${updates.name || 'Branch'} has been updated successfully`,
      });
      
      return data as Branch;
    } catch (err: any) {
      console.error('Error updating branch:', err);
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to update branch',
        variant: 'destructive',
      });
      
      return null;
    }
  }, [currentBranch, toast]);
  
  // Delete branch
  const deleteBranch = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('branches').delete().eq('id', id);
      
      if (error) throw error;
      
      // Update branches list
      setBranches(prev => prev.filter(branch => branch.id !== id));
      
      // If current branch is deleted, switch to another branch
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
      
      toast({
        title: 'Branch deleted',
        description: 'The branch has been deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting branch:', err);
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete branch',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [currentBranch, branches, toast]);
  
  // Initial fetch on mount or auth change
  useEffect(() => {
    if (user) {
      fetchBranches();
    } else {
      setBranches([]);
      setCurrentBranch(null);
      setIsLoading(false);
    }
  // Using stable references to avoid infinite loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, fetchBranches]);
  
  // Listen for branch changes from other windows/tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentBranchId' && e.newValue && e.newValue !== currentBranch?.id) {
        const branch = branches.find(b => b.id === e.newValue);
        if (branch) {
          setCurrentBranch(branch);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [branches, currentBranch]);
  
  // Context value
  const value = useMemo(() => ({
    branches,
    currentBranch,
    isLoading,
    error,
    fetchBranches,
    switchBranch,
    addBranch,
    createBranch,
    updateBranch,
    deleteBranch,
  }), [
    branches,
    currentBranch,
    isLoading,
    error,
    fetchBranches,
    switchBranch,
    addBranch,
    createBranch,
    updateBranch,
    deleteBranch,
  ]);
  
  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  
  return context;
};
