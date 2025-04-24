
import { UserRole } from './index';

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
