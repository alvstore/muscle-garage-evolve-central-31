
export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  membershipStatus: 'active' | 'expired' | 'inactive' | 'none';
  membershipId: string | null;
  membershipStartDate: string | null;
  membershipEndDate: string | null;
  role: 'member' | 'trainer' | 'staff' | 'admin';
  branchId?: string;
  avatar?: string;
}
