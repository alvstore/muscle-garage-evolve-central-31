
export type UserRole = 'admin' | 'member' | 'trainer' | 'staff' | 'manager';

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  name?: string; // For backward compatibility
  avatar_url?: string;
  avatar?: string; // For backward compatibility
  role: UserRole;
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string; // Added to fix zipCode reference
  zipCode?: string; // For backward compatibility
  gender?: string;
  department?: string;
  is_trainer?: boolean;
  is_staff?: boolean;
  is_branch_manager?: boolean;
  isBranchManager?: boolean; // For backward compatibility
  accessible_branch_ids?: string[];
  branchIds?: string[]; // For backward compatibility
}
