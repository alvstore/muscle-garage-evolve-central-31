
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { DashboardSummary } from '@/types';
import { useAuth } from './use-auth';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    totalMembers: 0,
    todayCheckIns: 0,
    revenue: {
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    pendingPayments: {
      count: 0,
      total: 0
    },
    upcomingRenewals: 0,
    attendanceTrend: [],
    membersByStatus: {
      active: 0,
      inactive: 0,
      expired: 0
    },
    recentNotifications: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    fetchDashboardData();
  }, [currentBranch?.id, user?.id]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // Use Promise.all to fetch all data concurrently
      const [
        membersCount,
        todayAttendance,
        revenueData,
        pendingPayments,
        membersStatus,
        attendanceTrend,
        notifications
      ] = await Promise.all([
        // Total members count
        fetchTotalMembers(),
        
        // Today's check-ins
        fetchTodayCheckIns(todayStr),
        
        // Revenue data
        fetchRevenueData(),
        
        // Pending payments
        fetchPendingPayments(),
        
        // Members by status
        fetchMembersByStatus(),
        
        // Attendance trend for the past 14 days
        fetchAttendanceTrend(),
        
        // Recent notifications
        fetchRecentNotifications()
      ]);
      
      setDashboardData({
        totalMembers: membersCount,
        todayCheckIns: todayAttendance,
        revenue: revenueData,
        pendingPayments,
        upcomingRenewals: 0, // Will be fetched separately
        attendanceTrend,
        membersByStatus: membersStatus,
        recentNotifications: notifications
      });
      
      // Fetch upcoming renewals after setting initial data
      const upcomingRenewals = await fetchUpcomingRenewals();
      setDashboardData(prev => ({
        ...prev,
        upcomingRenewals
      }));
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalMembers = async (): Promise<number> => {
    try {
      let query = supabase.from('members').select('id', { count: 'exact', head: true });
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { count, error } = await query;
      
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error('Error fetching total members:', err);
      return 0;
    }
  };

  const fetchTodayCheckIns = async (todayStr: string): Promise<number> => {
    try {
      let query = supabase
        .from('member_attendance')
        .select('id', { count: 'exact', head: true })
        .gte('check_in', `${todayStr}T00:00:00`)
        .lt('check_in', `${todayStr}T23:59:59`);
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { count, error } = await query;
      
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error('Error fetching today check-ins:', err);
      return 0;
    }
  };

  const fetchRevenueData = async (): Promise<{ daily: number; weekly: number; monthly: number }> => {
    try {
      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      
      const todayStr = today.toISOString().split('T')[0];
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      const monthAgoStr = monthAgo.toISOString().split('T')[0];
      
      let queryDaily = supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', `${todayStr}T00:00:00`)
        .lt('payment_date', `${todayStr}T23:59:59`);
        
      let queryWeekly = supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', `${weekAgoStr}T00:00:00`);
        
      let queryMonthly = supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', `${monthAgoStr}T00:00:00`);
      
      if (currentBranch?.id) {
        queryDaily = queryDaily.eq('branch_id', currentBranch.id);
        queryWeekly = queryWeekly.eq('branch_id', currentBranch.id);
        queryMonthly = queryMonthly.eq('branch_id', currentBranch.id);
      }
      
      const [dailyResult, weeklyResult, monthlyResult] = await Promise.all([
        queryDaily,
        queryWeekly,
        queryMonthly
      ]);
      
      const dailyTotal = dailyResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      const weeklyTotal = weeklyResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      const monthlyTotal = monthlyResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      
      return {
        daily: dailyTotal,
        weekly: weeklyTotal,
        monthly: monthlyTotal
      };
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      return { daily: 0, weekly: 0, monthly: 0 };
    }
  };

  const fetchPendingPayments = async (): Promise<{ count: number; total: number }> => {
    try {
      let query = supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'pending');
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const total = data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      
      return {
        count: data?.length || 0,
        total
      };
    } catch (err) {
      console.error('Error fetching pending payments:', err);
      return { count: 0, total: 0 };
    }
  };

  const fetchMembersByStatus = async (): Promise<{ active: number; inactive: number; expired: number }> => {
    try {
      let queryBase = supabase.from('members');
      
      if (currentBranch?.id) {
        queryBase = queryBase.eq('branch_id', currentBranch.id);
      }
      
      const [activeResult, inactiveResult, expiredResult] = await Promise.all([
        queryBase.select('id', { count: 'exact', head: true }).eq('status', 'active'),
        queryBase.select('id', { count: 'exact', head: true }).eq('status', 'inactive'),
        queryBase.select('id', { count: 'exact', head: true }).eq('membership_status', 'expired')
      ]);
      
      return {
        active: activeResult.count || 0,
        inactive: inactiveResult.count || 0,
        expired: expiredResult.count || 0
      };
    } catch (err) {
      console.error('Error fetching members by status:', err);
      return { active: 0, inactive: 0, expired: 0 };
    }
  };

  const fetchAttendanceTrend = async () => {
    try {
      // Get attendance for the last 14 days
      const today = new Date();
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(today.getDate() - 14);
      
      const twoWeeksAgoStr = twoWeeksAgo.toISOString();
      
      let query = supabase
        .from('member_attendance')
        .select('check_in')
        .gte('check_in', twoWeeksAgoStr);
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process data into daily counts
      const attendanceByDay: { [key: string]: number } = {};
      
      // Initialize all days in the range with 0
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        attendanceByDay[dateStr] = 0;
      }
      
      // Count attendance for each day
      data?.forEach(item => {
        const dateStr = new Date(item.check_in).toISOString().split('T')[0];
        if (attendanceByDay[dateStr] !== undefined) {
          attendanceByDay[dateStr]++;
        }
      });
      
      // Convert to array format needed for charts
      return Object.entries(attendanceByDay)
        .map(([date, count]) => ({
          date,
          count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
        
    } catch (err) {
      console.error('Error fetching attendance trend:', err);
      return [];
    }
  };

  const fetchUpcomingRenewals = async (): Promise<number> => {
    try {
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      const todayStr = today.toISOString().split('T')[0];
      const thirtyDaysLaterStr = thirtyDaysLater.toISOString().split('T')[0];
      
      let query = supabase
        .from('member_memberships')
        .select('id', { count: 'exact', head: true })
        .gte('end_date', todayStr)
        .lte('end_date', thirtyDaysLaterStr)
        .eq('status', 'active');
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { count, error } = await query;
      
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error('Error fetching upcoming renewals:', err);
      return 0;
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data?.map(item => ({
        id: item.id,
        userId: item.author_id,
        title: item.title,
        message: item.content,
        type: item.priority,
        read: false,
        createdAt: item.created_at
      })) || [];
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  };

  return {
    dashboardData,
    isLoading,
    error,
    refreshData: fetchDashboardData
  };
};

export default useDashboard;
