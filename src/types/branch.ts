export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  
  // Additional properties needed by components
  manager?: string; // Used in several components
  openingHours?: string; // For displaying business hours
  closingHours?: string; // For displaying business hours
  maxCapacity?: number; // For branch capacity
  region?: string; // For geographical organization
  branchCode?: string; // For branch identification
  taxRate?: number; // For financial calculations
  timezone?: string; // For time-based operations
  managerId?: string; // Alias for manager_id to support existing code
  isActive?: boolean; // Alias for is_active to support existing code
}

// Helper function to convert between camelCase and snake_case
export function normalizeBranch(branch: Branch): Branch {
  return {
    ...branch,
    // Set aliases for compatibility
    managerId: branch.manager_id,
    isActive: branch.is_active,
    // Also keep original properties
    manager_id: branch.manager_id || branch.managerId,
    is_active: branch.is_active !== undefined ? branch.is_active : branch.isActive
  };
}
