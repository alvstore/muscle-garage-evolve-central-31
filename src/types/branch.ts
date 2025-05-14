
import { z } from 'zod';

export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  email?: string;
  phone?: string;
  is_active: boolean;
  branch_code?: string;
  manager_id?: string | null;
  created_at: string;
  updated_at: string;
  // Added missing properties
  max_capacity?: number;
  opening_hours?: string;
  closing_hours?: string;
  region?: string;
  tax_rate?: number;
  timezone?: string;
}

export const BranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('India'),
  email: z.string().email('Invalid email address').optional().or(z.string().length(0)),
  phone: z.string().optional(),
  is_active: z.boolean().default(true),
  manager_id: z.string().optional(),
  branch_code: z.string().optional(),
  // Extended fields
  max_capacity: z.string().optional().transform(val => val ? parseInt(val) : null),
  opening_hours: z.string().optional(),
  closing_hours: z.string().optional(),
  region: z.string().optional(),
  tax_rate: z.string().optional().transform(val => val ? parseFloat(val) : null),
  timezone: z.string().optional(),
});

export type BranchFormValues = z.infer<typeof BranchSchema>;

// Utility function to normalize branch data from the database to our frontend format
export const normalizeBranch = (branch: any): Branch => {
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address,
    city: branch.city,
    state: branch.state,
    country: branch.country || 'India',
    email: branch.email,
    phone: branch.phone,
    is_active: branch.is_active ?? true,
    manager_id: branch.manager_id,
    branch_code: branch.branch_code,
    created_at: branch.created_at,
    updated_at: branch.updated_at,
    // Extended fields
    max_capacity: branch.max_capacity,
    opening_hours: branch.opening_hours,
    closing_hours: branch.closing_hours,
    region: branch.region,
    tax_rate: branch.tax_rate,
    timezone: branch.timezone
  };
};

export interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;
  error: string | null;
  fetchBranches: () => Promise<void>;
  switchBranch: (branchId: string) => void;
  addBranch: (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => Promise<Branch | null>;
  updateBranch: (id: string, updates: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
  // Added createBranch to match implementation in hooks/use-branch.tsx
  createBranch: (branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => Promise<Branch | null>;
}
