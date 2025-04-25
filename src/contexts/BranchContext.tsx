
import { createContext } from 'react';
import { Branch } from '@/types/branch';

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  isLoading: boolean;
  error: string | null;
  switchBranch: (branchId: string) => boolean;
  fetchBranches: () => Promise<void>;
  createBranch: (branch: Omit<Branch, 'id'>) => Promise<Branch | null>;
  updateBranch: (id: string, branch: Partial<Branch>) => Promise<Branch | null>;
}

export const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  setCurrentBranch: () => {},
  isLoading: true,
  error: null,
  switchBranch: () => false,
  fetchBranches: async () => {},
  createBranch: async () => null,
  updateBranch: async () => null,
});

