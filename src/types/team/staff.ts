
// src/types/team/staff.ts

import { UserRole } from '../auth/user';

// User data from auth.users
export interface User {
  id: string;
  email: string;
  phone: string | null;
  raw_user_meta_data?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

// Staff-specific data stored in the staff table
export interface Staff {
  id: string;
  user_id: string;
  employee_id: string | null;
  hire_date: string | null;
  department: string | null;
  position: string | null;
  monthly_salary: number | null;
  emergency_contact: {
    name: string;
    phone: string;
    relation: string;
    address?: string;
  } | null;
  bank_details: {
    account_holder: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    branch: string;
  } | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  
  // Joined fields from auth.users
  user?: User;
  
  // Computed fields (not in the database)
  role?: UserRole;
  email?: string | null;
  full_name?: string | null;
  phone_number?: string | null;
  avatar_url?: string | null;
}

// For backward compatibility
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  department?: string;
  avatar?: string;
  branch_id?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  id_type?: string;
  id_number?: string;
  gender?: string;
  is_branch_manager?: boolean;
  employee_id?: string;
  position?: string;
}

// Input type for creating a new staff member
export interface CreateStaffInput {
  user_id: string;
  employee_id?: string | null;
  hire_date?: string | null;
  department?: string | null;
  position?: string | null;
  monthly_salary?: number | null;
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
    address?: string;
  } | null;
  bank_details?: {
    account_holder: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    branch: string;
  } | null;
  is_active?: boolean | null;
}

// Input type for updating a staff member
export type UpdateStaffInput = Partial<CreateStaffInput> & {
  id: string;
};

export interface FileOptions {
  // Add onUploadProgress for backward compatibility
  onUploadProgress?: (progress: number) => void;
}
