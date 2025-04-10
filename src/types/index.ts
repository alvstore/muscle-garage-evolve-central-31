// Extended user type with branch information
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
  address?: string; // Added address field
}

export type UserRole = "member" | "admin" | "staff" | "trainer";

// Extended member type with branch information
export interface MemberWithBranch {
  id: string;
  email: string;
  name: string;
  role: "member";
  avatar?: string;
  phone?: string;
  address?: string; // Added address field
  dateOfBirth?: string;
  goal?: string;
  trainerId?: string;
  membershipId?: string;
  membershipStatus: "active" | "inactive" | "expired";
  membershipStartDate?: string;
  membershipEndDate?: string;
  primaryBranchId: string;
  accessibleBranchIds: string[];
  // Body measurements
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  biceps?: number;
  thigh?: number;
  hips?: number;
  bodyFat?: number;
  // Progress tracking
  measurements?: MemberMeasurement[];
}

// New type for tracking measurement history
export interface MemberMeasurement {
  id: string;
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  biceps?: number;
  thigh?: number;
  hips?: number;
  bodyFat?: number;
  notes?: string;
  photoUrl?: string;
  updatedBy: string; // ID of user who updated the record
  updatedByRole: UserRole; // Role of user who updated the record
}

// Extended Member type with measurements
export interface Member {
  id: string;
  email: string;
  name: string;
  role: "member" | "admin" | "staff" | "trainer";
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  goal?: string;
  trainerId?: string;
  membershipId?: string;
  membershipStatus: "active" | "inactive" | "expired";
  membershipStartDate?: string;
  membershipEndDate?: string;
  // Body measurements
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  biceps?: number;
  thigh?: number;
  hips?: number;
  bodyFat?: number;
  // Progress tracking
  measurements?: import("./user").MemberMeasurement[];
}
