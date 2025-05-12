
import { z } from 'zod';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  country: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  manager_id: string | null;
  branch_code: string | null;
  created_at: string;
  updated_at: string;
  
  // Extended fields (not in the base database schema)
  max_capacity?: number | null;
  opening_hours?: string | null;
  closing_hours?: string | null;
  region?: string | null;
  tax_rate?: number | null;
  timezone?: string | null;
}

export const BranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  address: z.string().min(1, 'Address is required'),
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
    ...(branch.max_capacity !== undefined && { max_capacity: branch.max_capacity }),
    ...(branch.opening_hours !== undefined && { opening_hours: branch.opening_hours }),
    ...(branch.closing_hours !== undefined && { closing_hours: branch.closing_hours }),
    ...(branch.region !== undefined && { region: branch.region }),
    ...(branch.tax_rate !== undefined && { tax_rate: branch.tax_rate }),
    ...(branch.timezone !== undefined && { timezone: branch.timezone })
  };
};
