// Add this to your types/index.d.ts file
export interface DashboardSummary {
  // Existing properties...
  totalMembers: number;
  todayCheckIns: number;
  pendingPayments: number;
  upcomingRenewals: number;
  attendanceTrend: Array<{ date: string; count: number }>;
  // Other properties...
}
