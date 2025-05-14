
import { Branch } from '@/types';

// Define the UI branch shape
export interface UIBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
  isActive: boolean;
  branch_code: string;
  // Add other fields as needed
}

/**
 * Convert DB branch to UI branch format
 */
export const toUIBranch = (branch: Branch): UIBranch => {
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address || '',
    city: branch.city || '',
    state: branch.state || '',
    country: branch.country || 'India',
    email: branch.email || '',
    phone: branch.phone || '',
    isActive: branch.is_active || false,
    branch_code: branch.branch_code || '',
    // Map other fields as needed
  };
};

/**
 * Convert UI branch to DB branch format
 */
export const toDBBranch = (branch: UIBranch): Branch => {
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address,
    city: branch.city,
    state: branch.state,
    country: branch.country,
    email: branch.email,
    phone: branch.phone,
    is_active: branch.isActive,
    branch_code: branch.branch_code,
    manager_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Add other required fields with defaults
  };
};

/**
 * Convert array of DB branches to UI branches
 */
export const toUIBranches = (branches: Branch[]): UIBranch[] => {
  return branches.map(branch => toUIBranch(branch));
};

/**
 * Convert array of UI branches to DB branches
 */
export const toDBBranches = (branches: UIBranch[]): Branch[] => {
  return branches.map(branch => toDBBranch(branch));
};
