
export type UserRole = "admin" | "staff" | "trainer" | "member";

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
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  branchId?: string;
  branchIds?: string[]; 
  isBranchManager?: boolean;
}
