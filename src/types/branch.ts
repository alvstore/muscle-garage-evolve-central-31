
export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
  is_active: boolean;
  isActive?: boolean;  // For compatibility with old code
  branch_code: string;
  max_capacity?: number;
  opening_hours?: string;
  closing_hours?: string;
  region?: string;
  tax_rate?: number;
  timezone?: string;
  manager_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;
  error: string | null;
  fetchBranches: () => Promise<void>;
  switchBranch: (branchId: string) => void;
  addBranch: (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => Promise<Branch | null>;
  createBranch: (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => Promise<Branch | null>;
  updateBranch: (branchId: string, updates: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (branchId: string) => Promise<boolean>;
}
