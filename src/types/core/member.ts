
// Member management types
export type MembershipStatus = 'active' | 'inactive' | 'expired' | 'cancelled' | 'pending';
export type MemberStatus = 'active' | 'inactive' | 'suspended' | 'cancelled';

export interface Member {
  id: string;
  profile_id?: string;
  branch_id: string;
  membership_id?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  membership_status: MembershipStatus;
  membership_start_date?: string;
  membership_end_date?: string;
  status: MemberStatus;
  notes?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMemberInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  branch_id: string;
  membership_id?: string;
  notes?: string;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
  status?: MemberStatus;
  membership_status?: MembershipStatus;
  membership_start_date?: string;
  membership_end_date?: string;
}
