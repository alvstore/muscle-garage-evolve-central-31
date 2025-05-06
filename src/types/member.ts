
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
  branchId?: string;
  gender?: string;
  bloodGroup?: string;
  occupation?: string;
  dateOfBirth?: Date | string | null;
  goal?: string;
  
  // Address Fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  
  // ID Fields
  idType?: string;
  idNumber?: string;
  
  // Profile Picture
  profilePicture?: string;
}
