
export interface Branch {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  manager_name?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  timezone?: string;
  opening_hours?: Record<string, any>;
  social_media?: Record<string, any>;
  facilities?: string[];
  settings?: Record<string, any>;
}

export interface BranchContextType {
  currentBranch: Branch | null;
  branches: Branch[];
  isLoading: boolean;
  error: string | null;
  setCurrentBranch: (branch: Branch | null) => void;
  refreshBranches: () => Promise<void>;
  createBranch: (branchData: Partial<Branch>) => Promise<Branch>;
  updateBranch: (id: string, branchData: Partial<Branch>) => Promise<Branch>;
  deleteBranch: (id: string) => Promise<void>;
}

export interface BranchFormData {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  timezone?: string;
  opening_hours?: Record<string, any>;
  facilities?: string[];
}
