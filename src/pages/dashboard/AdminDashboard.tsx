
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';
import { SearchAndExport } from '@/components/dashboard/sections/SearchAndExport';
import OverviewStats from '@/components/dashboard/sections/OverviewStats';
import RevenueSection from '@/components/dashboard/sections/RevenueSection';
import MemberStatusSection from '@/components/dashboard/sections/MemberStatusSection';
import AttendanceSection from '@/components/dashboard/sections/AttendanceSection';
import MemberProgressSection from '@/components/dashboard/sections/MemberProgressSection';
import ChurnPredictionSection from '@/components/dashboard/sections/ChurnPredictionSection';
import RenewalsSection from '@/components/dashboard/sections/RenewalsSection';
import { usePermissions } from '@/hooks/use-permissions';
import { useBranch } from '@/hooks/use-branch';
import { useDashboard } from '@/hooks/use-dashboard';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [pendingPayments, setPendingPayments] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  
  const { isSuperAdmin } = usePermissions();
  const { currentBranch } = useBranch();
  const { dashboardData, isLoading, refreshData } = useDashboard();

  useEffect(() => {
    // This effect would load any additional data needed
    // The main dashboard data is now loaded via the useDashboard hook
  }, [currentBranch?.id]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    toast.info(`Searching for: ${query}`);
  };

  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setStartDate(startDate);
    setEndDate(endDate);
    toast.info(`Date range selected: ${startDate?.toDateString()} - ${endDate?.toDateString()}`);
  };

  const handleExport = () => {
    toast.success('Dashboard data exported successfully');
  };

  const handleRefresh = () => {
    toast("Refreshing dashboard data", {
      description: `Fetching latest data for ${currentBranch?.name || 'all branches'}`
    });
    refreshData();
  };

  const dashboardTitle = currentBranch ? `${currentBranch.name} Dashboard` : "All Branches Dashboard";
  const scopeDescription = currentBranch 
    ? `Showing data for ${currentBranch.name}` 
    : isSuperAdmin() ? "Showing data for all branches" : "Please select a branch";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dashboardTitle}</h1>
          <p className="text-muted-foreground">{scopeDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <SearchAndExport 
            onSearch={handleSearch}
            onDateRangeChange={handleDateRangeChange}
            onExport={handleExport}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="w-full h-24 animate-pulse bg-muted"></Card>
            ))}
          </div>
        ) : (
          <OverviewStats data={dashboardData} />
        )}
        
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <>
              <Card className="w-full h-80 animate-pulse bg-muted"></Card>
              <Card className="w-full h-80 animate-pulse bg-muted"></Card>
            </>
          ) : (
            <>
              <MemberProgressSection />
              <ChurnPredictionSection />
            </>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <>
              <Card className="w-full h-96 animate-pulse bg-muted"></Card>
              <Card className="w-full h-96 animate-pulse bg-muted"></Card>
            </>
          ) : (
            <>
              <RevenueSection data={dashboardData.revenueData || []} />
              <MemberStatusSection data={dashboardData.membersByStatus || {
                active: 0,
                inactive: 0,
                expired: 0
              }} />
            </>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <>
              <Card className="w-full h-72 animate-pulse bg-muted"></Card>
              <Card className="w-full h-72 animate-pulse bg-muted"></Card>
            </>
          ) : (
            <>
              <AttendanceSection data={dashboardData.attendanceTrend || []} />
              <RenewalsSection renewals={upcomingRenewals} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
