
// Member types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  date_of_birth?: string;
  avatar?: string;
  goal?: string;
  occupation?: string;
  blood_group?: string;
  id_type?: string;
  id_number?: string;
  trainer_id?: string;
  membership_id?: string;
  membership_status: string;
  membership_start_date?: string;
  membership_end_date?: string;
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  role: string;
  branch_id: string;
  created_at: string;
  updated_at?: string;
}

export interface MemberFormData {
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  date_of_birth?: string;
  goal?: string;
  occupation?: string;
  blood_group?: string;
  id_type?: string;
  id_number?: string;
  trainer_id?: string;
  branch_id: string;
}

export interface MemberStats {
  total_members: number;
  active_members: number;
  new_this_month: number;
  expiring_soon: number;
  cancelled_this_month: number;
}
