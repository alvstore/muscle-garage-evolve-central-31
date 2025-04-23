
export type MemberStatus = "active" | "expired" | "none" | "inactive";

export interface Member {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role: 'member' | 'trainer' | 'staff' | 'admin';
  status: MemberStatus; // changed from optional to required
  avatar_url?: string;
  avatar?: string; // ✅ Added as an optional string URL for avatar
  date_of_birth?: string;
  membershipStatus?: 'active' | 'expired' | 'none' | 'inactive';
  membershipId?: string | null;
  membershipStartDate?: Date | string | null;
  membershipEndDate?: Date | string | null;
  branch_id?: string;
  // Adding a name property for backward compatibility
  name?: string;
}
