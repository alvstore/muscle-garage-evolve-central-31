
import { supabase } from '@/services/supabaseClient';
import { DashboardSummary } from '@/hooks/use-dashboard';

export const fetchDashboardSummary = async (branchId?: string): Promise<DashboardSummary> => {
  try {
    // Initialize default values
    let summary: DashboardSummary = {
      totalMembers: 0,
      activeMembers: 0,
      pendingPayments: { count: 0, total: 0 },
      upcomingRenewals: 0,
      todayCheckIns: 0,
      revenue: {
        daily: 0,
        weekly: 0,
        monthly: 0
      }
    };

    // Build our queries with branch filter if provided
    let branchFilter = branchId ? { branch_id: branchId } : {};
    
    // Total members count
    const { count: totalMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq(branchId ? 'branch_id' : 'id', branchId || '');
    
    // Active members count
    const { count: activeMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq(branchId ? 'branch_id' : 'id', branchId || '');
    
    // Pending payments
    const { data: pendingPayments } = await supabase
      .from('invoices')
      .select('id, amount')
      .eq('status', 'pending')
      .eq(branchId ? 'branch_id' : 'id', branchId || '');
    
    // Today's check-ins
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: todayCheckIns } = await supabase
      .from('member_attendance')
      .select('*', { count: 'exact', head: true })
      .gte('check_in', today.toISOString())
      .eq(branchId ? 'branch_id' : 'id', branchId || '');
    
    // Upcoming membership renewals
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const { count: upcomingRenewals } = await supabase
      .from('member_memberships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .lt('end_date', nextWeek.toISOString())
      .gt('end_date', today.toISOString())
      .eq(branchId ? 'branch_id' : 'id', branchId || '');
    
    // Revenue calculations
    // Daily revenue
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    
    const { data: dailyPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('payment_date', dayStart.toISOString())
      .eq(branchId ? 'branch_id' : 'id', branchId || '');
    
    // Weekly revenue
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const { data: weeklyPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('payment_date', weekStart.toISOString())
      .eq(branchId ? 'branch_id' : 'id', branchId || '');
    
    // Monthly revenue
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const { data: monthlyPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('payment_date', monthStart.toISOString())
      .eq(branchId ? 'branch_id' : 'id', branchId || '');
    
    // Calculate totals
    const pendingPaymentsTotal = pendingPayments?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0;
    const dailyRevenueTotal = dailyPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
    const weeklyRevenueTotal = weeklyPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
    const monthlyRevenueTotal = monthlyPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
    
    // Assemble the summary object
    summary = {
      totalMembers: totalMembers || 0,
      activeMembers: activeMembers || 0,
      pendingPayments: { 
        count: pendingPayments?.length || 0, 
        total: pendingPaymentsTotal 
      },
      upcomingRenewals: upcomingRenewals || 0,
      todayCheckIns: todayCheckIns || 0,
      revenue: {
        daily: dailyRevenueTotal,
        weekly: weeklyRevenueTotal,
        monthly: monthlyRevenueTotal
      }
    };
    
    return summary;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};
