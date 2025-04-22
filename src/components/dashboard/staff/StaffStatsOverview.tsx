
import { Users, DollarSign, UserCheck, CalendarCheck2 } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { DashboardSummary } from "@/types/dashboard";

interface StaffStatsOverviewProps {
  isLoading: boolean;
  dashboardData: DashboardSummary;
}

const StaffStatsOverview = ({ isLoading, dashboardData }: StaffStatsOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Users}
        title="Total Members"
        value={isLoading ? "Loading..." : dashboardData.totalMembers}
        description="Active and inactive members"
        iconColor="text-blue-600"
      />
      <StatCard
        icon={UserCheck}
        title="Today's Check-ins"
        value={isLoading ? "Loading..." : dashboardData.todayCheckIns}
        description="Members visited today"
        iconColor="text-green-600"
      />
      <StatCard
        icon={DollarSign}
        title="Pending Payments"
        value={isLoading ? "Loading..." : `$${dashboardData.pendingPayments.total}`}
        description={`${dashboardData.pendingPayments.count} invoices pending`}
        iconColor="text-purple-600"
      />
      <StatCard
        icon={CalendarCheck2}
        title="Upcoming Renewals"
        value={isLoading ? "Loading..." : dashboardData.upcomingRenewals}
        description="Expiring in the next 7 days"
        iconColor="text-amber-600"
      />
    </div>
  );
};

export default StaffStatsOverview;
