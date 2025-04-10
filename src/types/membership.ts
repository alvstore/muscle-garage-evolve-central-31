
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
