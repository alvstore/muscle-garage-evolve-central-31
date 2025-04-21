
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
  // Enhanced fields for branch management
  region?: string;
  branchCode?: string;
  taxRate?: number;
  timezone?: string;
  currency?: string;
  contactPerson?: string;
  description?: string;
  // Additional fields for operational details
  maintenanceSchedule?: string;
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  facilityType?: "standard" | "premium" | "express";
  amenities?: string[];
  parkingSpaces?: number;
  squareFootage?: number;
  yearEstablished?: number;
  renovationHistory?: {
    date: string;
    description: string;
  }[];
}

export interface BranchMember {
  id: string;
  branchId: string;
  memberId: string;
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
  // Enhanced fields for multi-branch support
  membershipTier?: string;
  accessLevel?: "full" | "limited" | "classes-only";
  specialAccess?: string[];
  notes?: string;
  // Additional fields for member tracking
  frequencyOfVisits?: "high" | "medium" | "low";
  preferredTrainingTimes?: string[];
  loyaltyPoints?: number;
  referralSource?: string;
  lastVisitDate?: string;
}

export interface BranchStaff {
  id: string;
  branchId: string;
  userId: string;
  role: "admin" | "staff" | "trainer";
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
  // Enhanced fields for multi-branch support
  position?: string;
  department?: string;
  permissions?: string[];
  managerAccess?: boolean;
  scheduleIds?: string[];
  // Additional fields for staff management
  certifications?: string[];
  workingHours?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  specialties?: string[];
  supervisorId?: string;
  performanceRating?: number;
  lastReviewDate?: string;
}

// Branch-specific data interfaces

export interface BranchEquipment {
  id: string;
  branchId: string;
  name: string;
  category: string;
  quantity: number;
  status: "active" | "maintenance" | "out-of-order";
  lastMaintenance?: string;
  nextMaintenance?: string;
  // Additional equipment fields
  serialNumber?: string;
  manufacturer?: string;
  modelNumber?: string;
  purchaseDate?: string;
  warrantyExpiration?: string;
  costPerUnit?: number;
  maintenanceHistory?: {
    date: string;
    description: string;
    cost?: number;
    technician?: string;
  }[];
  location?: string; // Where in the gym the equipment is located
}

export interface BranchSchedule {
  id: string;
  branchId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
  openTime: string;
  closeTime: string;
  isHoliday: boolean;
  holidayName?: string;
  // Additional schedule fields
  specialHours?: boolean;
  specialHoursReason?: string;
  staffingRequirements?: {
    role: string;
    count: number;
  }[];
  peakHours?: {
    start: string;
    end: string;
  }[];
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
  // Enhanced statistics
  memberRetentionRate?: number;
  classFillRate?: number;
  equipmentUtilization?: number;
  peakHoursOccupancy?: number;
  averageVisitDuration?: number;
  memberSatisfactionScore?: number;
  trainerBookingRate?: number;
  newMembersThisMonth?: number;
  cancelledMembershipsThisMonth?: number;
  revenueBreakdown?: {
    memberships: number;
    ptSessions: number;
    classes: number;
    productSales: number;
    other: number;
  };
  yearOverYearGrowth?: number;
}

// New interfaces for enhanced branch management

export interface BranchPromotion {
  id: string;
  branchId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: "percentage" | "fixed" | "free-months";
  discountValue: number;
  applicableMembershipTypes?: string[];
  maxRedemptions?: number;
  currentRedemptions: number;
  isActive: boolean;
  terms?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchFeedback {
  id: string;
  branchId: string;
  memberId: string;
  category: "facilities" | "staff" | "equipment" | "classes" | "general";
  rating: number;
  comment: string;
  isResolved: boolean;
  resolvedBy?: string;
  resolutionComment?: string;
  createdAt: string;
  updatedAt: string;
}
