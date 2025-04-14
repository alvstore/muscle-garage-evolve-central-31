
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  manager?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  maxCapacity?: number;
  openingHours?: string;
  closingHours?: string;
  holidayDates?: string[];
  // Added fields for enhanced branch management
  region?: string;
  branchCode?: string;
  taxRate?: number;
  timezone?: string;
  currency?: string;
  contactPerson?: string;
  description?: string;
}

export interface BranchMember {
  id: string;
  branchId: string;
  memberId: string;
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
  // Added fields for enhanced multi-branch support
  membershipTier?: string;
  accessLevel?: "full" | "limited" | "classes-only";
  specialAccess?: string[];
  notes?: string;
}

export interface BranchStaff {
  id: string;
  branchId: string;
  userId: string;
  role: "admin" | "staff" | "trainer";
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
  // Added fields for enhanced multi-branch support
  position?: string;
  department?: string;
  permissions?: string[];
  managerAccess?: boolean;
  scheduleIds?: string[];
}

// New interfaces for branch-specific data

export interface BranchEquipment {
  id: string;
  branchId: string;
  name: string;
  category: string;
  quantity: number;
  status: "active" | "maintenance" | "out-of-order";
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export interface BranchSchedule {
  id: string;
  branchId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
  openTime: string;
  closeTime: string;
  isHoliday: boolean;
  holidayName?: string;
}

export interface BranchStats {
  branchId: string;
  totalMembers: number;
  activeMembers: number;
  totalStaff: number;
  totalTrainers: number;
  averageDailyVisits: number;
  monthlyRevenue: number;
  utilizationRate: number;
  lastUpdated: string;
}
