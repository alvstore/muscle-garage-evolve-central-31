
export type UserRole = 'admin' | 'staff' | 'trainer' | 'member' | 'guest';

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  avatar?: string;
  phone?: string;
  branch_id?: string;
  branchIds?: string[];
  isBranchManager?: boolean;
  accessible_branch_ids?: string[];
}
