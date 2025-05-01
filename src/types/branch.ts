
export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  managerId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  
  // Additional properties needed by components
  phone?: string;
  email?: string;
  manager?: string; // Human-readable manager name
  maxCapacity?: number;
  openingHours?: string;
  closingHours?: string;
  region?: string;
  branchCode?: string;
  taxRate?: number;
  timezone?: string;
}
