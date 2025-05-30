
import { z } from 'zod';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
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

export const BranchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('India'),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  is_active: z.boolean().default(true),
  branch_code: z.string().optional(),
  manager_id: z.string().optional().nullable(),
  max_capacity: z.number().optional().nullable(),
  opening_hours: z.string().optional().nullable(),
  closing_hours: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  tax_rate: z.number().optional().nullable(),
  timezone: z.string().optional().nullable()
});

export type BranchFormValues = z.infer<typeof BranchSchema>;
