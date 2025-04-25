
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export type Branch = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  is_active?: boolean;
};

export const useBranch = () => {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBranches = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get user profile to determine branch access
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('branch_id, accessible_branch_ids, role')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Determine which branches to fetch
        let branchesQuery;
        if (profile.role === 'admin') {
          // Admins can see all branches
          branchesQuery = supabase
            .from('branches')
            .select('*')
            .order('name');
        } else if (profile.accessible_branch_ids && profile.accessible_branch_ids.length > 0) {
          // Staff with multiple branch access
          branchesQuery = supabase
            .from('branches')
            .select('*')
            .in('id', [profile.branch_id, ...profile.accessible_branch_ids])
            .order('name');
        } else {
          // Users with single branch access
          branchesQuery = supabase
            .from('branches')
            .select('*')
            .eq('id', profile.branch_id)
            .order('name');
        }

        const { data: branchesData, error: branchesError } = await branchesQuery;
        
        if (branchesError) throw branchesError;

        // Set the branches and current branch
        const filteredBranches = branchesData || [];
        setBranches(filteredBranches);

        // Set current branch (first from list or user's primary branch)
        if (filteredBranches.length > 0) {
          const primaryBranch = filteredBranches.find(b => b.id === profile.branch_id) || filteredBranches[0];
          setCurrentBranch(primaryBranch);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branch data');
        toast.error('Failed to load branch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBranches();
  }, [user]);

  const switchBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      return true;
    }
    return false;
  };

  return {
    branches,
    currentBranch,
    isLoading,
    error,
    switchBranch,
  };
};
