
export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  zipCode?: string; // For backward compatibility
  country?: string;
  date_of_birth?: string;
  dateOfBirth?: string; // For backward compatibility
  gender?: string;
  membership_id?: string;
  membershipId?: string; // For backward compatibility
  membership?: string;
  membership_status?: string;
  membershipStatus?: string; // For backward compatibility
  status?: string;
  membership_start_date?: string;
  membershipStartDate?: string; // For backward compatibility
  membership_end_date?: string;
  membershipEndDate?: string; // For backward compatibility
  trainer_id?: string;
  trainerId?: string; // For backward compatibility
  branch_id?: string;
  profile_picture?: string;
  avatar?: string;
  user_id?: string;
  goal?: string;
  occupation?: string;
  blood_group?: string;
  id_type?: string;
  id_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: Record<string, any>;
  status?: string;
  is_active?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}
