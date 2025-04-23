
export interface Member {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role: 'member' | 'trainer' | 'staff' | 'admin';
  status?: 'active' | 'inactive' | 'expired' | 'pending';
  avatar_url?: string;
  date_of_birth?: string;
  membershipStatus?: 'active' | 'expired' | 'none';
  membershipId?: string | null;
  membershipStartDate?: Date | string | null;
  membershipEndDate?: Date | string | null;
  branch_id?: string;
  // Adding a name property for backward compatibility
  name?: string;
}
