
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
  
  // Address Fields - updated to match the DB schema
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  
  // ID Fields - updated to match the DB schema
  id_type?: string;
  id_number?: string;
  
  // Emergency contact information
  emergencyContact?: string;
  notes?: string;
  
  // Profile Picture - updated to match the DB schema
  profile_picture?: string;
  avatar?: string; // Keep for backward compatibility
}
