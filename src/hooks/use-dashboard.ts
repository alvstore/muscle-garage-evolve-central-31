
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { useAuth } from './use-auth';

export interface DashboardSummary {
  totalMembers: number;
  activeMembers: number;
  totalIncome: number;
  activeClasses?: number;
  totalTrainers?: number;
  revenueData?: any[];
  newMembers?: number;
  expiringMemberships?: number;
  todayCheckIns?: number;
  upcomingRenewals?: number;
  revenue?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  pendingPayments?: {
    count: number;
    total: number;
  };
  membersByStatus?: {
    active: number;
    inactive: number;
    expired: number;
  };
  attendanceTrend?: any[];
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    totalMembers: 0,
    activeMembers: 0,
    totalIncome: 0,
    revenue: {
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    newMembers: 0,
    expiringMemberships: 0,
    todayCheckIns: 0,
    upcomingRenewals: 0,
    pendingPayments: {
      count: 0,
      total: 0
    },
    membersByStatus: {
      active: 0,
      inactive: 0,
      expired: 0
    },
    attendanceTrend: [],
    revenueData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();
  const { user } = useAuth();

  // Function to fetch dashboard data from Supabase
  const fetchDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Prepare branch filter
      const branchFilter = currentBranch?.id;
      
      // Fetch total members
      let memberQuery = supabase.from('profiles').select('id').eq('role', 'member');
      if (branchFilter && user.role !== 'admin') {
        memberQuery = memberQuery.eq('branch_id', branchFilter);
      }
      const { data: memberData, error: memberError } = await memberQuery;
      const totalMembers = memberData ? memberData.length : 0;
      
      if (memberError) {
        console.error('Error fetching member count:', memberError);
      }
      
      // Fetch active members (with active memberships)
      let activeMemberQuery = supabase
        .from('profiles')
        .select('id')
        .eq('role', 'member')
        .in('status', ['active', 'trial']);
      
      if (branchFilter && user.role !== 'admin') {
        activeMemberQuery = activeMemberQuery.eq('branch_id', branchFilter);
      }
      
      const { data: activeMemberData, error: activeMemberError } = await activeMemberQuery;
      const activeMembers = activeMemberData ? activeMemberData.length : 0;
      
      if (activeMemberError) {
        console.error('Error fetching active member count:', activeMemberError);
      }
      
      // Fetch total income from transactions
      let incomeQuery = supabase
        .from('transactions')
        .select('amount');
      
      if (branchFilter && user.role !== 'admin') {
        incomeQuery = incomeQuery.eq('branch_id', branchFilter);
      }
      
      const { data: incomeData, error: incomeError } = await incomeQuery;
      const totalIncome = incomeData ? incomeData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
      
      if (incomeError) {
        console.error('Error fetching income data:', incomeError);
      }
      
      // Fetch member status distribution
      let memberStatusQuery = supabase
        .from('profiles')
        .select('status')
        .eq('role', 'member');
      
      if (branchFilter && user.role !== 'admin') {
        memberStatusQuery = memberStatusQuery.eq('branch_id', branchFilter);
      }
      
      const { data: memberStatusData, error: memberStatusError } = await memberStatusQuery;
      
      if (memberStatusError) {
        console.error('Error fetching member status data:', memberStatusError);
      }
      
      const membersByStatus = {
        active: memberStatusData?.filter(m => m.status === 'active').length || 0,
        inactive: memberStatusData?.filter(m => m.status === 'inactive').length || 0,
        expired: memberStatusData?.filter(m => m.status === 'expired').length || 0
      };
      
      // Fetch attendance trend (last 7 days)
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      let attendanceQuery = supabase
        .from('attendance')
        .select('check_in_time')
        .gte('check_in_time', sevenDaysAgo.toISOString());
      
      if (branchFilter && user.role !== 'admin') {
        attendanceQuery = attendanceQuery.eq('branch_id', branchFilter);
      }
      
      const { data: attendanceData, error: attendanceError } = await attendanceQuery;
      
      if (attendanceError) {
        console.error('Error fetching attendance data:', attendanceError);
      }
      
      // Group attendance by date
      const dateMap: Record<string, number> = {};
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        dateMap[dateString] = 0;
      }
      
      if (attendanceData) {
        attendanceData.forEach(record => {
          const dateString = record.check_in_time.split('T')[0];
          if (dateMap[dateString] !== undefined) {
            dateMap[dateString]++;
          }
        });
      }
      
      const attendanceTrend = Object.entries(dateMap)
        .map(([date, count]) => ({
          date,
          count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      // Fetch revenue data (last 6 months)
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      
      let revenueQuery = supabase
        .from('transactions')
        .select('amount, created_at')
        .gte('created_at', sixMonthsAgo.toISOString());
      
      if (branchFilter && user.role !== 'admin') {
        revenueQuery = revenueQuery.eq('branch_id', branchFilter);
      }
      
      const { data: revenueRawData, error: revenueError } = await revenueQuery;
      
      if (revenueError) {
        console.error('Error fetching revenue data:', revenueError);
      }
      
      // Group revenue by month
      const monthMap: Record<string, number> = {};
      
      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const monthString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthMap[monthString] = 0;
      }
      
      if (revenueRawData) {
        revenueRawData.forEach(record => {
          const date = new Date(record.created_at);
          const monthString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (monthMap[monthString] !== undefined) {
            monthMap[monthString] += record.amount || 0;
          }
        });
      }
      
      const revenueData = Object.entries(monthMap)
        .map(([month, amount]) => {
          const [year, monthNum] = month.split('-');
          return {
            month: `${new Date(0, parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' })} ${year}`,
            amount
          };
        })
        .sort((a, b) => a.month.localeCompare(b.month));
      
      // Get total trainers
      let trainerQuery = supabase
        .from('profiles')
        .select('id')
        .eq('role', 'trainer');
      
      if (branchFilter && user.role !== 'admin') {
        trainerQuery = trainerQuery.eq('branch_id', branchFilter);
      }
      
      const { data: trainerData, error: trainerError } = await trainerQuery;
      const totalTrainers = trainerData ? trainerData.length : 0;
      
      if (trainerError) {
        console.error('Error fetching trainer count:', trainerError);
      }
      
      // Get active classes
      let classesQuery = supabase
        .from('classes')
        .select('id')
        .eq('status', 'active');
      
      if (branchFilter && user.role !== 'admin') {
        classesQuery = classesQuery.eq('branch_id', branchFilter);
      }
      
      const { data: classesData, error: classesError } = await classesQuery;
      const activeClasses = classesData ? classesData.length : 0;
      
      if (classesError) {
        console.error('Error fetching classes count:', classesError);
      }
      
      // Get today's check-ins
      const todayStartDate = new Date();
      todayStartDate.setHours(0, 0, 0, 0);
      
      let checkInsQuery = supabase
        .from('member_attendance')
        .select('id')
        .gte('check_in', todayStartDate.toISOString());
        
      if (branchFilter && user.role !== 'admin') {
        checkInsQuery = checkInsQuery.eq('branch_id', branchFilter);
      }
      
      const { data: checkInsData, error: checkInsError } = await checkInsQuery;
      const todayCheckIns = checkInsData ? checkInsData.length : 0;
      
      if (checkInsError) {
        console.error('Error fetching today\'s check-ins:', checkInsError);
      }
      
      // Get upcoming renewals
      const nextWeekDate = new Date();
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      
      let renewalsQuery = supabase
        .from('member_memberships')
        .select('id')
        .lte('end_date', nextWeekDate.toISOString())
        .gt('end_date', todayStartDate.toISOString())
        .eq('status', 'active');
        
      if (branchFilter && user.role !== 'admin') {
        renewalsQuery = renewalsQuery.eq('branch_id', branchFilter);
      }
      
      const { data: renewalsData, error: renewalsError } = await renewalsQuery;
      const upcomingRenewals = renewalsData ? renewalsData.length : 0;
      
      if (renewalsError) {
        console.error('Error fetching upcoming renewals:', renewalsError);
      }

      // Get new members from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let newMembersQuery = supabase
        .from('members')
        .select('id')
        .gte('created_at', thirtyDaysAgo.toISOString());
        
      if (branchFilter && user.role !== 'admin') {
        newMembersQuery = newMembersQuery.eq('branch_id', branchFilter);
      }
      
      const { data: newMembersData, error: newMembersError } = await newMembersQuery;
      const newMembers = newMembersData ? newMembersData.length : 0;
      
      if (newMembersError) {
        console.error('Error fetching new members:', newMembersError);
      }
      
      // Get revenue stats (daily, weekly, monthly)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      // Daily revenue
      let dailyRevenueQuery = supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', oneDayAgo.toISOString())
        .eq('type', 'income');
        
      if (branchFilter && user.role !== 'admin') {
        dailyRevenueQuery = dailyRevenueQuery.eq('branch_id', branchFilter);
      }
      
      const { data: dailyRevenueData, error: dailyRevenueError } = await dailyRevenueQuery;
      const dailyRevenue = dailyRevenueData ? dailyRevenueData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
      
      if (dailyRevenueError) {
        console.error('Error fetching daily revenue:', dailyRevenueError);
      }
      
      // Weekly revenue
      let weeklyRevenueQuery = supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', oneWeekAgo.toISOString())
        .eq('type', 'income');
        
      if (branchFilter && user.role !== 'admin') {
        weeklyRevenueQuery = weeklyRevenueQuery.eq('branch_id', branchFilter);
      }
      
      const { data: weeklyRevenueData, error: weeklyRevenueError } = await weeklyRevenueQuery;
      const weeklyRevenue = weeklyRevenueData ? weeklyRevenueData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
      
      if (weeklyRevenueError) {
        console.error('Error fetching weekly revenue:', weeklyRevenueError);
      }
      
      // Monthly revenue
      let monthlyRevenueQuery = supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', oneMonthAgo.toISOString())
        .eq('type', 'income');
        
      if (branchFilter && user.role !== 'admin') {
        monthlyRevenueQuery = monthlyRevenueQuery.eq('branch_id', branchFilter);
      }
      
      const { data: monthlyRevenueData, error: monthlyRevenueError } = await monthlyRevenueQuery;
      const monthlyRevenue = monthlyRevenueData ? monthlyRevenueData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
      
      if (monthlyRevenueError) {
        console.error('Error fetching monthly revenue:', monthlyRevenueError);
      }
      
      // Get pending payments
      let pendingPaymentsQuery = supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'pending');
        
      if (branchFilter && user.role !== 'admin') {
        pendingPaymentsQuery = pendingPaymentsQuery.eq('branch_id', branchFilter);
      }
      
      const { data: pendingPaymentsData, error: pendingPaymentsError } = await pendingPaymentsQuery;
      const pendingPaymentsTotal = pendingPaymentsData ? pendingPaymentsData.reduce((sum, i) => sum + (i.amount || 0), 0) : 0;
      const pendingPaymentsCount = pendingPaymentsData ? pendingPaymentsData.length : 0;
      
      if (pendingPaymentsError) {
        console.error('Error fetching pending payments:', pendingPaymentsError);
      }
      
      // Update dashboard data
      setDashboardData({
        totalMembers: totalMembers,
        activeMembers: activeMembers,
        totalIncome: totalIncome,
        totalTrainers: totalTrainers,
        activeClasses: activeClasses,
        membersByStatus,
        attendanceTrend,
        revenueData,
        todayCheckIns,
        upcomingRenewals,
        newMembers,
        expiringMemberships: upcomingRenewals, // Use same data for expiring memberships
        revenue: {
          daily: dailyRevenue,
          weekly: weeklyRevenue,
          monthly: monthlyRevenue
        },
        pendingPayments: {
          count: pendingPaymentsCount,
          total: pendingPaymentsTotal
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fall back to empty data
      setDashboardData({
        totalMembers: 0,
        activeMembers: 0,
        totalIncome: 0,
        revenue: {
          daily: 0,
          weekly: 0,
          monthly: 0
        },
        membersByStatus: {
          active: 0,
          inactive: 0,
          expired: 0
        },
        pendingPayments: {
          count: 0, 
          total: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch dashboard data on component mount or when branch changes
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [currentBranch?.id, user]);

  return {
    dashboardData,
    isLoading,
    refreshData: fetchDashboardData,
  };
};
