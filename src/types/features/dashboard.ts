
// Dashboard and analytics types
export interface DashboardStats {
  active_members?: number;
  new_members_daily?: number;
  new_members_weekly?: number;
  new_members_monthly?: number;
  cancelled_members_monthly?: number;
  monthly_check_ins?: number;
  weekly_check_ins?: number;
  upcoming_renewals?: number;
  total_revenue?: number;
  membership_revenue?: number;
  merchandise_revenue?: number;
  supplements_revenue?: number;
  branch_id?: string;
}

export interface ClassPerformance {
  class_id?: string;
  class_name?: string;
  class_type?: string;
  capacity?: number;
  enrolled?: number;
  actual_attendance?: number;
  enrollment_percentage?: number;
  attendance_percentage?: number;
  performance_category?: string;
  branch_id?: string;
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
}

export interface AttendanceTrend {
  date_point: string;
  attendance_count: number;
}

export interface MembershipTrend {
  date_point: string;
  new_members: number;
  cancelled_members: number;
  net_change: number;
}
