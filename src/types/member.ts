
export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  membership_status?: string;
  status?: string;
  membership_end_date?: string;
  membership_id?: string;
  branch_id?: string;
  trainer_id?: string;
  avatar?: string;
  goal?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
  // Added missing fields to match the database schema
  id_type?: string;
  id_number?: string;
  profile_picture?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
