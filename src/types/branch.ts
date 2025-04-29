
export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  is_active: boolean;
  phone?: string;
  email?: string;
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

export interface BranchSummary {
  id: string;
  name: string;
  memberCount: number;
  staffCount: number;
  trainerCount: number;
  revenue: {
    daily: number;
    monthly: number;
    annual: number;
  };
}
