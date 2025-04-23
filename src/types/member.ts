
export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  membershipStatus: 'active' | 'expired' | 'inactive';
  membershipId: string | null;
  membershipStartDate: string | null;
  membershipEndDate: string | null;
  role: 'member' | 'trainer' | 'staff' | 'admin';
  branchId?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  occupation?: string;
  dateOfBirth?: string;
}
