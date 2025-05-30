
import { supabase } from '@/integrations/supabase/client';
import type { DashboardSummary } from '@/hooks/dashboard/useDashboard';

// Dashboard Service Types
export interface PendingPayment {
  id: string;
  member_id: string;
  member_name: string;
  amount: number;
  due_date: string;
  status: string;
  issued_date: string;
  members: {
    name: string;
    email: string;
    phone: string;
  };
}

// Extended class schedule with trainer information
export interface ClassSchedule {
  id: string;
  name: string;
  type: string;
  start_time: string;
  end_time: string;
  capacity: number;
  enrolled: number;
  trainer_id: string;
  trainer_name: string;
  trainer_avatar_url: string;
  room_name?: string;
  branch_id?: string;
}

/**
 * Parameters for fetching data with branch filtering and pagination
 */
interface FetchParams {
  /** The branch ID to filter by */
  branchId?: string;
  /** Maximum number of items to return */
  limit?: number;
  [key: string]: any; // Allow additional properties for flexibility
}

/**
 * Extended class schedule with trainer information
 */
export interface ClassWithTrainer extends Omit<ClassSchedule, 'id'> {
  id: string;
  trainer_id: string;
  trainer_name: string;
  trainer_avatar_url: string;
}

/**
 * Membership renewal information with member and membership details
 */
export interface MembershipRenewal {
  id: string;
  member_id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  amount_paid: number;
  members: {
    name: string;
    email: string;
    phone: string;
  };
  memberships: {
    name: string;
    price: number;
  };
}



/**
 * Fetches pending payments with optional branch filtering
 * @param params Fetch parameters including branchId and limit
 * @returns Object containing count, total amount, and items array
 */
export const fetchPendingPayments = async (
  params: FetchParams = {}
): Promise<{ count: number; total: number; items: PendingPayment[] }> => {
  const { branchId, limit = 10 } = params;

  try {
    const query = supabase
      .from('pending_payments')
      .select(`
        id,
        member_id,
        amount,
        due_date,
        status,
        issued_date,
        members (name, email, phone)
      `, { count: 'exact' })
      .order('due_date', { ascending: true })
      .limit(limit);

    if (branchId) {
      query.eq('branch_id', branchId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching pending payments:', error);
      return { count: 0, total: 0, items: [] };
    }

    const items: PendingPayment[] = (data || []).map((payment) => ({
      id: payment.id,
      member_id: payment.member_id,
      member_name: payment.members?.name || 'Unknown Member',
      amount: payment.amount || 0,
      due_date: payment.due_date,
      status: payment.status || 'pending',
      issued_date: payment.issued_date,
      members: {
        name: payment.members?.name || 'Unknown Member',
        email: payment.members?.email || '',
        phone: payment.members?.phone || ''
      }
    }));

    const total = items.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    return { 
      count: count || items.length, 
      total, 
      items 
    };
  } catch (error) {
    console.error('Error in fetchPendingPayments:', error);
    return { count: 0, total: 0, items: [] };
  }
}

interface DashboardSummaryParams {
  branchId?: string;
  userId?: string;
  role?: string;
}

export const fetchDashboardSummary = async ({
  branchId,
  userId,
  role = 'staff'
}: DashboardSummaryParams = {}): Promise<DashboardSummary> => {
  try {
    // Validate branch ID
    if (!branchId) {
      console.warn('No branch ID provided for dashboard summary');
    }

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
        total: 0,
        items: []
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
          totalMembers: analyticsData.active_members || 0, // Use active_members for total as well
          activeMembers: analyticsData.active_members || 0,
          totalIncome: analyticsData.total_revenue || 0, // Use total_revenue instead of total_income
          revenue: {
            daily: analyticsData.daily_revenue || analyticsData.total_revenue / 30 || 0,
            weekly: analyticsData.weekly_revenue || analyticsData.total_revenue / 4 || 0,
            monthly: analyticsData.total_revenue || 0
          },
          pendingPayments: {
            count: analyticsData.pending_payments_count || 0,
            total: analyticsData.pending_payments_total || 0,
            items: []
          },
          upcomingRenewals: analyticsData.upcoming_renewals || 0,
          todayCheckIns: analyticsData.weekly_check_ins / 7 || 0, // Estimate from weekly
          newMembers: analyticsData.new_members_weekly || 0,
          expiringMemberships: analyticsData.upcoming_renewals || 0,
          membersByStatus: {
            active: analyticsData.active_members || 0,
            inactive: analyticsData.cancelled_members_monthly || 0,
            expired: 0 // Not available in the view
          }
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
          .from('members')
          .select('id')
          .eq('branch_id', branchId)
          .eq('status', 'active');
          
        if (!activeMembersError) {
          summary.activeMembers = activeMembers?.length || 0;
          summary.totalMembers = activeMembers?.length || 0; // For now, total = active
        }
        
        // 2. Get new members (joined in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { data: newMembers, error: newMembersError } = await supabase
          .from('members')
          .select('id')
          .eq('branch_id', branchId)
          .gte('created_at', thirtyDaysAgo.toISOString());
          
        if (!newMembersError) {
          summary.newMembers = newMembers?.length || 0;
        }
        
        // 3. Get today's check-ins
        const todayDate = new Date().toISOString().split('T')[0];
        const { data: checkIns, error: checkInsError } = await supabase
          .from('member_attendance')
          .select('id')
          .eq('branch_id', branchId)
          .gte('check_in', todayDate);
          
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
          .lte('end_date', thirtyDaysFromNow.toISOString().split('T')[0])
          .gte('end_date', todayDate);
          
        if (!renewalsError) {
          summary.upcomingRenewals = renewals?.length || 0;
        }
        
        // 5. Get total revenue from financial transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('branch_id', branchId)
          .eq('type', 'income')
          .eq('status', 'paid');
          
        if (!transactionsError && transactions) {
          const totalRevenue = transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
          summary.totalIncome = totalRevenue;
          summary.revenue = {
            monthly: totalRevenue,
            weekly: totalRevenue / 4,  // Approximation
            daily: totalRevenue / 30   // Approximation
          };
        }
        
        // If no transactions found, try invoices as fallback
        if (summary.totalIncome === 0) {
          const { data: invoices, error: invoicesError } = await supabase
            .from('invoices')
            .select('amount')
            .eq('branch_id', branchId)
            .eq('status', 'paid');
            
          if (!invoicesError && invoices && invoices.length > 0) {
            const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
            summary.totalIncome = totalRevenue;
            summary.revenue = {
              monthly: totalRevenue,
              weekly: totalRevenue / 4,  // Approximation
              daily: totalRevenue / 30   // Approximation
            };
          }
        }
        
        // 6. Generate attendance trend data for the last 7 days
        const attendanceTrend = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const nextDateStr = new Date(date.getTime() + 86400000).toISOString().split('T')[0];
          
          const { data: dayCheckIns, error: dayCheckInsError } = await supabase
            .from('member_attendance')
            .select('id')
            .eq('branch_id', branchId)
            .gte('check_in', dateStr)
            .lt('check_in', nextDateStr);
            
          attendanceTrend.push({
            date: dateStr,
            count: dayCheckIns?.length || 0
          });
        }
        
        summary.attendanceTrend = attendanceTrend.reverse();
        
        // 7. Get member status breakdown
        const { data: activeCount, error: activeError } = await supabase
          .from('members')
          .select('id')
          .eq('branch_id', branchId)
          .eq('status', 'active');
          
        const { data: inactiveCount, error: inactiveError } = await supabase
          .from('members')
          .select('id')
          .eq('branch_id', branchId)
          .eq('status', 'inactive');
          
        const { data: expiredCount, error: expiredError } = await supabase
          .from('members')
          .select('id')
          .eq('branch_id', branchId)
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



/**
 * Fetches upcoming membership renewals within the next 7 days
 * @param params Fetch parameters including optional branchId and limit
 * @returns Array of membership renewals with member and membership details
 */
export const fetchMembershipRenewals = async (
  params: FetchParams = {}
): Promise<MembershipRenewal[]> => {
  const { branchId, limit } = params;
  
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
        members (name, email, phone),
        memberships (name, price)
      `, { count: 'exact' })
      .eq('status', 'active')
      .lt('end_date', nextWeek.toISOString())
      .gt('end_date', today.toISOString())
      .order('end_date', { ascending: true })
      .limit(limit || 10); // Use limit from params if provided, otherwise default to 10
    
    if (branchId) {
      query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching membership renewals:', error);
      return [];
    }
    
    // Transform data to match the MembershipRenewal interface
    return (data || []).map(renewal => ({
      id: renewal.id,
      member_id: renewal.member_id,
      start_date: renewal.start_date,
      end_date: renewal.end_date,
      status: renewal.status,
      total_amount: renewal.total_amount || 0,
      amount_paid: renewal.amount_paid || 0,
      members: {
        name: renewal.members?.name || 'Unknown Member',
        email: renewal.members?.email || '',
        phone: renewal.members?.phone || ''
      },
      memberships: {
        name: renewal.memberships?.name || 'Unknown Membership',
        price: renewal.memberships?.price || 0
      }
    }));
  } catch (error) {
    console.error('Error in fetchMembershipRenewals:', error);
    return [];
  }
};

/**
 * Fetches upcoming classes scheduled for today
 * @param params Fetch parameters including optional branchId and limit
 * @returns Array of upcoming class schedules with trainer information
 */
export const fetchUpcomingClasses = async (
  params: FetchParams = {}
): Promise<ClassSchedule[]> => {
  const { branchId, limit } = params;
  
  try {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Build the base query
    let query = supabase
      .from('class_schedules')
      .select(`
        *,
        trainer:trainers (id, name, avatar_url)
      `)
      .gte('start_time', now.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .order('start_time', { ascending: true });
    
    // Add branch filter if provided
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the data to match the ClassSchedule interface
    return (data || []).map((classData: any) => ({
      id: classData.id,
      name: classData.name,
      type: classData.type,
      start_time: classData.start_time,
      end_time: classData.end_time,
      capacity: classData.capacity,
      enrolled: classData.enrolled,
      trainer_id: classData.trainer_id,
      trainer_name: classData.trainer?.name || 'Unknown Trainer',
      trainer_avatar_url: classData.trainer?.avatar_url || '',
      room_name: classData.room_name,
      branch_id: classData.branch_id
    }));
  } catch (error) {
    console.error('Error fetching upcoming classes:', error);
    return [];
  }
}
