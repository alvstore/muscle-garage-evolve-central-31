
import { supabase } from "./supabaseClient";
import { BranchAnalytics, ClassItem, DashboardSummary, MemberStatusData, Payment, RenewalItem } from "@/types/dashboard";
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

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
      revenueData: []
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

    // Use raw SQL query for group by functionality
    const { data: attendanceData, error: attendanceError } = await supabase
      .rpc('get_daily_attendance', { days: 7, branch_filter: branchId || null });

    if (attendanceError) {
      console.error('Error fetching attendance trend:', attendanceError);
      // Fallback to empty data
      summary.attendanceTrend = last7Days.map(date => ({ date, count: 0 }));
    } else {
      const attendanceMap = new Map(attendanceData?.map(item => [item.date, item.count]) || []);
      summary.attendanceTrend = last7Days.map(date => ({
        date,
        count: attendanceMap.get(date) || 0
      }));
    }

    // Get membership status breakdown
    const { data: activeMembers, error: activeMembersError } = await supabase
      .rpc('get_member_status_counts', { status_filter: 'active', branch_filter: branchId || null });

    if (!activeMembersError && activeMembers) {
      summary.membersByStatus = {
        active: activeMembers[0]?.count || 0,
        inactive: 0,
        expired: 0
      };
    }

    // Revenue data for chart over last 6 months
    const { data: revenueChartData, error: revenueChartError } = await supabase
      .rpc('get_monthly_revenue', { months_back: 6, branch_filter: branchId || null });

    if (!revenueChartError && revenueChartData) {
      summary.revenueData = revenueChartData.map(item => ({
        month: item.month,
        revenue: item.revenue || 0,
        expenses: item.expenses || 0,
        profit: (item.revenue || 0) - (item.expenses || 0)
      }));
    }

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
        members:member_id (
          id,
          name,
          email,
          phone
        ),
        memberships:membership_plan_id (
          name
        )
      `)
      .eq('status', 'pending')
      .order('due_date')
      .limit(5);

    if (error) throw error;

    return (data || []).map(invoice => ({
      id: invoice.id,
      memberId: invoice.members?.id || '',
      memberName: invoice.members?.name || 'Unknown',
      membershipPlan: invoice.memberships?.name || 'Standard',
      amount: invoice.amount,
      dueDate: invoice.due_date,
      status: invoice.status === 'overdue' ? 'overdue' : 'pending',
      contactInfo: invoice.members?.phone || invoice.members?.email || ''
    }));
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
        members:member_id (
          id,
          name
        ),
        memberships:membership_id (
          name
        )
      `)
      .eq('status', 'active')
      .lte('end_date', format(subDays(new Date(), -30), 'yyyy-MM-dd'))
      .order('end_date')
      .limit(5);

    if (error) throw error;

    return (data || []).map(membership => ({
      id: membership.id,
      memberName: membership.members?.name || 'Unknown',
      membershipPlan: membership.memberships?.name || 'Standard',
      expiryDate: membership.end_date,
      status: membership.status,
      renewalAmount: membership.total_amount || 0
    }));
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
        profiles:trainer_id (
          full_name,
          avatar_url
        )
      `)
      .gt('start_time', today.toISOString())
      .order('start_time')
      .limit(5);

    if (error) throw error;

    return (data || []).map(classItem => {
      const startTime = new Date(classItem.start_time);
      const endTime = new Date(classItem.end_time);
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      return {
        id: classItem.id,
        name: classItem.name,
        trainer: classItem.profiles?.full_name || 'TBD',
        trainerAvatar: classItem.profiles?.avatar_url,
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
        members:members (
          id
        ),
        payments:payments (
          amount
        ),
        member_attendance:member_attendance (
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
