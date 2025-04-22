
export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  membershipStatus: 'active' | 'expired' | 'none';
  membershipId: string | null;
  membershipStartDate: Date | null;
  membershipEndDate: Date | null;
  role: 'member' | 'trainer' | 'staff' | 'admin';
}
