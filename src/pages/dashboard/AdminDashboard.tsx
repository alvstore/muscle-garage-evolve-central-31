import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Users, CalendarCheck, CreditCard, Activity, Gift, DollarSign, FileText, TrendingUp, RefreshCcw } from 'lucide-react';
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
import { dashboardService } from '@/services/dashboardService';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(getDashboardDataDefaults());
  
  const { isSystemAdmin } = usePermissions();
  const { currentBranch } = useBranch();

  useEffect(() => {
    fetchDashboardData();
  }, [currentBranch]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    toast.info(`Loading data for ${currentBranch?.name || 'all branches'}`);
    
    try {
      const data = await dashboardService.getDashboardData(currentBranch?.id);
      if (data) {
        setDashboardData(data);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Error loading dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  function getDashboardDataDefaults() {
    return {
      totalMembers: 0,
      newMembersToday: 0,
      activeMembers: 0,
      attendanceToday: 0,
      revenue: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        lastMonth: 0
      },
      pendingPayments: {
        count: 0,
        total: 0
      },
      upcomingRenewals: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      },
      classAttendance: {
        today: 0,
        yesterday: 0,
        lastWeek: 0
      },
      membersByStatus: {
        active: 0,
        inactive: 0,
        expired: 0
      },
      attendanceTrend: [] as {date: string, count: number}[],
      revenueData: [] as {month: string, revenue: number, expenses: number, profit: number}[]
    };
  }

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
    fetchDashboardData();
  };

  const featuredActions = [
    {
      title: "Member Registration",
      description: "Quickly register new members with form validation",
      icon: <Users className="h-10 w-10 text-indigo-500" />,
      url: "/members/new"
    },
    {
      title: "Add New Class",
      description: "Create and schedule new fitness classes",
      icon: <CalendarCheck className="h-10 w-10 text-indigo-500" />,
      url: "/classes"
    },
    {
      title: "Process Payment",
      description: "Process membership payments and invoices",
      icon: <CreditCard className="h-10 w-10 text-indigo-500" />,
      url: "/finance/invoices"
    },
    {
      title: "Attendance Tracking",
      description: "Track member check-ins and attendance",
      icon: <Activity className="h-10 w-10 text-indigo-500" />,
      url: "/attendance"
    },
    {
      title: "Create Promotion",
      description: "Set up referral programs and special offers",
      icon: <Gift className="h-10 w-10 text-indigo-500" />,
      url: "/marketing/promo"
    },
    {
      title: "Financial Reports",
      description: "View revenue and financial analytics",
      icon: <DollarSign className="h-10 w-10 text-indigo-500" />,
      url: "/reports"
    }
  ];

  const dashboardTitle = currentBranch ? `${currentBranch.name} Dashboard` : "All Branches Dashboard";
  const scopeDescription = currentBranch 
    ? `Showing data for ${currentBranch.name}` 
    : isSystemAdmin() ? "Showing data for all branches" : "Please select a branch";

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
              <RevenueSection data={dashboardData.revenueData} />
              <MemberStatusSection data={dashboardData.membersByStatus} />
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
              <AttendanceSection data={dashboardData.attendanceTrend} />
              <RenewalsSection />
            </>
          )}
        </div>
        
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredActions.map((action, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                      <Button variant="ghost" className="mt-3 px-0 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-transparent" asChild>
                        <a href={action.url}>Show</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
