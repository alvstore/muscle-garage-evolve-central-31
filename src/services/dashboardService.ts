
import { supabase } from './supabaseClient';
import { useBranch } from '@/hooks/use-branch';

export interface DashboardSummary {
  totalMembers: number;
  activeMembers: number;
  totalTrainers: number;
  totalStaff: number;
  activeClasses: number;
  totalClasses: number;
  revenueToday: number;
  revenueThisMonth: number;
  unpaidInvoices: number;
  pendingPayments: number;
  attendanceTrend: { date: string; count: number }[];
  expiringMemberships: number;
}

/**
 * Fetches summary data for the admin dashboard
 */
export const getDashboardSummary = async (branchId?: string): Promise<DashboardSummary> => {
  try {
    // Base query with branch filter if provided
    const baseQuery = branchId ? { branch_id: branchId } : {};
    
    // Get total and active members
    const { count: totalMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .match(baseQuery);
      
    const { count: activeMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .match({ ...baseQuery, status: 'active' });
      
    // Get trainers count
    const { count: totalTrainers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .match({ ...baseQuery, role: 'trainer' });
      
    // Get staff count
    const { count: totalStaff } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .match({ ...baseQuery, role: 'staff' });
      
    // Get classes count
    const { count: totalClasses } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .match(baseQuery);
      
    const { count: activeClasses } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .match({ ...baseQuery, is_active: true });
      
    // Calculate today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: todayPayments } = await supabase
      .from('payments')
      .select('amount')
      .match({ ...baseQuery, status: 'completed' })
      .gte('payment_date', today.toISOString());
      
    const revenueToday = todayPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
    
    // Calculate this month's revenue
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const { data: monthPayments } = await supabase
      .from('payments')
      .select('amount')
      .match({ ...baseQuery, status: 'completed' })
      .gte('payment_date', firstDayOfMonth.toISOString());
      
    const revenueThisMonth = monthPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
    
    // Get unpaid invoices count
    const { count: unpaidInvoices } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .match({ ...baseQuery })
      .in('status', ['pending', 'overdue']);
      
    // Get pending payments count
    const { count: pendingPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .match({ ...baseQuery, status: 'pending' });
      
    // Get attendance trend for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: attendanceData } = await supabase
      .from('member_attendance')
      .select('check_in')
      .match(baseQuery)
      .gte('check_in', sevenDaysAgo.toISOString())
      .order('check_in', { ascending: true });
      
    // Process attendance data for trend chart
    const attendanceTrend: { date: string; count: number }[] = [];
    
    if (attendanceData) {
      const attendanceByDay = new Map<string, number>();
      
      // Initialize the map with zeros for the last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        attendanceByDay.set(dateString, 0);
      }
      
      // Count attendance for each day
      attendanceData.forEach(record => {
        const dateString = record.check_in.split('T')[0];
        const count = attendanceByDay.get(dateString) || 0;
        attendanceByDay.set(dateString, count + 1);
      });
      
      // Convert map to array for chart rendering
      attendanceByDay.forEach((count, date) => {
        attendanceTrend.push({ date, count });
      });
    }
    
    // Sort attendance trend by date
    attendanceTrend.sort((a, b) => a.date.localeCompare(b.date));
    
    // Get expiring memberships count
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { count: expiringMemberships } = await supabase
      .from('member_memberships')
      .select('*', { count: 'exact', head: true })
      .match({ ...baseQuery, status: 'active' })
      .lte('end_date', thirtyDaysFromNow.toISOString())
      .gte('end_date', today.toISOString());
      
    return {
      totalMembers: totalMembers || 0,
      activeMembers: activeMembers || 0,
      totalTrainers: totalTrainers || 0,
      totalStaff: totalStaff || 0,
      activeClasses: activeClasses || 0,
      totalClasses: totalClasses || 0,
      revenueToday,
      revenueThisMonth,
      unpaidInvoices: unpaidInvoices || 0,
      pendingPayments: pendingPayments || 0,
      attendanceTrend,
      expiringMemberships: expiringMemberships || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    // Return default values in case of error
    return {
      totalMembers: 0,
      activeMembers: 0,
      totalTrainers: 0,
      totalStaff: 0,
      activeClasses: 0,
      totalClasses: 0,
      revenueToday: 0,
      revenueThisMonth: 0,
      unpaidInvoices: 0,
      pendingPayments: 0,
      attendanceTrend: [],
      expiringMemberships: 0
    };
  }
};

/**
 * Hook to fetch real-time dashboard summary
 */
export const useDashboardSummary = () => {
  const { currentBranch } = useBranch();
  
  const fetchDashboardData = async () => {
    return await getDashboardSummary(currentBranch?.id);
  };
  
  return { fetchDashboardData };
};

/**
 * Fetches member distribution data for charts
 */
export const getMemberDistribution = async (branchId?: string) => {
  try {
    // Get member distribution by status
    const { data: statusData } = await supabase
      .from('members')
      .select('status, count')
      .match(branchId ? { branch_id: branchId } : {})
      .group('status');
      
    // Format status distribution data
    const statusDistribution = statusData?.map(item => ({
      name: item.status,
      value: item.count
    })) || [];
    
    // Get member distribution by membership type
    const { data: membershipData } = await supabase
      .from('member_memberships')
      .select('membership_id, count')
      .match(branchId ? { branch_id: branchId } : {})
      .group('membership_id');
      
    // Get membership names and combine with counts
    const membershipDistribution = [];
    if (membershipData) {
      for (const item of membershipData) {
        const { data } = await supabase
          .from('memberships')
          .select('name')
          .eq('id', item.membership_id)
          .single();
          
        if (data) {
          membershipDistribution.push({
            name: data.name,
            value: item.count
          });
        }
      }
    }
    
    return {
      statusDistribution,
      membershipDistribution
    };
  } catch (error) {
    console.error('Error fetching member distribution:', error);
    return {
      statusDistribution: [],
      membershipDistribution: []
    };
  }
};
