import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      setBranches(data || []);
      
      // Set the first branch as current by default
      if (data && data.length > 0 && !currentBranch) {
        setCurrentBranch(data[0]);
      }
    } catch (err: any) {
      setError(err);
      console.error('Error fetching branches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return {
    branches,
    currentBranch,
    setActiveBranch,
    isLoading,
    error,
    refreshBranches: fetchBranches,
  };
};

export default useBranches;
