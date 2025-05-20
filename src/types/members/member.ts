
export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  zipCode?: string; // For backward compatibility
  status?: string;
  membership_id?: string;
  membership_status?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  profile_picture?: string;
  branch_id?: string;
  gender?: string;
  date_of_birth?: string;
  dateOfBirth?: string; // For backward compatibility
  created_at?: string;
  updated_at?: string;
  trainer_id?: string;
  user_id?: string;
  goal?: string;
  avatar?: string;
  occupation?: string;
  blood_group?: string;
  id_type?: string;
  id_number?: string;
  // For backward compatibility
  trainerId?: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
}

export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  durationDays?: number; // For backward compatibility
  status?: string;
  is_active?: boolean;
  isActive?: boolean; // For backward compatibility
  features?: any[];
  benefits?: any[];
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export enum MembershipPlanStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  durationDays?: number; // For backward compatibility
  features?: any[];
  benefits?: any[];
  is_active?: boolean;
  isActive?: boolean; // For backward compatibility
  status?: MembershipPlanStatus;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  // Additional fields for backward compatibility
  createdAt?: string;
  updatedAt?: string;
  durationLabel?: string;
}
