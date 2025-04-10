
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
}

export interface BranchMember {
  id: string;
  branchId: string;
  memberId: string;
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
}

export interface BranchStaff {
  id: string;
  branchId: string;
  userId: string;
  role: "admin" | "staff" | "trainer";
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
}
