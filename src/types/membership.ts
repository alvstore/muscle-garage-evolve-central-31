
export type MembershipPlanStatus = "active" | "inactive";
export type MembershipDuration = "1-month" | "3-month" | "6-month" | "12-month";
export type ClassType = "all" | "group-only" | "basic-only";

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  durationLabel: MembershipDuration;
  benefits: string[];
  allowedClasses: ClassType;
  status: MembershipPlanStatus;
  memberCount: number;
  features?: string[];
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipSubscription {
  id: string;
  memberId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
  autoRenew: boolean;
  paymentStatus: "paid" | "pending" | "failed";
  invoiceId?: string;
}

// Adding this compatibility interface for transitioning to the new MembershipPlan format
export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  is_active: boolean;
  features: {
    gym: boolean;
    pool: boolean;
    classes: boolean;
  };
}
