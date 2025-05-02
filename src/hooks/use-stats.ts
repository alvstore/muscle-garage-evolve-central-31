import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';
import { subDays } from 'date-fns';

export interface DateRange {
  from: Date;
  to: Date;
}

export function useAttendanceStats(dateRange: DateRange) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get attendance data for the date range
        const { data, error } = await supabase.rpc(
          'get_attendance_trend',
          { 
            branch_id_param: currentBranch.id,
            start_date: dateRange.from.toISOString().split('T')[0],
            end_date: dateRange.to.toISOString().split('T')[0]
          }
        );

        if (error) throw error;

        // Format the data for a chart
        const chartData = {
          labels: data.map((item: any) => item.date_point),
          data: data.map((item: any) => item.attendance_count)
        };
        
        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching attendance stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch, dateRange]);

  return { data, isLoading, error };
}

export function useMembershipTrend(dateRange: DateRange) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.rpc(
          'get_membership_trend',
          { 
            branch_id_param: currentBranch.id,
            start_date: dateRange.from.toISOString().split('T')[0],
            end_date: dateRange.to.toISOString().split('T')[0]
          }
        );

        if (error) throw error;

        // Format the data for a chart
        const chartData = {
          labels: data.map((item: any) => item.date_point),
          datasets: [
            {
              name: 'New Members',
              data: data.map((item: any) => item.new_members)
            },
            {
              name: 'Cancelled',
              data: data.map((item: any) => item.cancelled_members)
            },
            {
              name: 'Net Change',
              data: data.map((item: any) => item.net_change)
            }
          ]
        };
        
        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching membership trend:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch, dateRange]);

  return { data, isLoading, error };
}

export function useAttendanceTrend(dateRange: DateRange) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.rpc(
          'get_attendance_trend',
          { 
            branch_id_param: currentBranch.id,
            start_date: dateRange.from.toISOString().split('T')[0],
            end_date: dateRange.to.toISOString().split('T')[0]
          }
        );

        if (error) throw error;

        // Format the data for a chart
        const chartData = {
          labels: data.map((item: any) => item.date_point),
          data: data.map((item: any) => item.attendance_count)
        };
        
        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching attendance trend:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch, dateRange]);

  return { data, isLoading, error };
}

export function useRevenueBreakdown(dateRange: DateRange) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.rpc(
          'get_revenue_breakdown',
          { 
            branch_id_param: currentBranch.id,
            start_date: dateRange.from.toISOString().split('T')[0],
            end_date: dateRange.to.toISOString().split('T')[0]
          }
        );

        if (error) throw error;

        // Format the data for a chart
        const chartData = {
          labels: data.map((item: any) => item.category),
          data: data.map((item: any) => Number(item.amount))
        };
        
        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching revenue breakdown:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch, dateRange]);

  return { data, isLoading, error };
}

export function useTrainerUtilization() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('trainer_utilization')
          .select('*')
          .eq('branch_id', currentBranch.id);

        if (error) throw error;
        
        setData(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching trainer utilization:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch]);

  return { data: data, trainers: data, isLoading, error };
}

export function useChurnRisk() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('member_churn_risk')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('churn_risk_score', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        setData(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching churn risk data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch]);

  return { data: data, members: data, isLoading, error };
}

export function useClassPerformance() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('class_performance')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('enrollment_percentage', { ascending: false });

        if (error) throw error;
        
        setData(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching class performance data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch]);

  return { data: data, classes: data, isLoading, error };
}

export function useInventoryAlerts() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('inventory_alerts')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('is_low_stock', { ascending: false });

        if (error) throw error;
        
        setData(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching inventory alerts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch]);

  return { data: data, alerts: data, isLoading, error };
}

export function useRevenueStats(dateRange: DateRange) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Convert date range to date strings
        const startDate = dateRange.from.toISOString().split('T')[0];
        const endDate = dateRange.to.toISOString().split('T')[0];
        
        // Fetch daily revenue data from income_records
        const { data, error } = await supabase
          .from('income_records')
          .select('date, amount')
          .eq('branch_id', currentBranch.id)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date');

        if (error) throw error;

        // Group by date and sum amounts
        const dailyRevenue = data.reduce((acc: any, { date, amount }: any) => {
          const day = date.split('T')[0];
          acc[day] = (acc[day] || 0) + Number(amount);
          return acc;
        }, {});
        
        // Format for chart
        const chartData = {
          labels: Object.keys(dailyRevenue),
          data: Object.values(dailyRevenue)
        };
        
        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching revenue data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch, dateRange]);

  return { data, isLoading, error };
}

export function useDashboardSummary() {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch summary data
        const { data, error } = await supabase
          .from('analytics_dashboard_stats')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // Not found error is expected
        
        const summary = data || {
          active_members: 0,
          new_members_daily: 0,
          new_members_weekly: 0,
          new_members_monthly: 0,
          total_revenue: 0,
          membership_revenue: 0,
          supplements_revenue: 0,
          merchandise_revenue: 0,
          weekly_check_ins: 0,
          monthly_check_ins: 0,
          upcoming_renewals: 0
        };
        
        // Add additional required fields for dashboard
        summary.newMembers = summary.new_members_monthly;
        summary.expiringMemberships = summary.upcoming_renewals;
        
        // Generate mock data for charts
        const mockAttendanceTrend = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          mockAttendanceTrend.push({
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 50) + 10
          });
        }
        summary.attendanceTrend = mockAttendanceTrend.reverse();
        
        // Member status breakdown
        summary.membersByStatus = {
          active: summary.active_members || 0,
          inactive: Math.floor((summary.active_members || 0) * 0.2),
          expired: Math.floor((summary.active_members || 0) * 0.1)
        };
        
        // Mock revenue data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        summary.revenueData = months.map(month => ({
          month,
          revenue: Math.floor(Math.random() * 50000) + 10000,
          expenses: Math.floor(Math.random() * 30000) + 5000,
          profit: Math.floor(Math.random() * 20000) + 5000
        }));
        
        setData(summary);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch]);

  return { data, isLoading, error };
}

// Add the missing useMembershipStats hook
export function useMembershipStats(dateRange: DateRange) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (!currentBranch) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Mock data for now - replace with actual API call
        const mockLabels = ['New', 'Renewed', 'Expired', 'Cancelled'];
        const mockData = [45, 30, 10, 5];
        
        setData({
          labels: mockLabels,
          data: mockData
        });
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching membership stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBranch, dateRange]);

  return { data, isLoading, error };
}

// Add an alias for backward compatibility
export const useChurnRiskMembers = useChurnRisk;

// This function is used by the dashboard service
export const fetchDashboardSummary = async (branchId?: string) => {
  try {
    // Initialize default values
    const summary: any = {
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
    
    // Fetch analytics data
    if (branchId) {
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics_dashboard_stats')
        .select('*')
        .eq('branch_id', branchId)
        .single();
        
      if (!analyticsError && analyticsData) {
        summary.activeMembers = analyticsData.active_members || 0;
        summary.newMembers = analyticsData.new_members_daily || 0;
        summary.totalMembers = analyticsData.active_members || 0;
        summary.todayCheckIns = analyticsData.weekly_check_ins || 0;
        summary.upcomingRenewals = analyticsData.upcoming_renewals || 0;
        summary.expiringMemberships = analyticsData.upcoming_renewals || 0;
        summary.revenue = {
          daily: analyticsData.total_revenue / 30 || 0, // Approximation
          weekly: analyticsData.total_revenue / 4 || 0, // Approximation
          monthly: analyticsData.total_revenue || 0
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
