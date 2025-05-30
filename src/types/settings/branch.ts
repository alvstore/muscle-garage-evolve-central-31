
import { z } from 'zod';

// Branch types for settings
export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  manager_id?: string | null;
  branch_code?: string | null;
  max_capacity?: number | null;
  opening_hours?: string | null;
  closing_hours?: string | null;
  region?: string | null;
  tax_rate?: number | null;
  timezone?: string | null;
  zip_code?: string;
}

export interface BranchFormData {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  branch_code?: string;
  manager_id?: string;
  max_capacity?: number;
  opening_hours?: string;
  closing_hours?: string;
  region?: string;
  tax_rate?: number;
  timezone?: string;
  zip_code?: string;
}

// Zod schema for branch validation
export const BranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  branch_code: z.string().optional(),
  manager_id: z.string().optional(),
  max_capacity: z.number().optional(),
  opening_hours: z.string().optional(),
  closing_hours: z.string().optional(),
  region: z.string().optional(),
  tax_rate: z.number().optional(),
  timezone: z.string().optional(),
  zip_code: z.string().optional()
});

export type BranchFormValues = z.infer<typeof BranchSchema>;

export interface BranchStats {
  total_members: number;
  active_members: number;
  monthly_revenue: number;
  total_classes: number;
  staff_count: number;
  trainer_count: number;
}
