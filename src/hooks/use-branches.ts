
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Branch } from '@/types';

export interface UseBranchesReturn {
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;
  error: Error | null;
  setCurrentBranchId: (id: string) => void;
  fetchBranches: () => Promise<void>;
}

export const useBranches = (): UseBranchesReturn => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw new Error(error.message);
      
      setBranches(data || []);
      
      // If there's at least one branch and no current branch is selected, select the first one
      if (data && data.length > 0 && !currentBranch) {
        setCurrentBranch(data[0]);
        localStorage.setItem('currentBranchId', data[0].id);
      }
    } catch (err: any) {
      setError(err);
      toast.error('Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize branches when component mounts
  useEffect(() => {
    fetchBranches();
    
    // Check if we have a stored branch preference
    const storedBranchId = localStorage.getItem('currentBranchId');
    if (storedBranchId) {
      // Need to fetch this branch specifically
      const fetchStoredBranch = async () => {
        try {
          const { data, error } = await supabase
            .from('branches')
            .select('*')
            .eq('id', storedBranchId)
            .single();

          if (error) throw new Error(error.message);
          
          if (data) {
            setCurrentBranch(data);
          }
        } catch (err) {
          console.error('Failed to fetch stored branch:', err);
          // If stored branch not found, we'll fall back to the first branch
        }
      };
      fetchStoredBranch();
    }
  }, []);

  const setCurrentBranchId = (id: string) => {
    const branch = branches.find(b => b.id === id);
    if (branch) {
      setCurrentBranch(branch);
      localStorage.setItem('currentBranchId', id);
    } else {
      toast.error('Branch not found');
    }
  };

  return {
    branches,
    currentBranch,
    isLoading,
    error,
    setCurrentBranchId,
    fetchBranches
  };
};

// Alias for backward compatibility
export const useBranch = useBranches;
