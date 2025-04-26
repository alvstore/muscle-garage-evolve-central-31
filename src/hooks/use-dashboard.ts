
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
      const { count: totalMembers } = await memberQuery.count();
      
      // Fetch active members (with active memberships)
      let activeMemberQuery = supabase
        .from('profiles')
        .select('id')
        .eq('role', 'member')
        .in('status', ['active', 'trial']);
      
      if (branchFilter && user.role !== 'admin') {
        activeMemberQuery = activeMemberQuery.eq('branch_id', branchFilter);
      }
      
      const { count: activeMembers } = await activeMemberQuery.count();
      
      // Fetch total income from transactions
      let incomeQuery = supabase
        .from('transactions')
        .select('amount');
      
      if (branchFilter && user.role !== 'admin') {
        incomeQuery = incomeQuery.eq('branch_id', branchFilter);
      }
      
      const { data: incomeData } = await incomeQuery;
      const totalIncome = incomeData ? incomeData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
      
      // Fetch member status distribution
      let memberStatusQuery = supabase
        .from('profiles')
        .select('status')
        .eq('role', 'member');
      
      if (branchFilter && user.role !== 'admin') {
        memberStatusQuery = memberStatusQuery.eq('branch_id', branchFilter);
      }
      
      const { data: memberStatusData } = await memberStatusQuery;
      
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
      
      const { data: attendanceData } = await attendanceQuery;
      
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
      
      const { data: revenueRawData } = await revenueQuery;
      
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
      
      const { count: totalTrainers } = await trainerQuery.count();
      
      // Get active classes
      let classesQuery = supabase
        .from('classes')
        .select('id')
        .eq('status', 'active');
      
      if (branchFilter && user.role !== 'admin') {
        classesQuery = classesQuery.eq('branch_id', branchFilter);
      }
      
      const { count: activeClasses } = await classesQuery.count();
      
      // Update dashboard data
      setDashboardData({
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        totalIncome,
        totalTrainers: totalTrainers || 0,
        activeClasses: activeClasses || 0,
        membersByStatus,
        attendanceTrend,
        revenueData
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fall back to empty data
      setDashboardData({
        totalMembers: 0,
        activeMembers: 0,
        totalIncome: 0,
        membersByStatus: {
          active: 0,
          inactive: 0,
          expired: 0
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
