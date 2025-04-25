
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { format, subDays, startOfMonth, endOfMonth, parseISO, subMonths } from 'date-fns';

// Define types for stats
export interface StatsResult {
  labels: string[];
  data: number[];
  total?: number;
}

// Attendance stats function
export const useAttendanceStats = (dateRange: { from: Date; to: Date }, branchId?: string, granularity: 'daily' | 'weekly' | 'monthly' = 'daily') => {
  const [data, setData] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fromDate = format(dateRange.from, 'yyyy-MM-dd');
      const toDate = format(dateRange.to, 'yyyy-MM-dd');
      
      // Get attendance data between dates
      let query = supabase
        .from('member_attendance')
        .select('check_in, count', { count: 'exact' })
        .gte('check_in', `${fromDate}T00:00:00`)
        .lte('check_in', `${toDate}T23:59:59`);
        
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data: attendanceData, error: attendanceError, count } = await query;
      
      if (attendanceError) throw attendanceError;
      
      // Process data by granularity
      let processedData: {[key: string]: number} = {};
      let labels: string[] = [];
      
      if (granularity === 'daily') {
        // Group by day
        attendanceData?.forEach(record => {
          const day = format(parseISO(record.check_in), 'yyyy-MM-dd');
          processedData[day] = (processedData[day] || 0) + 1;
        });
        
        // Fill in missing days
        let currentDate = new Date(dateRange.from);
        while (currentDate <= dateRange.to) {
          const dateKey = format(currentDate, 'yyyy-MM-dd');
          labels.push(format(currentDate, 'dd MMM'));
          if (!processedData[dateKey]) processedData[dateKey] = 0;
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else if (granularity === 'weekly') {
        // Group by week
        attendanceData?.forEach(record => {
          const weekNum = format(parseISO(record.check_in), 'w');
          const weekYear = format(parseISO(record.check_in), 'yyyy');
          const weekKey = `${weekYear}-W${weekNum}`;
          processedData[weekKey] = (processedData[weekKey] || 0) + 1;
        });
        
        // Create week labels
        Object.keys(processedData).forEach(weekKey => {
          const [year, week] = weekKey.split('-W');
          labels.push(`Week ${week}`);
        });
      } else {
        // Group by month
        attendanceData?.forEach(record => {
          const month = format(parseISO(record.check_in), 'yyyy-MM');
          processedData[month] = (processedData[month] || 0) + 1;
        });
        
        // Create month labels
        Object.keys(processedData).forEach(month => {
          labels.push(format(parseISO(`${month}-01`), 'MMM yyyy'));
        });
      }
      
      // Sort labels chronologically
      labels.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });
      
      // Extract data in same order as labels
      const chartData = labels.map(label => {
        const key = Object.keys(processedData).find(k => label.includes(k)) || '';
        return processedData[key] || 0;
      });
      
      setData({
        labels,
        data: chartData,
        total: count || 0
      });
      
    } catch (err: any) {
      setError(err);
      console.error('Error fetching attendance stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, branchId, granularity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Revenue stats function
export const useRevenueStats = (dateRange: { from: Date; to: Date }, branchId?: string, granularity: 'daily' | 'weekly' | 'monthly' = 'weekly') => {
  const [data, setData] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fromDate = format(dateRange.from, 'yyyy-MM-dd');
      const toDate = format(dateRange.to, 'yyyy-MM-dd');
      
      // Get revenue data between dates
      let query = supabase
        .from('payments')
        .select('payment_date, amount, count', { count: 'exact' })
        .gte('payment_date', `${fromDate}T00:00:00`)
        .lte('payment_date', `${toDate}T23:59:59`)
        .eq('status', 'completed');
        
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data: revenueData, error: revenueError, count } = await query;
      
      if (revenueError) throw revenueError;
      
      // Process data by granularity
      let processedData: {[key: string]: number} = {};
      let labels: string[] = [];
      
      if (granularity === 'daily') {
        // Group by day
        revenueData?.forEach(record => {
          const day = format(parseISO(record.payment_date), 'yyyy-MM-dd');
          processedData[day] = (processedData[day] || 0) + (record.amount || 0);
        });
        
        // Fill in missing days
        let currentDate = new Date(dateRange.from);
        while (currentDate <= dateRange.to) {
          const dateKey = format(currentDate, 'yyyy-MM-dd');
          labels.push(format(currentDate, 'dd MMM'));
          if (!processedData[dateKey]) processedData[dateKey] = 0;
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else if (granularity === 'weekly') {
        // Group by week
        revenueData?.forEach(record => {
          const weekNum = format(parseISO(record.payment_date), 'w');
          const weekYear = format(parseISO(record.payment_date), 'yyyy');
          const weekKey = `${weekYear}-W${weekNum}`;
          processedData[weekKey] = (processedData[weekKey] || 0) + (record.amount || 0);
        });
        
        // Create week labels
        Object.keys(processedData).forEach(weekKey => {
          const [year, week] = weekKey.split('-W');
          labels.push(`Week ${week}`);
        });
      } else {
        // Group by month
        revenueData?.forEach(record => {
          const month = format(parseISO(record.payment_date), 'yyyy-MM');
          processedData[month] = (processedData[month] || 0) + (record.amount || 0);
        });
        
        // Create month labels
        Object.keys(processedData).forEach(month => {
          labels.push(format(parseISO(`${month}-01`), 'MMM yyyy'));
        });
      }
      
      // Sort labels chronologically
      labels.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });
      
      // Extract data in same order as labels
      const chartData = labels.map(label => {
        const key = Object.keys(processedData).find(k => label.includes(k)) || '';
        return processedData[key] || 0;
      });
      
      const totalRevenue = revenueData?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0;
      
      setData({
        labels,
        data: chartData,
        total: totalRevenue
      });
      
    } catch (err: any) {
      setError(err);
      console.error('Error fetching revenue stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, branchId, granularity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Membership stats function
export const useMembershipStats = (dateRange: { from: Date; to: Date }, branchId?: string) => {
  const [data, setData] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fromDate = format(dateRange.from, 'yyyy-MM-dd');
      const toDate = format(dateRange.to, 'yyyy-MM-dd');
      
      // Get new memberships
      let newMembershipsQuery = supabase
        .from('member_memberships')
        .select('*', { count: 'exact' })
        .gte('start_date', fromDate)
        .lte('start_date', toDate);
        
      if (branchId) {
        newMembershipsQuery = newMembershipsQuery.eq('branch_id', branchId);
      }
      
      const { count: newCount, error: newError } = await newMembershipsQuery;
      
      if (newError) throw newError;
      
      // Get renewals
      let renewalsQuery = supabase
        .from('member_memberships')
        .select('*', { count: 'exact' })
        .gte('start_date', fromDate)
        .lte('start_date', toDate)
        .not('previous_membership_id', 'is', null);
        
      if (branchId) {
        renewalsQuery = renewalsQuery.eq('branch_id', branchId);
      }
      
      const { count: renewalCount, error: renewalError } = await renewalsQuery;
      
      if (renewalError) throw renewalError;
      
      // Get expired memberships
      let expiredQuery = supabase
        .from('member_memberships')
        .select('*', { count: 'exact' })
        .gte('end_date', fromDate)
        .lte('end_date', toDate)
        .eq('status', 'expired');
        
      if (branchId) {
        expiredQuery = expiredQuery.eq('branch_id', branchId);
      }
      
      const { count: expiredCount, error: expiredError } = await expiredQuery;
      
      if (expiredError) throw expiredError;
      
      // Get cancelled memberships
      let cancelledQuery = supabase
        .from('member_memberships')
        .select('*', { count: 'exact' })
        .gte('updated_at', `${fromDate}T00:00:00`)
        .lte('updated_at', `${toDate}T23:59:59`)
        .eq('status', 'cancelled');
        
      if (branchId) {
        cancelledQuery = cancelledQuery.eq('branch_id', branchId);
      }
      
      const { count: cancelledCount, error: cancelledError } = await cancelledQuery;
      
      if (cancelledError) throw cancelledError;
      
      // Format the data for chart display
      setData({
        labels: ['New', 'Renewals', 'Expired', 'Cancelled'],
        data: [
          newCount || 0,
          renewalCount || 0,
          expiredCount || 0,
          cancelledCount || 0
        ],
        total: (newCount || 0) + (renewalCount || 0)
      });
      
    } catch (err: any) {
      setError(err);
      console.error('Error fetching membership stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, branchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};
