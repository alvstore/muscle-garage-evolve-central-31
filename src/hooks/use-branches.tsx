
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { branchService } from '@/services';

export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  timezone?: string;
  currency?: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
  is_active?: boolean;
  is_default?: boolean;
}

interface BranchContextType {
  branches: Branch[];
  isLoading: boolean;
  error: Error | null;
  currentBranch: Branch | null;
  setCurrentBranchId: (branchId: string) => void;
  refreshBranches: () => Promise<void>;
  createBranch: (branch: Omit<Branch, 'id'>) => Promise<Branch | null>;
  updateBranch: (branchId: string, updates: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (branchId: string) => Promise<boolean>;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentBranchId, setCurrentBranchId] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchBranches = useCallback(async () => {
    try {
      const fetchedBranches = await branchService.getBranches();
      setBranches(fetchedBranches);
      setError(null);
      return fetchedBranches;
    } catch (err: any) {
      setError(err);
      return [];
    }
  }, []);

  const { isLoading, refetch } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const currentBranch = branches.find(branch => branch.id === currentBranchId) || null;

  const setCurrentBranchIdHandler = (branchId: string) => {
    setCurrentBranchId(branchId);
    // Store in localStorage for persistence
    localStorage.setItem('currentBranchId', branchId);
  };

  // Load branch from localStorage on initial load
  useEffect(() => {
    const savedBranchId = localStorage.getItem('currentBranchId');
    if (savedBranchId) {
      setCurrentBranchId(savedBranchId);
    }
  }, []);

  const createBranch = async (branch: Omit<Branch, 'id'>): Promise<Branch | null> => {
    try {
      const newBranch = await branchService.createBranch(branch);
      setBranches(prevBranches => [...prevBranches, newBranch]);
      return newBranch;
    } catch (error) {
      console.error("Error creating branch:", error);
      return null;
    }
  };

  const updateBranch = async (branchId: string, updates: Partial<Branch>): Promise<Branch | null> => {
    try {
      const updatedBranch = await branchService.updateBranch(branchId, updates);
      setBranches(prevBranches =>
        prevBranches.map(branch => (branch.id === branchId ? { ...branch, ...updatedBranch } : branch))
      );
      return updatedBranch;
    } catch (error) {
      console.error("Error updating branch:", error);
      return null;
    }
  };

  const deleteBranch = async (branchId: string): Promise<boolean> => {
    try {
      await branchService.deleteBranch(branchId);
      setBranches(prevBranches => prevBranches.filter(branch => branch.id !== branchId));
      return true;
    } catch (error) {
      console.error("Error deleting branch:", error);
      return false;
    }
  };

  // Fix the refreshBranches function to properly handle the Promise
  const refreshBranches = async (): Promise<void> => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing branches:", error);
    }
  };

  const value = {
    branches,
    isLoading,
    error,
    currentBranch,
    setCurrentBranchId: setCurrentBranchIdHandler,
    refreshBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  };

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
};
