
import { supabase } from '@/integrations/supabase/client';
import { DashboardSummary } from '@/hooks/dashboard/use-dashboard';

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
    
    // Try to fetch analytics data from the dashboard view first
    try {
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics_dashboard_stats')
        .select('*')
        .eq('branch_id', branchId)
        .single();
        
      if (!analyticsError && analyticsData) {
        // If we have data from the view, use it to populate our summary
        summary = {
          ...summary,
          totalMembers: analyticsData.total_members || 0,
          activeMembers: analyticsData.active_members || 0,
          totalIncome: analyticsData.total_income || 0,
          revenue: {
            daily: analyticsData.daily_revenue || 0,
            weekly: analyticsData.weekly_revenue || 0,
            monthly: analyticsData.monthly_revenue || 0
          },
          pendingPayments: {
            count: analyticsData.pending_payments_count || 0,
            total: analyticsData.pending_payments_total || 0
          },
          upcomingRenewals: analyticsData.upcoming_renewals || 0,
          todayCheckIns: analyticsData.today_check_ins || 0,
          newMembers: analyticsData.new_members || 0,
          expiringMemberships: analyticsData.expiring_memberships || 0
        };
        
        // Return early since we have all the data we need
        return summary;
      }
      
      // If the view doesn't exist or returned an error, fall back to direct table queries
      console.log('Analytics view not available, falling back to direct queries');
    } catch (viewError) {
      console.error('Error fetching from analytics view:', viewError);
      // Continue with direct table queries
    }
    
    // Fetch analytics data directly from tables as a fallback
    if (branchId) {
      try {
        // 1. Get active members count
        const { data: activeMembers, error: activeMembersError } = await supabase
          .from('profiles')
          .select('id')
          .eq('branch_id', branchId)
          .eq('role', 'member')
          .eq('status', 'active');
          
        if (!activeMembersError) {
          summary.activeMembers = activeMembers?.length || 0;
          summary.totalMembers = activeMembers?.length || 0; // For now, total = active
        }
        
        // 2. Get new members (joined in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { data: newMembers, error: newMembersError } = await supabase
          .from('profiles')
          .select('id')
          .eq('branch_id', branchId)
          .eq('role', 'member')
          .gte('created_at', thirtyDaysAgo.toISOString());
          
        if (!newMembersError) {
          summary.newMembers = newMembers?.length || 0;
        }
        
        // 3. Get today's check-ins
        const today = new Date().toISOString().split('T')[0];
        const { data: checkIns, error: checkInsError } = await supabase
          .from('check_ins')
          .select('id')
          .eq('branch_id', branchId)
          .gte('check_in_time', today);
          
        if (!checkInsError) {
          summary.todayCheckIns = checkIns?.length || 0;
        }
        
        // 4. Get upcoming renewals (memberships expiring in the next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const { data: renewals, error: renewalsError } = await supabase
          .from('member_memberships')
          .select('id')
          .eq('branch_id', branchId)
          .eq('status', 'active')
          .lte('end_date', thirtyDaysFromNow.toISOString())
          .gte('end_date', new Date().toISOString());
          
        if (!renewalsError) {
          summary.upcomingRenewals = renewals?.length || 0;
        }
        
        // 5. Get total revenue
        const { data: invoices, error: invoicesError } = await supabase
          .from('invoices')
          .select('amount')
          .eq('branch_id', branchId)
          .eq('status', 'paid');
          
        if (!invoicesError && invoices) {
          const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
          summary.totalIncome = totalRevenue;
          summary.revenue = {
            monthly: totalRevenue,
            weekly: totalRevenue / 4,  // Approximation
            daily: totalRevenue / 30   // Approximation
          };
        }
        
        // 6. Generate attendance trend data for the last 7 days
        const attendanceTrend = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const { data: dayCheckIns, error: dayCheckInsError } = await supabase
            .from('check_ins')
            .select('id')
            .eq('branch_id', branchId)
            .gte('check_in_time', dateStr)
            .lt('check_in_time', dateStr + 'T23:59:59');
            
          attendanceTrend.push({
            date: dateStr,
            count: dayCheckIns?.length || 0
          });
        }
        
        summary.attendanceTrend = attendanceTrend.reverse();
        
        // 7. Get member status breakdown
        const { data: activeCount, error: activeError } = await supabase
          .from('profiles')
          .select('id')
          .eq('branch_id', branchId)
          .eq('role', 'member')
          .eq('status', 'active');
          
        const { data: inactiveCount, error: inactiveError } = await supabase
          .from('profiles')
          .select('id')
          .eq('branch_id', branchId)
          .eq('role', 'member')
          .eq('status', 'inactive');
          
        const { data: expiredCount, error: expiredError } = await supabase
          .from('profiles')
          .select('id')
          .eq('branch_id', branchId)
          .eq('role', 'member')
          .eq('membership_status', 'expired');
          
        summary.membersByStatus = {
          active: activeCount?.length || 0,
          inactive: inactiveCount?.length || 0,
          expired: expiredCount?.length || 0
        };
        
        // 8. Generate revenue data for the last 6 months
        try {
          // First try to get revenue data from the revenue_monthly_stats view
          const { data: revenueStats, error: revenueStatsError } = await supabase
            .from('revenue_monthly_stats')
            .select('*')
            .eq('branch_id', branchId)
            .order('year', { ascending: false })
            .order('month', { ascending: false })
            .limit(6);
            
          if (!revenueStatsError && revenueStats && revenueStats.length > 0) {
            // If we have data from the view, use it
            summary.revenueData = revenueStats.map(stat => ({
              month: new Date(stat.year, stat.month - 1, 1).toLocaleString('default', { month: 'short' }),
              revenue: stat.revenue || 0,
              expenses: stat.expenses || 0,
              profit: (stat.revenue || 0) - (stat.expenses || 0)
            }));
          } else {
            // Fall back to calculating revenue data manually
            const revenueData = [];
            
            for (let i = 0; i < 6; i++) {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const month = date.toLocaleString('default', { month: 'short' });
              const year = date.getFullYear();
              const startOfMonth = new Date(year, date.getMonth(), 1).toISOString();
              const endOfMonth = new Date(year, date.getMonth() + 1, 0).toISOString();
              
              const { data: monthInvoices, error: monthInvoicesError } = await supabase
                .from('invoices')
                .select('amount')
                .eq('branch_id', branchId)
                .eq('status', 'paid')
                .gte('created_at', startOfMonth)
                .lte('created_at', endOfMonth);
                
              const { data: monthExpenses, error: monthExpensesError } = await supabase
                .from('expenses')
                .select('amount')
                .eq('branch_id', branchId)
                .gte('date', startOfMonth)
                .lte('date', endOfMonth);
                
              const revenue = monthInvoices ? monthInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) : 0;
              const expenses = monthExpenses ? monthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0) : 0;
              
              revenueData.push({
                month,
                revenue,
                expenses,
                profit: revenue - expenses
              });
            }
            
            summary.revenueData = revenueData.reverse();
          }
        } catch (revenueError) {
          console.error('Error fetching revenue data:', revenueError);
          // Set empty revenue data as fallback
          summary.revenueData = [];
        }
        
      } catch (error) {
        console.error('Error in analytics data fetching:', error);
        // Continue with default/mock data if there's an error
      }
    }
    
    // Only use mock data if we don't have real data
    if (!summary.attendanceTrend || summary.attendanceTrend.length === 0) {
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
      summary.attendanceTrend = mockAttendanceTrend.reverse();
    }
    
    // Only use mock revenue data if we don't have real data
    if (!summary.revenueData || summary.revenueData.length === 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const mockRevenueData = months.map(month => ({
        month,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        expenses: Math.floor(Math.random() * 30000) + 5000,
        profit: Math.floor(Math.random() * 20000) + 5000
      }));
      summary.revenueData = mockRevenueData;
    }
    
    // Only use mock member status if we don't have real data
    if (!summary.membersByStatus || 
        (summary.membersByStatus.active === 0 && 
         summary.membersByStatus.inactive === 0 && 
         summary.membersByStatus.expired === 0)) {
      summary.membersByStatus = {
        active: summary.activeMembers,
        inactive: Math.floor(summary.activeMembers * 0.2),
        expired: Math.floor(summary.activeMembers * 0.1)
      };
    }
    
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
      .from('class_schedules_with_trainers')
      .select(`
        id,
        name,
        type,
        start_time,
        end_time,
        capacity,
        enrolled,
        trainer_id,
        trainer_name,
        trainer_avatar_url
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
    throw error;
  }
};
