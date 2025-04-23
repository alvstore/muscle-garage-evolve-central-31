
import { supabase } from "@/integrations/supabase/client";

export const dashboardService = {
  async getDashboardData(branchId?: string) {
    try {
      // Get members count
      const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null');

      // Get active members count
      const { count: activeMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .eq('status', 'active');

      // Get attendance for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: attendanceToday } = await supabase
        .from('member_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .gte('check_in', today.toISOString());

      // Get new members today
      const { count: newMembersToday } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .gte('created_at', today.toISOString());

      // Get revenue for different time periods
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, transaction_date, type')
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .eq('type', 'income');

      // Process revenue data
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      let todayRevenue = 0;
      let weekRevenue = 0;
      let monthRevenue = 0;
      let lastMonthRevenue = 0;

      if (transactions) {
        transactions.forEach(transaction => {
          const transactionDate = new Date(transaction.transaction_date);
          
          // Today's revenue
          if (transactionDate >= today) {
            todayRevenue += Number(transaction.amount);
          }
          
          // This week's revenue
          if (transactionDate >= weekStart) {
            weekRevenue += Number(transaction.amount);
          }
          
          // This month's revenue
          if (transactionDate >= monthStart) {
            monthRevenue += Number(transaction.amount);
          }
          
          // Last month's revenue
          if (transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd) {
            lastMonthRevenue += Number(transaction.amount);
          }
        });
      }

      // Get pending payments
      const { data: pendingPayments } = await supabase
        .from('member_memberships')
        .select('total_amount')
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .eq('payment_status', 'pending');

      let pendingAmount = 0;
      if (pendingPayments) {
        pendingAmount = pendingPayments.reduce((sum, payment) => sum + Number(payment.total_amount), 0);
      }

      // Get upcoming renewals
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const nextMonth = new Date(now);
      nextMonth.setDate(nextMonth.getDate() + 30);

      const { count: renewalsToday } = await supabase
        .from('member_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .eq('end_date', today.toISOString().split('T')[0]);

      const { count: renewalsThisWeek } = await supabase
        .from('member_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .lte('end_date', nextWeek.toISOString().split('T')[0])
        .gte('end_date', today.toISOString().split('T')[0]);

      const { count: renewalsThisMonth } = await supabase
        .from('member_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .lte('end_date', nextMonth.toISOString().split('T')[0])
        .gte('end_date', today.toISOString().split('T')[0]);

      // Get member status counts
      const { count: inactiveMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .eq('status', 'inactive');

      const { count: expiredMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .eq('membership_status', 'expired');

      // Get attendance trend
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: attendanceTrendData } = await supabase
        .from('member_attendance')
        .select('check_in')
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .gte('check_in', sevenDaysAgo.toISOString());

      const attendanceTrend = [];
      if (attendanceTrendData) {
        // Group by date
        const attendanceByDate = attendanceTrendData.reduce((acc: Record<string, number>, record) => {
          const date = new Date(record.check_in).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        
        // Create last 7 days records
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          attendanceTrend.push({
            date: dateStr,
            count: attendanceByDate[dateStr] || 0
          });
        }
      }

      // Get revenue data for chart
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('amount, transaction_date, type')
        .eq('branch_id', branchId || '')
        .or(branchId ? '' : 'branch_id.is.null')
        .gte('transaction_date', sixMonthsAgo.toISOString());

      // Process revenue chart data
      const revenueByMonth: Record<string, { revenue: number, expenses: number }> = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
        const monthName = monthNames[month.getMonth()];
        revenueByMonth[monthKey] = { revenue: 0, expenses: 0 };
      }
      
      if (revenueData) {
        revenueData.forEach(transaction => {
          const date = new Date(transaction.transaction_date);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          
          if (revenueByMonth[monthKey]) {
            if (transaction.type === 'income') {
              revenueByMonth[monthKey].revenue += Number(transaction.amount);
            } else if (transaction.type === 'expense') {
              revenueByMonth[monthKey].expenses += Number(transaction.amount);
            }
          }
        });
      }

      const revenueChartData = Object.entries(revenueByMonth).map(([key, value]) => {
        const [year, month] = key.split('-');
        return {
          month: monthNames[parseInt(month) - 1],
          revenue: value.revenue,
          expenses: value.expenses,
          profit: value.revenue - value.expenses
        };
      });

      return {
        totalMembers: totalMembers || 0,
        newMembersToday: newMembersToday || 0,
        activeMembers: activeMembers || 0,
        attendanceToday: attendanceToday || 0,
        revenue: {
          today: todayRevenue,
          thisWeek: weekRevenue,
          thisMonth: monthRevenue,
          lastMonth: lastMonthRevenue
        },
        pendingPayments: {
          count: pendingPayments?.length || 0,
          total: pendingAmount
        },
        upcomingRenewals: {
          today: renewalsToday || 0,
          thisWeek: renewalsThisWeek || 0,
          thisMonth: renewalsThisMonth || 0
        },
        classAttendance: {
          today: attendanceToday || 0,
          yesterday: 0, // Calculate if needed
          lastWeek: 0 // Calculate if needed
        },
        membersByStatus: {
          active: activeMembers || 0,
          inactive: inactiveMembers || 0,
          expired: expiredMembers || 0
        },
        attendanceTrend,
        revenueData: revenueChartData
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return null;
    }
  }
};
