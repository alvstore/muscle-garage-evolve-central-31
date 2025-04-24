
export interface TrainerProfile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  branch_id?: string;
  department?: string;
  specialty?: string;  // Added missing field
  bio?: string;        // Added missing field
  rating?: number;     // Added missing field
  is_active?: boolean; // Added missing field
  accessible_branch_ids?: string[];
  address?: string;
  city?: string;
  country?: string;
  created_at?: string;
  date_of_birth?: string;
  gender?: string;
  role?: string;
  state?: string;
  updated_at?: string;
}
