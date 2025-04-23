
export type MemberStatus = "active" | "expired" | "none" | "inactive";

export interface Member {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role: 'member' | 'trainer' | 'staff' | 'admin';
  status: MemberStatus;
  avatar_url?: string;
  avatar?: string;
  dateOfBirth?: string;
  date_of_birth?: string;
  // Add the gender field with the specified type
  gender?: "Male" | "Female" | "Other";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  occupation?: string;
  membershipStatus?: 'active' | 'expired' | 'none' | 'inactive';
  membershipId?: string | null;
  membershipStartDate?: Date | string | null;
  membershipEndDate?: Date | string | null;
  branch_id?: string;
  name?: string;
}
