export interface MembershipPlan {
  id?: string; // Optional for new plans
  name: string;
  plan_name: string | null;
  description: string | null;
  price: number;
  duration_days: number;
  features: Record<string, any>;
  is_active: boolean;
  branch_id: string | null;
  created_at: string;
  updated_at: string;
  
  // For backward compatibility
  durationDays: number;
  isActive: boolean;
  status?: MembershipPlanStatus; // Optional since not all database schemas have this
  benefits: string[];
  memberCount: number;
  durationLabel: string;
  allowed_classes?: ClassType; // Optional field - not all database schemas have this
}

// Add these missing types
export type MembershipDuration = '1-month' | '3-month' | '6-month' | '12-month';
export type ClassType = 'all' | 'group-only' | 'basic-only';
export type MembershipPlanStatus = 'active' | 'inactive';

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  zip_code?: string;
  role?: string; // Add this for mock data
  membership_id?: string;
  membershipId?: string; // For backward compatibility
  trainer_id?: string;
  trainerId?: string; // For backward compatibility
  membership_status?: string;
  membershipStatus?: string; // For backward compatibility
  membership_start_date?: string;
  membershipStartDate?: string; // For backward compatibility
  membership_end_date?: string;
  membershipEndDate?: string; // For backward compatibility
  status?: string;
  date_of_birth?: string;
  dateOfBirth?: string; // For backward compatibility
  avatar?: string;
  profile_picture?: string;
  goal?: string;
  branch_id?: string;
  occupation?: string;
  blood_group?: string;
  id_type?: string;
  id_number?: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  specialty?: string;
  rating?: number;
  status?: string;
  role?: string; // Add this for mock data
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role?: string;
  position?: string; // Add this for mock data
  department?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  id_type?: string;
  id_number?: string;
  gender?: string;
  is_branch_manager?: boolean;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role?: string; // Add this for mock data
}

export interface Class {
  id: string;
  name: string;
  type?: string;
  description?: string;
  trainer_id?: string;
  trainerId?: string; // For backward compatibility
  trainer?: string;
  location?: string;
  capacity?: number;
  start_time?: string;
  end_time?: string;
  recurring?: boolean;
  recurrence?: string;
  level?: string;
  difficulty?: string;
  enrolled?: number;
  branch_id?: string;
  is_active?: boolean;
  status?: string;
}

export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  duration?: number; // For mock data compatibility
  features?: any[];
  is_active?: boolean;
  status?: string;
  branch_id?: string;
}
