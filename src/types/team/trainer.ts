
export interface Trainer {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  rating?: number;
  is_active?: boolean;
  branchId?: string;
  avatar_url?: string;
  avatar?: string;
  specialization?: string;
  specializations?: string[];
  isAvailable?: boolean;
  ratingValue?: number;
  created_at?: string;
  updated_at?: string;
  // Add any other properties needed
}

export interface TrainerProfile {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  specialty?: string; 
  bio?: string;
  rating?: number;
  is_active?: boolean;
  branch_id?: string;
  avatar_url?: string;
  accessible_branch_ids?: string[];
  address?: string;
  city?: string;
  country?: string;
  created_at?: string;
  date_of_birth?: string;
  department?: string;
  role?: string;
  state?: string;
  updated_at?: string;
}
