
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { addDays, format, subDays } from 'date-fns';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface StatsData {
  labels: string[];
  data: number[];
}

// Hook for attendance stats by date range
export const useAttendanceStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        const { data: attendanceData, error: attendanceError } = await supabase.rpc(
          'get_attendance_trend',
          {
            branch_id_param: currentBranch.id,
            start_date: format(dateRange.from, 'yyyy-MM-dd'),
            end_date: format(dateRange.to, 'yyyy-MM-dd')
          }
        );

        if (attendanceError) throw new Error(attendanceError.message);

        // Transform data for charting
        const labels = attendanceData.map(item => format(new Date(item.date_point), 'MMM dd'));
        const counts = attendanceData.map(item => item.attendance_count);

        setData({
          labels,
          data: counts
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch attendance stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceStats();
  }, [currentBranch?.id, dateRange.from, dateRange.to]);

  return { data, isLoading, error };
};

// Hook for revenue stats by date range
export const useRevenueStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchRevenueStats = async () => {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        // Fetch daily revenue
        const start = format(dateRange.from, 'yyyy-MM-dd');
        const end = format(dateRange.to, 'yyyy-MM-dd');
        
        const { data: incomeData, error: incomeError } = await supabase
          .from('income_records')
          .select('date, amount')
          .eq('branch_id', currentBranch.id)
          .gte('date', start)
          .lte('date', end)
          .order('date');

        if (incomeError) throw new Error(incomeError.message);

        // Group by date
        const dailyRevenue = new Map<string, number>();
        const days: string[] = [];
        
        // Initialize all days with 0 revenue
        let currentDate = new Date(dateRange.from);
        const endDate = new Date(dateRange.to);
        
        while (currentDate <= endDate) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          days.push(format(currentDate, 'MMM dd'));
          dailyRevenue.set(dateStr, 0);
          currentDate = addDays(currentDate, 1);
        }
        
        // Fill in actual revenue data
        if (incomeData) {
          incomeData.forEach(record => {
            const dateStr = format(new Date(record.date), 'yyyy-MM-dd');
            const currentAmount = dailyRevenue.get(dateStr) || 0;
            dailyRevenue.set(dateStr, currentAmount + record.amount);
          });
        }
        
        // Convert to arrays for charting
        const revenueValues = Array.from(dailyRevenue.values());
        
        setData({
          labels: days,
          data: revenueValues
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch revenue stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueStats();
  }, [currentBranch?.id, dateRange.from, dateRange.to]);

  return { data, isLoading, error };
};

// Hook for membership stats
export const useMembershipStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchMembershipStats = async () => {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        // Fetch membership trends
        const { data: memberData, error: memberError } = await supabase.rpc(
          'get_membership_trend',
          {
            branch_id_param: currentBranch.id,
            start_date: format(dateRange.from, 'yyyy-MM-dd'),
            end_date: format(dateRange.to, 'yyyy-MM-dd')
          }
        );

        if (memberError) throw new Error(memberError.message);

        // For simplicity in this example, we're just returning aggregated stats
        // In a real implementation, we'd calculate more sophisticated metrics
        const newMembers = memberData.reduce((sum, item) => sum + item.new_members, 0);
        const renewals = 25; // Placeholder - would fetch from real data
        const expired = 8;   // Placeholder - would fetch from real data
        const cancelled = memberData.reduce((sum, item) => sum + item.cancelled_members, 0);

        setData({
          labels: ['New', 'Renewals', 'Expired', 'Cancelled'],
          data: [newMembers, renewals, expired, cancelled]
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch membership stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipStats();
  }, [currentBranch?.id, dateRange.from, dateRange.to]);

  return { data, isLoading, error };
};

// Hook for dashboard summary stats
export const useDashboardSummary = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error: statsError } = await supabase
          .from('analytics_dashboard_stats')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .single();

        if (statsError && statsError.code !== 'PGRST116') {
          throw new Error(statsError.message);
        }

        setData(data || {
          active_members: 0,
          new_members_daily: 0,
          new_members_weekly: 0,
          new_members_monthly: 0,
          cancelled_members_monthly: 0,
          membership_revenue: 0,
          supplements_revenue: 0,
          merchandise_revenue: 0,
          total_revenue: 0,
          weekly_check_ins: 0,
          monthly_check_ins: 0,
          upcoming_renewals: 0
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard summary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardSummary();
  }, [currentBranch?.id]);

  return { data, isLoading, error, refetch: () => fetchDashboardSummary() };
};

// Hook for churn risk members
export const useChurnRiskMembers = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    const fetchChurnRiskMembers = async () => {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error: membersError } = await supabase
          .from('member_churn_risk')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('churn_risk_score', { ascending: false })
          .limit(10);

        if (membersError) throw new Error(membersError.message);

        setMembers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch churn risk members');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChurnRiskMembers();
  }, [currentBranch?.id]);

  return { members, isLoading, error };
};

// Hook for trainer utilization
export const useTrainerUtilization = () => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    const fetchTrainerUtilization = async () => {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error: trainersError } = await supabase
          .from('trainer_utilization')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('utilization_percentage', { ascending: false });

        if (trainersError) throw new Error(trainersError.message);

        setTrainers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trainer utilization');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainerUtilization();
  }, [currentBranch?.id]);

  return { trainers, isLoading, error };
};

// Hook for class performance
export const useClassPerformance = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    const fetchClassPerformance = async () => {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error: classesError } = await supabase
          .from('class_performance')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('enrollment_percentage', { ascending: false });

        if (classesError) throw new Error(classesError.message);

        setClasses(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch class performance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassPerformance();
  }, [currentBranch?.id]);

  return { classes, isLoading, error };
};

// Hook for inventory alerts
export const useInventoryAlerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    const fetchInventoryAlerts = async () => {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error: alertsError } = await supabase
          .from('inventory_alerts')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('stock_status');

        if (alertsError) throw new Error(alertsError.message);

        setAlerts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inventory alerts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryAlerts();
  }, [currentBranch?.id]);

  return { alerts, isLoading, error };
};
