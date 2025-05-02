
import { supabase } from '@/services/supabaseClient';
import { DashboardSummary } from '@/hooks/use-dashboard';

export const fetchDashboardSummary = async (branchId?: string): Promise<DashboardSummary> => {
  try {
    // Initialize default values
    let summary: DashboardSummary = {
      totalMembers: 0,
      activeMembers: 0,
      totalIncome: 0,
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
      todayCheckIns: 0,
      // Add missing properties with defaults
      newMembers: 0,
      expiringMemberships: 0,
      membersByStatus: {
        active: 0,
        inactive: 0,
        expired: 0
      },
      attendanceTrend: [],
      revenueData: []
    };

    // Build our queries with branch filter if provided
    let branchFilter = branchId ? { branch_id: branchId } : {};
    
    // Fetch analytics data from the new view
    if (branchId) {
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics_dashboard_stats')
        .select('*')
        .eq('branch_id', branchId)
        .single();
        
      if (!analyticsError && analyticsData) {
        summary = {
          ...summary,
          activeMembers: analyticsData.active_members || 0,
          newMembers: analyticsData.new_members_daily || 0,
          totalMembers: analyticsData.active_members || 0, // Assuming total = active for now
          todayCheckIns: analyticsData.weekly_check_ins || 0,
          upcomingRenewals: analyticsData.upcoming_renewals || 0,
          totalIncome: analyticsData.total_revenue || 0,
          revenue: {
            daily: analyticsData.total_revenue / 30 || 0, // Approximation
            weekly: analyticsData.total_revenue / 4 || 0, // Approximation
            monthly: analyticsData.total_revenue || 0
          }
        };
      }
    }
    
    // Create mock attendance trend (we'll replace later)
    const mockAttendanceTrend = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      mockAttendanceTrend.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 50) + 10
      });
    }
    
    // Create mock revenue data (we'll replace later)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const mockRevenueData = months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      expenses: Math.floor(Math.random() * 30000) + 5000,
      profit: Math.floor(Math.random() * 20000) + 5000
    }));
    
    // Add mock data (to be replaced with real data)
    summary.attendanceTrend = mockAttendanceTrend.reverse();
    summary.revenueData = mockRevenueData;
    summary.membersByStatus = {
      active: summary.activeMembers,
      inactive: Math.floor(summary.activeMembers * 0.2),
      expired: Math.floor(summary.activeMembers * 0.1)
    };
    
    return summary;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

export const fetchPendingPayments = async (branchId?: string) => {
  try {
    const query = supabase
      .from('invoices')
      .select(`
        id,
        member_id,
        amount,
        due_date,
        status,
        issued_date,
        members(name, email, phone)
      `)
      .eq('status', 'pending');
    
    if (branchId) {
      query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    return [];
  }
};

export const fetchMembershipRenewals = async (branchId?: string) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const query = supabase
      .from('member_memberships')
      .select(`
        id,
        member_id,
        start_date,
        end_date,
        status,
        total_amount,
        amount_paid,
        members(name, email, phone),
        memberships(name, price)
      `)
      .eq('status', 'active')
      .lt('end_date', nextWeek.toISOString())
      .gt('end_date', today.toISOString());
    
    if (branchId) {
      query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming renewals:', error);
    return [];
  }
};

export const fetchUpcomingClasses = async (branchId?: string) => {
  try {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59);
    
    const query = supabase
      .from('class_schedules')
      .select(`
        id,
        name,
        type,
        start_time,
        end_time,
        capacity,
        enrolled,
        trainer_id,
        profiles(full_name)
      `)
      .gte('start_time', now.toISOString())
      .lte('start_time', tomorrow.toISOString())
      .order('start_time');
    
    if (branchId) {
      query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming classes:', error);
    return [];
  }
};
