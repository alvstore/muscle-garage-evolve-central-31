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

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(getDashboardDataDefaults());
  
  const { isSystemAdmin } = usePermissions();
  const { currentBranch } = useBranch();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const scopedData = getScopedDashboardData(isSystemAdmin(), currentBranch?.id);
      setDashboardData(scopedData);
      setIsLoading(false);
    }, 1000);
  }, [isSystemAdmin, currentBranch]);

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

  function getScopedDashboardData(isAdmin: boolean, branchId?: string) {
    const mockData = {
      totalMembers: 328,
      newMembersToday: 5,
      activeMembers: 287,
      attendanceToday: 152,
      revenue: {
        today: 2450,
        thisWeek: 12780,
        thisMonth: 45600,
        lastMonth: 39800
      },
      pendingPayments: {
        count: 23,
        total: 8750
      },
      upcomingRenewals: {
        today: 3,
        thisWeek: 18,
        thisMonth: 42
      },
      classAttendance: {
        today: 152,
        yesterday: 143,
        lastWeek: 982
      },
      membersByStatus: {
        active: 287,
        inactive: 24,
        expired: 17
      },
      attendanceTrend: [
        { date: '2022-06-01', count: 120 },
        { date: '2022-06-02', count: 132 },
        { date: '2022-06-03', count: 125 },
        { date: '2022-06-04', count: 140 },
        { date: '2022-06-05', count: 147 },
        { date: '2022-06-06', count: 138 },
        { date: '2022-06-07', count: 152 }
      ],
      revenueData: [
        { month: 'Jan', revenue: 15000, expenses: 4000, profit: 11000 },
        { month: 'Feb', revenue: 18000, expenses: 4200, profit: 13800 },
        { month: 'Mar', revenue: 16500, expenses: 4800, profit: 11700 },
        { month: 'Apr', revenue: 17800, expenses: 5100, profit: 12700 },
        { month: 'May', revenue: 19200, expenses: 5400, profit: 13800 },
        { month: 'Jun', revenue: 21000, expenses: 5600, profit: 15400 }
      ]
    };

    if (!isAdmin && branchId) {
      return {
        ...mockData,
        totalMembers: Math.floor(mockData.totalMembers * 0.4),
        newMembersToday: Math.floor(mockData.newMembersToday * 0.4),
        activeMembers: Math.floor(mockData.activeMembers * 0.4),
        attendanceToday: Math.floor(mockData.attendanceToday * 0.4),
        revenue: {
          today: Math.floor(mockData.revenue.today * 0.4),
          thisWeek: Math.floor(mockData.revenue.thisWeek * 0.4),
          thisMonth: Math.floor(mockData.revenue.thisMonth * 0.4),
          lastMonth: Math.floor(mockData.revenue.lastMonth * 0.4)
        },
        pendingPayments: {
          count: Math.floor(mockData.pendingPayments.count * 0.4),
          total: Math.floor(mockData.pendingPayments.total * 0.4)
        },
        membersByStatus: {
          active: Math.floor(mockData.membersByStatus.active * 0.4),
          inactive: Math.floor(mockData.membersByStatus.inactive * 0.4),
          expired: Math.floor(mockData.membersByStatus.expired * 0.4)
        },
        revenueData: mockData.revenueData.map(item => ({
          ...item,
          revenue: Math.floor(item.revenue * 0.4),
          expenses: Math.floor(item.expenses * 0.4),
          profit: Math.floor(item.profit * 0.4)
        }))
      };
    }

    return mockData;
  }

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

  const handleSearch = (query: string) => {
    toast.info(`Searching for: ${query}`);
  };

  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    toast.info(`Date range selected: ${startDate?.toDateString()} - ${endDate?.toDateString()}`);
  };

  const handleExport = () => {
    toast.success('Dashboard data exported successfully');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    toast("Refreshing dashboard data", {
      description: "Please wait while we fetch the latest information."
    });
    setTimeout(() => {
      const scopedData = getScopedDashboardData(isSystemAdmin(), currentBranch?.id);
      setDashboardData(scopedData);
      setIsLoading(false);
      toast("Dashboard updated", {
        description: "All data has been refreshed with the latest information."
      });
    }, 1000);
  };

  const dashboardTitle = isSystemAdmin() ? "Admin Dashboard" : "Branch Dashboard";
  const scopeDescription = isSystemAdmin() 
    ? "Global view of all branches" 
    : `Branch: ${currentBranch?.name || 'Unknown Branch'}`;

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
