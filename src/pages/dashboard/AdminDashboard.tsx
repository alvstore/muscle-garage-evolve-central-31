
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
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
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
    }
  });
  
  const [membersByStatus, setMembersByStatus] = useState({
    active: 0,
    inactive: 0,
    expired: 0
  });
  
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  
  const { currentBranch } = useBranch();

  // Fetch dashboard data on component mount and when branch changes
  useEffect(() => {
    fetchDashboardData();
  }, [currentBranch?.id]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Filter by branch if one is selected
      const branchFilter = currentBranch?.id ? { branch_id: currentBranch.id } : {};
      
      // Get total members
      const { count: membersCount, error: membersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('role', 'member')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (membersError) throw membersError;
      
      // Get today's new members
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: newMembersCount, error: newMembersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('role', 'member')
        .gte('created_at', today.toISOString())
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (newMembersError) throw newMembersError;
      
      // Get active members
      const { count: activeMembersCount, error: activeMembersError } = await supabase
        .from('member_memberships')
        .select('id', { count: 'exact' })
        .eq('status', 'active')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (activeMembersError) throw activeMembersError;
      
      // Get attendance for today
      const { count: attendanceCount, error: attendanceError } = await supabase
        .from('member_attendance')
        .select('id', { count: 'exact' })
        .gte('check_in', today.toISOString())
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (attendanceError) throw attendanceError;
      
      // Get members by status
      const { count: activeCount, error: activeError } = await supabase
        .from('member_memberships')
        .select('id', { count: 'exact' })
        .eq('status', 'active')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (activeError) throw activeError;
      
      const { count: inactiveCount, error: inactiveError } = await supabase
        .from('member_memberships')
        .select('id', { count: 'exact' })
        .eq('status', 'inactive')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (inactiveError) throw inactiveError;
      
      const { count: expiredCount, error: expiredError } = await supabase
        .from('member_memberships')
        .select('id', { count: 'exact' })
        .eq('status', 'expired')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (expiredError) throw expiredError;
      
      // Get revenue data
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      
      // Today's Revenue
      const { data: todayRevenue, error: todayRevenueError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('payment_date', today.toISOString())
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (todayRevenueError) throw todayRevenueError;
      
      const todayRevenueSum = todayRevenue.reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      // This Week's Revenue
      const { data: weekRevenue, error: weekRevenueError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('payment_date', oneWeekAgo.toISOString())
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (weekRevenueError) throw weekRevenueError;
      
      const weekRevenueSum = weekRevenue.reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      // This Month's Revenue
      const { data: monthRevenue, error: monthRevenueError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('payment_date', oneMonthAgo.toISOString())
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (monthRevenueError) throw monthRevenueError;
      
      const monthRevenueSum = monthRevenue.reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      // Last Month's Revenue
      const { data: lastMonthRevenue, error: lastMonthRevenueError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('payment_date', twoMonthsAgo.toISOString())
        .lt('payment_date', oneMonthAgo.toISOString())
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (lastMonthRevenueError) throw lastMonthRevenueError;
      
      const lastMonthRevenueSum = lastMonthRevenue.reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      // Pending Payments
      const { data: pendingPayments, error: pendingPaymentsError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'pending')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (pendingPaymentsError) throw pendingPaymentsError;
      
      const pendingPaymentsSum = pendingPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      // Upcoming Renewals
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);
      
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      
      // Today's renewals
      const { count: todayRenewals, error: todayRenewalsError } = await supabase
        .from('member_memberships')
        .select('id', { count: 'exact' })
        .eq('end_date', today.toISOString().split('T')[0])
        .eq('status', 'active')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (todayRenewalsError) throw todayRenewalsError;
      
      // This week's renewals
      const { count: weekRenewals, error: weekRenewalsError } = await supabase
        .from('member_memberships')
        .select('id', { count: 'exact' })
        .lte('end_date', oneWeekLater.toISOString().split('T')[0])
        .gt('end_date', today.toISOString().split('T')[0])
        .eq('status', 'active')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (weekRenewalsError) throw weekRenewalsError;
      
      // This month's renewals
      const { count: monthRenewals, error: monthRenewalsError } = await supabase
        .from('member_memberships')
        .select('id', { count: 'exact' })
        .lte('end_date', oneMonthLater.toISOString().split('T')[0])
        .gt('end_date', oneWeekLater.toISOString().split('T')[0])
        .eq('status', 'active')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (monthRenewalsError) throw monthRenewalsError;
      
      // Attendance Trend
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: attendanceData, error: attendanceTrendError } = await supabase
        .from('member_attendance')
        .select('check_in')
        .gte('check_in', sevenDaysAgo.toISOString())
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '');
      
      if (attendanceTrendError) throw attendanceTrendError;
      
      // Format attendance data for chart
      const processedAttendanceTrend = processAttendanceTrend(attendanceData);
      
      // Revenue Chart Data - get last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const processedRevenueData = await getRevenueChartData(sixMonthsAgo, currentBranch?.id);
      
      // Update dashboard data
      setDashboardData({
        totalMembers: membersCount || 0,
        newMembersToday: newMembersCount || 0,
        activeMembers: activeMembersCount || 0,
        attendanceToday: attendanceCount || 0,
        revenue: {
          today: todayRevenueSum,
          thisWeek: weekRevenueSum,
          thisMonth: monthRevenueSum,
          lastMonth: lastMonthRevenueSum
        },
        pendingPayments: {
          count: pendingPayments.length,
          total: pendingPaymentsSum
        },
        upcomingRenewals: {
          today: todayRenewals || 0,
          thisWeek: weekRenewals || 0,
          thisMonth: monthRenewals || 0
        },
        classAttendance: {
          today: attendanceCount || 0,
          yesterday: 0, // Need to calculate
          lastWeek: 0 // Need to calculate
        }
      });
      
      setMembersByStatus({
        active: activeCount || 0,
        inactive: inactiveCount || 0,
        expired: expiredCount || 0
      });
      
      setAttendanceTrend(processedAttendanceTrend);
      setRevenueData(processedRevenueData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const processAttendanceTrend = (attendanceData) => {
    const days = [];
    const counts = new Array(7).fill(0);
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const formattedDate = date.toISOString().split('T')[0];
      days.push(formattedDate);
      
      for (const attendance of attendanceData) {
        const checkInDate = new Date(attendance.check_in);
        checkInDate.setHours(0, 0, 0, 0);
        const checkInFormatted = checkInDate.toISOString().split('T')[0];
        
        if (checkInFormatted === formattedDate) {
          counts[6 - i]++;
        }
      }
    }
    
    return days.map((day, index) => ({
      date: day,
      count: counts[index]
    }));
  };
  
  const getRevenueChartData = async (startDate, branchId) => {
    try {
      // Get revenue data
      const { data: revenueData, error: revenueError } = await supabase
        .from('payments')
        .select('amount, payment_date')
        .eq('status', 'completed')
        .gte('payment_date', startDate.toISOString())
        .eq(branchId ? 'branch_id' : '', branchId || '');
      
      if (revenueError) throw revenueError;
      
      // Get expense data
      const { data: expenseData, error: expensesError } = await supabase
        .from('transactions')
        .select('amount, transaction_date')
        .eq('type', 'expense')
        .gte('transaction_date', startDate.toISOString())
        .eq(branchId ? 'branch_id' : '', branchId || '');
      
      if (expensesError) throw expensesError;
      
      // Get months between startDate and now
      const months = [];
      const currentDate = new Date();
      let monthIndex = startDate.getMonth();
      let year = startDate.getFullYear();
      
      while (
        new Date(year, monthIndex) <= currentDate && 
        months.length < 6
      ) {
        months.push({
          month: new Date(year, monthIndex).toLocaleString('default', { month: 'short' }),
          year,
          monthIndex
        });
        
        monthIndex++;
        if (monthIndex > 11) {
          monthIndex = 0;
          year++;
        }
      }
      
      // Calculate revenue, expenses and profit by month
      return months.map(({ month, year, monthIndex }) => {
        const monthStart = new Date(year, monthIndex, 1);
        const monthEnd = new Date(year, monthIndex + 1, 0);
        
        // Filter revenue for this month
        const monthlyRevenue = revenueData.filter(payment => {
          const paymentDate = new Date(payment.payment_date);
          return paymentDate >= monthStart && paymentDate <= monthEnd;
        }).reduce((sum, payment) => sum + Number(payment.amount), 0);
        
        // Filter expenses for this month
        const monthlyExpenses = expenseData.filter(expense => {
          const expenseDate = new Date(expense.transaction_date);
          return expenseDate >= monthStart && expenseDate <= monthEnd;
        }).reduce((sum, expense) => sum + Number(expense.amount), 0);
        
        return {
          month,
          revenue: monthlyRevenue,
          expenses: monthlyExpenses,
          profit: monthlyRevenue - monthlyExpenses
        };
      });
    } catch (error) {
      console.error('Error fetching revenue chart data:', error);
      return [];
    }
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
      url: "/finance/dashboard"
    }
  ];

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
    toast.info('Refreshing dashboard data...');
    fetchDashboardData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Muscle Garage management system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          <SearchAndExport 
            onSearch={handleSearch}
            onDateRangeChange={handleDateRangeChange}
            onExport={handleExport}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <OverviewStats data={dashboardData} isLoading={isLoading} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <MemberProgressSection isLoading={isLoading} />
          <ChurnPredictionSection isLoading={isLoading} />
        </div>
        
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
        
        <div className="grid gap-6 md:grid-cols-2">
          <RevenueSection data={revenueData} isLoading={isLoading} />
          <MemberStatusSection data={membersByStatus} isLoading={isLoading} />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <AttendanceSection data={attendanceTrend} isLoading={isLoading} />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Commonly used gym management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <a href="/inventory">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    <span>Inventory</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <a href="/communication/announcements">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    <span>Announcements</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <a href="/store">
                    <CreditCard className="h-5 w-5 text-indigo-500" />
                    <span>Store</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <a href="/finance/dashboard">
                    <DollarSign className="h-5 w-5 text-indigo-500" />
                    <span>Finance</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
