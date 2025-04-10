
// Add this to your types/index.d.ts file
export interface DashboardSummary {
  activeMemberships: number;
  totalRevenue: number;
  newMembers: number;
  upcomingClasses: number;
  occupancyRate: number;
  totalMembers: number;
  todayCheckIns: number;
  pendingPayments: number;
  upcomingRenewals: number;
  attendanceTrend: Array<{ date: string; count: number }>;
}
