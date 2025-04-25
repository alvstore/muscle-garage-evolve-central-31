
export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
  managerId?: string;
  manager?: string;
  maxCapacity?: number;
  openingHours?: string;
  closingHours?: string;
  region?: string;
  branchCode?: string;
  taxRate?: number;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
}
