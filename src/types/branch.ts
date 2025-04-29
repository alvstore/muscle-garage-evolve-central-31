
export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  manager_id?: string;
  manager_name?: string;
  manager?: string;
  openingHours?: string;
  closingHours?: string;
  maxCapacity?: number;
  region?: string;
  branchCode?: string;
  taxRate?: number;
  timezone?: string;
}
