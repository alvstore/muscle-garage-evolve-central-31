
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { Card } from "@/components/ui/card";
import { mockDashboardSummary } from "@/data/mockData";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import PendingPayments from "@/components/dashboard/PendingPayments";
import Announcements from "@/components/dashboard/Announcements";
import RenewalsSection from "@/components/dashboard/sections/RenewalsSection";
import RevenueSection from "@/components/dashboard/sections/RevenueSection";
import StaffDashboardHeader from "@/components/dashboard/staff/StaffDashboardHeader";
import StaffStatsOverview from "@/components/dashboard/staff/StaffStatsOverview";
import { getStaffActivityData } from "@/components/dashboard/staff/StaffActivityData";
import { useBranch } from "@/hooks/use-branch";

const StaffDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(mockDashboardSummary);
  const { currentBranch } = useBranch();
  const { recentActivities, pendingPayments, announcements } = getStaffActivityData();
  
  // Mock revenue data for the RevenueSection component
  const revenueData = [
    { month: "Jan", revenue: 12500, expenses: 8500, profit: 4000 },
    { month: "Feb", revenue: 13200, expenses: 8700, profit: 4500 },
    { month: "Mar", revenue: 14800, expenses: 9200, profit: 5600 },
    { month: "Apr", revenue: 15700, expenses: 9800, profit: 5900 },
    { month: "May", revenue: 16500, expenses: 10500, profit: 6000 },
    { month: "Jun", revenue: 18200, expenses: 11200, profit: 7000 }
  ];
  
  useEffect(() => {
    setTimeout(() => {
      console.log(`Loading branch-specific data for branch: ${currentBranch?.id}`);
      setDashboardData(mockDashboardSummary);
      setIsLoading(false);
    }, 1000);
  }, [currentBranch]);

  const handleRefresh = () => {
    setIsLoading(true);
    toast("Refreshing dashboard data", {
      description: "Please wait while we fetch the latest information."
    });
    setTimeout(() => {
      setIsLoading(false);
      toast("Dashboard updated", {
        description: "All data has been refreshed with the latest information."
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <StaffDashboardHeader isLoading={isLoading} onRefresh={handleRefresh} />
      <StaffStatsOverview isLoading={isLoading} dashboardData={dashboardData} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          {isLoading ? (
            <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <AttendanceChart data={dashboardData.attendanceTrend} />
          )}
        </div>
        
        <div>
          {isLoading ? (
            <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <Card>
              <RevenueSection data={revenueData} />
            </Card>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <RecentActivity activities={recentActivities} />
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <PendingPayments payments={pendingPayments} />
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
          ) : (
            <Announcements announcements={announcements} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
