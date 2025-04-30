import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface StatsData {
  labels: string[];
  data: number[];
}

export const useAttendanceStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      setIsLoading(true);
      try {
        // Format dates for query
        const fromDate = startOfDay(dateRange.from).toISOString();
        const toDate = endOfDay(dateRange.to).toISOString();

        // Query attendance data
        let query = supabase
          .from('member_attendance')
          .select('check_in')
          .gte('check_in', fromDate)
          .lte('check_in', toDate);
          
        // Apply branch filter if available
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }

        const { data: attendanceData, error } = await query;

        if (error) throw error;

        // Process data for chart
        const dayMap: Record<string, number> = {};
        
        // Initialize each day in the range with zero
        let currentDay = new Date(dateRange.from);
        while (currentDay <= dateRange.to) {
          const dateKey = format(currentDay, 'yyyy-MM-dd');
          dayMap[dateKey] = 0;
          currentDay.setDate(currentDay.getDate() + 1);
        }
        
        // Count attendances by day
        if (attendanceData) {
          attendanceData.forEach(record => {
            const checkInDate = new Date(record.check_in);
            const dateKey = format(checkInDate, 'yyyy-MM-dd');
            if (dayMap[dateKey] !== undefined) {
              dayMap[dateKey]++;
            }
          });
        }

        // Convert to arrays for chart
        const labels = Object.keys(dayMap).map(date => 
          format(new Date(date), 'MMM dd')
        );
        
        const chartData = Object.values(dayMap);
        
        setData({ labels, data: chartData });
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
        setData({ labels: [], data: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceStats();
  }, [dateRange, currentBranch?.id]);

  return { data, isLoading };
};

export const useRevenueStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchRevenueStats = async () => {
      setIsLoading(true);
      try {
        // Format dates for query
        const fromDate = startOfDay(dateRange.from).toISOString();
        const toDate = endOfDay(dateRange.to).toISOString();

        // Query revenue data
        let query = supabase
          .from('transactions')
          .select('amount, created_at')
          .gte('created_at', fromDate)
          .lte('created_at', toDate)
          .eq('type', 'income');
          
        // Apply branch filter if available
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }

        const { data: revenueData, error } = await query;

        if (error) throw error;

        // Process data for chart
        const dayMap: Record<string, number> = {};
        
        // Initialize each day in the range with zero
        let currentDay = new Date(dateRange.from);
        while (currentDay <= dateRange.to) {
          const dateKey = format(currentDay, 'yyyy-MM-dd');
          dayMap[dateKey] = 0;
          currentDay.setDate(currentDay.getDate() + 1);
        }
        
        // Sum revenue by day
        if (revenueData) {
          revenueData.forEach(record => {
            const transactionDate = new Date(record.created_at);
            const dateKey = format(transactionDate, 'yyyy-MM-dd');
            if (dayMap[dateKey] !== undefined) {
              dayMap[dateKey] += (record.amount || 0);
            }
          });
        }

        // Convert to arrays for chart
        const labels = Object.keys(dayMap).map(date => 
          format(new Date(date), 'MMM dd')
        );
        
        const chartData = Object.values(dayMap);
        
        setData({ labels, data: chartData });
      } catch (error) {
        console.error('Error fetching revenue stats:', error);
        setData({ labels: [], data: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueStats();
  }, [dateRange, currentBranch?.id]);

  return { data, isLoading };
};

export const useMembershipStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchMembershipStats = async () => {
      setIsLoading(true);
      try {
        // Format dates for query
        const fromDate = startOfDay(dateRange.from).toISOString();
        const toDate = endOfDay(dateRange.to).toISOString();

        // Query membership data - we'll count different membership statuses
        let query = supabase
          .from('member_memberships')
          .select('status, count')
          .gte('created_at', fromDate)
          .lte('created_at', toDate)
          .group('status');
          
        // Apply branch filter if available
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }

        const { data: membershipData, error } = await query;

        if (error) throw error;

        // Define our categories for the chart
        const categories = ['New', 'Renewed', 'Expired', 'Cancelled'];
        const counts = [0, 0, 0, 0]; // Initialize with zeros
        
        // Fill in actual data where available
        if (membershipData && membershipData.length > 0) {
          membershipData.forEach(record => {
            switch (record.status.toLowerCase()) {
              case 'active':
                // Assuming new memberships
                counts[0] = parseInt(record.count);
                break;
              case 'renewed':
                counts[1] = parseInt(record.count);
                break;
              case 'expired':
                counts[2] = parseInt(record.count);
                break;
              case 'cancelled':
                counts[3] = parseInt(record.count);
                break;
            }
          });
        }
        
        setData({ labels: categories, data: counts });
      } catch (error) {
        console.error('Error fetching membership stats:', error);
        setData({ labels: ['New', 'Renewed', 'Expired', 'Cancelled'], data: [0, 0, 0, 0] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipStats();
  }, [dateRange, currentBranch?.id]);

  return { data, isLoading };
};
