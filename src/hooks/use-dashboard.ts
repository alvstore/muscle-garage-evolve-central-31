
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';

export interface DashboardSummary {
  totalMembers: number;
  todayCheckIns: number;
  pendingPayments: {
    total: number;
    count: number;
  };
  upcomingRenewals: number;
  revenue: {
    current: number;
    previous: number;
    percentChange: number;
  };
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    totalMembers: 0,
    todayCheckIns: 0,
    pendingPayments: {
      total: 0,
      count: 0
    },
    upcomingRenewals: 0,
    revenue: {
      current: 0,
      previous: 0,
      percentChange: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch total members
      const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('branch_id', currentBranch?.id || '');

      // Fetch today's check-ins
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayCheckIns } = await supabase
        .from('member_attendance')
        .select('*', { count: 'exact', head: true })
        .gte('check_in', today.toISOString())
        .eq('branch_id', currentBranch?.id || '');

      // Fetch pending payments
      const { data: pendingInvoices } = await supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'pending')
        .eq('branch_id', currentBranch?.id || '');

      const pendingTotal = pendingInvoices?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0;

      // Fetch upcoming renewals
      const oneWeekLater = new Date();
      oneWeekLater.setDate(today.getDate() + 7);
      
      const { count: upcomingRenewals } = await supabase
        .from('member_memberships')
        .select('*', { count: 'exact', head: true })
        .lt('end_date', oneWeekLater.toISOString())
        .gt('end_date', today.toISOString())
        .eq('branch_id', currentBranch?.id || '');
      
      // Calculate revenue
      const currentMonth = new Date();
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      
      const { data: currentMonthRevenue } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString())
        .eq('branch_id', currentBranch?.id || '');
        
      const { data: previousMonthRevenue } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1).toISOString())
        .lt('payment_date', new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString())
        .eq('branch_id', currentBranch?.id || '');
      
      const currentRevenue = currentMonthRevenue?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const previousRevenue = previousMonthRevenue?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const percentChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      
      setDashboardData({
        totalMembers: totalMembers || 0,
        todayCheckIns: todayCheckIns || 0,
        pendingPayments: {
          total: pendingTotal,
          count: pendingInvoices?.length || 0
        },
        upcomingRenewals: upcomingRenewals || 0,
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          percentChange
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchDashboardData();
    }
  }, [currentBranch?.id]);

  return {
    dashboardData,
    isLoading,
    refreshData: fetchDashboardData
  };
};
