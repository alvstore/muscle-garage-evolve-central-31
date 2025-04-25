import { supabase } from "@/integrations/supabase/client";
import { BranchAnalytics, ClassItem, DashboardSummary, MemberStatusData, Payment, RenewalItem } from "@/types/dashboard";
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

// Helper function for safer property access
const safeGet = <T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined => {
  return obj ? obj[key] : undefined;
};

export async function fetchDashboardSummary(branchId?: string): Promise<DashboardSummary> {
  try {
    // Start with default empty summary
    const summary: DashboardSummary = {
      totalMembers: 0,
      todayCheckIns: 0,
      upcomingRenewals: 0,
      pendingPayments: {
        count: 0,
        total: 0
      },
      revenue: {
        daily: 0,
        weekly: 0,
        monthly: 0
      },
      attendanceTrend: [],
      revenueData: [],
      membersByStatus: {
        active: 0,
        inactive: 0,
        expired: 0
      }
    };

    // Get total members
    const { count: totalMembers, error: membersError } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    if (membersError) throw membersError;
    summary.totalMembers = totalMembers || 0;

    // Get today's check-ins
    const today = format(new Date(), 'yyyy-MM-dd');
    const { count: todayCheckIns, error: checkInsError } = await supabase
      .from('member_attendance')
      .select('*', { count: 'exact', head: true })
      .gte('check_in', `${today}T00:00:00`)
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    if (checkInsError) throw checkInsError;
    summary.todayCheckIns = todayCheckIns || 0;

    // Get upcoming renewals
    const nextWeek = format(subDays(new Date(), -7), 'yyyy-MM-dd');
    const { count: upcomingRenewals, error: renewalsError } = await supabase
      .from('member_memberships')
      .select('*', { count: 'exact', head: true })
      .lte('end_date', nextWeek)
      .eq('status', 'active')
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    if (renewalsError) throw renewalsError;
    summary.upcomingRenewals = upcomingRenewals || 0;

    // Get revenue data
    // Daily revenue
    const { data: dailyRevenue, error: dailyRevenueError } = await supabase
      .from('payments')
      .select('amount')
      .gte('payment_date', `${today}T00:00:00`)
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    if (dailyRevenueError) throw dailyRevenueError;
    summary.revenue.daily = dailyRevenue?.reduce((total, payment) => total + (payment.amount || 0), 0) || 0;

    // Weekly revenue
    const startOfCurrentWeek = format(startOfWeek(new Date()), 'yyyy-MM-dd');
    const endOfCurrentWeek = format(endOfWeek(new Date()), 'yyyy-MM-dd');
    
    const { data: weeklyRevenue, error: weeklyRevenueError } = await supabase
      .from('payments')
      .select('amount')
      .gte('payment_date', `${startOfCurrentWeek}T00:00:00`)
      .lte('payment_date', `${endOfCurrentWeek}T23:59:59`)
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    if (weeklyRevenueError) throw weeklyRevenueError;
    summary.revenue.weekly = weeklyRevenue?.reduce((total, payment) => total + (payment.amount || 0), 0) || 0;

    // Monthly revenue
    const startOfCurrentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const endOfCurrentMonth = format(endOfMonth(new Date()), 'yyyy-MM-dd');
    
    const { data: monthlyRevenue, error: monthlyRevenueError } = await supabase
      .from('payments')
      .select('amount')
      .gte('payment_date', `${startOfCurrentMonth}T00:00:00`)
      .lte('payment_date', `${endOfCurrentMonth}T23:59:59`)
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    if (monthlyRevenueError) throw monthlyRevenueError;
    summary.revenue.monthly = monthlyRevenue?.reduce((total, payment) => total + (payment.amount || 0), 0) || 0;

    // Get pending payments
    const { data: pendingPayments, error: pendingPaymentsError } = await supabase
      .from('invoices')
      .select('amount')
      .eq('status', 'pending')
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    if (pendingPaymentsError) throw pendingPaymentsError;
    summary.pendingPayments.count = pendingPayments?.length || 0;
    summary.pendingPayments.total = pendingPayments?.reduce((total, invoice) => total + (invoice.amount || 0), 0) || 0;

    // Get attendance trend for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    // Instead of using RPC which doesn't exist, use manual queries
    const attendanceTrend: { date: string; count: number }[] = [];

    for (const day of last7Days) {
      const { count, error } = await supabase
        .from('member_attendance')
        .select('*', { count: 'exact', head: true })
        .gte('check_in', `${day}T00:00:00`)
        .lte('check_in', `${day}T23:59:59`)
        .eq(branchId ? 'branch_id' : 'id', branchId || '');

      if (error) {
        console.error(`Error fetching attendance for ${day}:`, error);
        attendanceTrend.push({ date: day, count: 0 });
      } else {
        attendanceTrend.push({ date: day, count: count || 0 });
      }
    }

    summary.attendanceTrend = attendanceTrend;

    // Get membership status breakdown - manual count instead of RPC
    const { count: activeCount, error: activeError } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    const { count: inactiveCount, error: inactiveError } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'inactive')
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    const { count: expiredCount, error: expiredError } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'expired')
      .eq(branchId ? 'branch_id' : 'id', branchId || '');

    summary.membersByStatus = {
      active: activeCount || 0,
      inactive: inactiveCount || 0,
      expired: expiredCount || 0
    };

    // Revenue data for chart over last 6 months - manual collection instead of RPC
    const revenueData: {
      month: string;
      revenue: number;
      expenses: number;
      profit: number;
    }[] = [];

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = format(startOfMonth(date), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(date), 'yyyy-MM-dd');
      const monthLabel = format(date, 'MMM yyyy');

      // Get revenue
      const { data: monthRevenue, error: monthRevError } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', `${monthStart}T00:00:00`)
        .lte('payment_date', `${monthEnd}T23:59:59`)
        .eq(branchId ? 'branch_id' : 'id', branchId || '');

      // Get expenses
      const { data: monthExpenses, error: monthExpError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'expense')
        .gte('transaction_date', `${monthStart}T00:00:00`)
        .lte('transaction_date', `${monthEnd}T23:59:59`)
        .eq(branchId ? 'branch_id' : 'id', branchId || '');

      const revenue = monthRevenue?.reduce((total, payment) => total + (payment.amount || 0), 0) || 0;
      const expenses = monthExpenses?.reduce((total, expense) => total + (expense.amount || 0), 0) || 0;

      revenueData.push({
        month: monthLabel,
        revenue,
        expenses,
        profit: revenue - expenses
      });
    }

    summary.revenueData = revenueData;

    return summary;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
}

export async function fetchPendingPayments(branchId?: string): Promise<Payment[]> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        id,
        amount,
        due_date,
        status,
        members (
          id,
          name,
          email,
          phone
        ),
        memberships (
          name
        )
      `)
      .eq('status', 'pending')
      .eq(branchId ? 'branch_id' : 'id', branchId || '')
      .order('due_date')
      .limit(5);

    if (error) throw error;

    return (data || []).map(invoice => {
      const members = invoice.members as any;
      const memberships = invoice.memberships as any;
      
      return {
        id: invoice.id,
        memberId: members?.id || '',
        memberName: members?.name || 'Unknown',
        membershipPlan: memberships?.name || 'Standard',
        amount: invoice.amount,
        dueDate: invoice.due_date,
        status: invoice.status === 'overdue' ? 'overdue' : 'pending',
        contactInfo: members?.phone || members?.email || ''
      };
    });
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    return [];
  }
}

export async function fetchMembershipRenewals(branchId?: string): Promise<RenewalItem[]> {
  try {
    const { data, error } = await supabase
      .from('member_memberships')
      .select(`
        id,
        end_date,
        status,
        total_amount,
        members (
          id,
          name
        ),
        memberships (
          name
        )
      `)
      .eq('status', 'active')
      .lte('end_date', format(subDays(new Date(), -30), 'yyyy-MM-dd'))
      .eq(branchId ? 'branch_id' : 'id', branchId || '')
      .order('end_date')
      .limit(5);

    if (error) throw error;

    return (data || []).map(membership => {
      const members = membership.members as any;
      const memberships = membership.memberships as any;
      
      return {
        id: membership.id,
        memberName: members?.name || 'Unknown',
        membershipPlan: memberships?.name || 'Standard',
        expiryDate: membership.end_date,
        status: (membership.status as 'active' | 'inactive' | 'expired'),
        renewalAmount: membership.total_amount || 0
      };
    });
  } catch (error) {
    console.error("Error fetching membership renewals:", error);
    return [];
  }
}

export async function fetchUpcomingClasses(branchId?: string): Promise<ClassItem[]> {
  try {
    const today = new Date();
    const { data, error } = await supabase
      .from('class_schedules')
      .select(`
        id,
        name,
        start_time,
        end_time,
        capacity,
        enrolled,
        type,
        difficulty,
        trainer:profiles!class_schedules_trainer_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .gt('start_time', today.toISOString())
      .eq(branchId ? 'branch_id' : 'id', branchId || '')
      .order('start_time')
      .limit(5);

    if (error) throw error;

    return (data || []).map(classItem => {
      const startTime = new Date(classItem.start_time);
      const endTime = new Date(classItem.end_time);
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      const trainer = classItem.trainer as any;
      
      return {
        id: classItem.id,
        name: classItem.name,
        trainer: trainer?.full_name || 'TBD',
        trainerAvatar: trainer?.avatar_url,
        time: format(startTime, 'h:mm a'),
        duration: `${duration} min`,
        capacity: classItem.capacity,
        enrolled: classItem.enrolled || 0,
        type: classItem.type,
        level: classItem.difficulty as any
      };
    });
  } catch (error) {
    console.error("Error fetching upcoming classes:", error);
    return [];
  }
}

export async function fetchBranchAnalytics(): Promise<BranchAnalytics[]> {
  try {
    const { data, error } = await supabase
      .from('branches')
      .select(`
        id,
        name,
        members!inner (
          id
        ),
        payments (
          amount
        ),
        member_attendance (
          id
        )
      `);

    if (error) throw error;

    return (data || []).map(branch => ({
      branchId: branch.id,
      branchName: branch.name,
      memberCount: branch.members?.length || 0,
      revenue: branch.payments?.reduce((total, payment) => total + (payment.amount || 0), 0) || 0,
      attendance: branch.member_attendance?.length || 0
    }));
  } catch (error) {
    console.error("Error fetching branch analytics:", error);
    return [];
  }
}
