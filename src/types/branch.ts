
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

import * as z from 'zod';

// Zod schema for branch validation
export const BranchSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters').max(100, 'Branch name must be less than 100 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  branch_code: z.string().min(2, 'Branch code must be at least 2 characters'),
  max_capacity: z.number().optional(),
  opening_hours: z.string().optional(),
  closing_hours: z.string().optional(),
  region: z.string().optional(),
  tax_rate: z.number().min(0).max(100).optional(),
  timezone: z.string().optional(),
  is_active: z.boolean().default(true)
});

// Type for form values derived from the schema
export type BranchFormValues = z.infer<typeof BranchSchema>;
