// Base user role type
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

// User role from user_roles table
export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// User input for creating a new user
export interface CreateUserInput {
  email: string;
  password: string;
  phone?: string | null;
  full_name?: string;
  avatar_url?: string | null;
}

// User input for updating a user
export interface UpdateUserInput {
  email?: string;
  phone?: string | null;
  full_name?: string;
  avatar_url?: string | null;
}

// Trainer interface with relationships
export interface Trainer {
  id: string;
  user_id: string;
  employee_id: string | null;
  hire_date: string | null;
  experience_years: number | null;
  monthly_salary: number | null;
  specializations: string[] | null;
  bio: string | null;
  certifications: Array<{
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiry_date?: string;
  }> | null;
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
  rating: number | null;
  rating_average: number | null;
  rating_count: number | null;
  created_at: string | null;
  updated_at: string | null;
  metadata: Record<string, any> | null;
  
  // Joined fields from auth.users
  user?: User;
  
  // Computed fields (not in the database)
  role?: UserRole;
  email?: string | null;
  full_name?: string | null;
  phone_number?: string | null;
  avatar_url?: string | null;
}

export interface TrainerDocument {
  id: string;
  trainer_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  mime_type?: string;
  file_size?: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainerSchedule {
  id: string;
  trainer_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileInput {
  id?: string; // For cases where we know the ID in advance
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  id_number?: string | null;
  id_type?: string | null;
  is_active?: boolean | null;
  is_branch_manager?: boolean | null;
  department?: string | null;
  branch_id?: string | null;
  accessible_branch_ids?: string[] | null;
  role?: UserRole;
  created_at?: string; // For cases where we need to set the creation timestamp
  updated_at?: string; // For cases where we need to set the update timestamp
}

export interface CreateTrainerInput {
  user_id: string; // Reference to auth.users table
  employee_id?: string | null;
  hire_date?: string | null;
  experience_years?: number | null;
  monthly_salary?: number | null;
  specializations?: string[] | null;
  bio?: string | null;
  certifications?: Array<{
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiry_date?: string;
  }> | null;
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
  rating?: number | null;
  rating_average?: number | null;
  rating_count?: number | null;
  metadata?: Record<string, any> | null;
}

export type UpdateProfileInput = Partial<Omit<CreateProfileInput, 'email'>> & {
  email?: string; // Make email required in updates
};

export type UpdateTrainerInput = {
  // User information
  user?: UpdateUserInput;
  
  // Trainer-specific fields
  employee_id?: string | null;
  hire_date?: string | null;
  experience_years?: number | null;
  monthly_salary?: number | null;
  specializations?: string[] | null;
  bio?: string | null;
  certifications?: Array<{
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiry_date?: string;
  }> | null;
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
  rating?: number | null;
  rating_average?: number | null;
  rating_count?: number | null;
  metadata?: Record<string, any> | null;
  updated_at?: string;
};