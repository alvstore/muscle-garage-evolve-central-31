import { UserRole } from './index';

// Extended user type with branch and address information
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  branchId?: string;
  branchIds?: string[];
  isBranchManager?: boolean;
  primaryBranchId?: string;
  dateOfBirth?: string;
  
  // Address fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Extended member type with branch and address information
export interface MemberWithBranch {
  id: string;
  email: string;
  name: string;
  role: "member";
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  goal?: string;
  trainerId?: string;
  membershipId?: string;
  membershipStatus: "active" | "inactive" | "expired";
  membershipStartDate?: string;
  membershipEndDate?: string;
  primaryBranchId: string;
  accessibleBranchIds: string[];
  
  // Address fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
