import { UserRole } from './index';

// Extended user type with branch and address information
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  branchId?: string; // Primary branch ID
  branchIds?: string[]; // All branches the user has access to
  isBranchManager?: boolean; // Whether the user is a branch manager
  primaryBranchId?: string; // Added for compatibility
  
  // Address fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  password?: string; // Added for registration purposes
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
