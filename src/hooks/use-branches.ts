
import { useState, useEffect } from 'react';
import { useBranch } from '@/hooks/use-branch';
import { Branch } from '@/types/branch';

export function useBranches() {
  const { branches, isLoading, error, fetchBranches } = useBranch();
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (branches) {
      setFilteredBranches(branches);
    }
  }, [branches]);

  const refreshBranches = async () => {
    await fetchBranches();
  };

  return {
    branches: filteredBranches,
    isLoading,
    error,
    refreshBranches
  };
}
