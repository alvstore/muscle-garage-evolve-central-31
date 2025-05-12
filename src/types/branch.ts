
import { z } from 'zod';

export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  manager?: string;
  manager_id?: string;
  openingHours?: string;
  closingHours?: string;
  createdAt?: string;
  updatedAt?: string;
  branch_code?: string;
  
  // Additional fields needed for multi-branch architecture
  maxCapacity?: number;
  region?: string;
  timezone?: string;
  taxRate?: number;
}

export const BranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('India'),
  email: z.string().email().optional().or(z.string().length(0)),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  branch_code: z.string().optional(),
  
  // Additional schema validations for new fields
  maxCapacity: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  region: z.string().optional(),
  timezone: z.string().optional(),
  taxRate: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
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
    isActive: branch.is_active ?? true,
    manager: branch.manager,
    manager_id: branch.manager_id,
    openingHours: branch.opening_hours,
    closingHours: branch.closing_hours,
    createdAt: branch.created_at,
    updatedAt: branch.updated_at,
    branch_code: branch.branch_code,
    // Map additional fields
    maxCapacity: branch.max_capacity,
    region: branch.region,
    timezone: branch.timezone,
    taxRate: branch.tax_rate,
  };
};
