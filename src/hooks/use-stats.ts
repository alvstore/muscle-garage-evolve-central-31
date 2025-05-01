
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface StatsData {
  labels: string[];
  data: number[];
}

export const useAttendanceStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsData>({ labels: [], data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      if (!dateRange.from || !dateRange.to) return;
      
      setIsLoading(true);
      try {
        const fromDate = dateRange.from.toISOString();
        const toDate = dateRange.to.toISOString();
        
        let query = supabase
          .from('member_attendance')
          .select('check_in, count')
          .gte('check_in', fromDate)
          .lte('check_in', toDate);
          
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        const { data: statsData, error } = await query;
        
        if (error) throw error;
        
        // Process data into formats needed for charts
        const processedData: StatsData = {
          labels: [],
          data: []
        };
        
        // Convert the raw data into daily counts
        if (statsData && statsData.length > 0) {
          // Create a map to count occurrences by date
          const dateMap: Record<string, number> = {};
          
          statsData.forEach(item => {
            const date = new Date(item.check_in);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
            
            if (!dateMap[formattedDate]) {
              dateMap[formattedDate] = 0;
            }
            
            dateMap[formattedDate] += 1;
          });
          
          // Convert the map to arrays for labels and data
          const sortedDates = Object.keys(dateMap).sort((a, b) => {
            const [aMonth, aDay] = a.split('/').map(Number);
            const [bMonth, bDay] = b.split('/').map(Number);
            return aMonth !== bMonth ? aMonth - bMonth : aDay - bDay;
          });
          
          processedData.labels = sortedDates;
          processedData.data = sortedDates.map(date => dateMap[date]);
        }
        
        setData(processedData);
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendanceStats();
  }, [dateRange.from, dateRange.to, currentBranch?.id]);

  return { data, isLoading };
};

export const useRevenueStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsData>({ labels: [], data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchRevenueStats = async () => {
      if (!dateRange.from || !dateRange.to) return;
      
      setIsLoading(true);
      try {
        const fromDate = dateRange.from.toISOString();
        const toDate = dateRange.to.toISOString();
        
        let query = supabase
          .from('transactions')
          .select('amount, created_at')
          .eq('type', 'income')
          .gte('created_at', fromDate)
          .lte('created_at', toDate);
          
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        const { data: transactionsData, error } = await query;
        
        if (error) throw error;
        
        // Group data by date
        const dateMap: Record<string, number> = {};
        
        transactionsData?.forEach(transaction => {
          const date = new Date(transaction.created_at);
          const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
          
          if (!dateMap[dateKey]) {
            dateMap[dateKey] = 0;
          }
          
          dateMap[dateKey] += transaction.amount || 0;
        });
        
        const processedData: StatsData = {
          labels: Object.keys(dateMap).sort((a, b) => {
            const [aMonth, aDay] = a.split('/').map(Number);
            const [bMonth, bDay] = b.split('/').map(Number);
            return aMonth !== bMonth ? aMonth - bMonth : aDay - bDay;
          }),
          data: []
        };
        
        processedData.labels.forEach(label => {
          processedData.data.push(dateMap[label]);
        });
        
        setData(processedData);
      } catch (error) {
        console.error('Error fetching revenue stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRevenueStats();
  }, [dateRange.from, dateRange.to, currentBranch?.id]);

  return { data, isLoading };
};

export const useMembershipStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsData>({ 
    labels: ['New', 'Renewals', 'Expired', 'Cancelled'],
    data: [0, 0, 0, 0] 
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchMembershipStats = async () => {
      if (!dateRange.from || !dateRange.to) return;
      
      setIsLoading(true);
      try {
        const fromDate = dateRange.from.toISOString();
        const toDate = dateRange.to.toISOString();
        
        // Get new memberships
        let newMembershipsQuery = supabase
          .from('member_memberships')
          .select('count(*)', { count: 'exact', head: true })
          .eq('status', 'active')
          .gte('created_at', fromDate)
          .lte('created_at', toDate);
        
        // Get renewals
        let renewalsQuery = supabase
          .from('member_memberships')
          .select('count(*)', { count: 'exact', head: true })
          .eq('status', 'active')
          .gte('updated_at', fromDate)
          .lte('updated_at', toDate)
          .not('created_at', 'eq', 'updated_at');
        
        // Get expired memberships
        let expiredQuery = supabase
          .from('member_memberships')
          .select('count(*)', { count: 'exact', head: true })
          .eq('status', 'expired')
          .gte('updated_at', fromDate)
          .lte('updated_at', toDate);
        
        // Get cancelled memberships
        let cancelledQuery = supabase
          .from('member_memberships')
          .select('count(*)', { count: 'exact', head: true })
          .eq('status', 'cancelled')
          .gte('updated_at', fromDate)
          .lte('updated_at', toDate);
        
        // Apply branch filter if needed
        if (currentBranch?.id) {
          newMembershipsQuery = newMembershipsQuery.eq('branch_id', currentBranch.id);
          renewalsQuery = renewalsQuery.eq('branch_id', currentBranch.id);
          expiredQuery = expiredQuery.eq('branch_id', currentBranch.id);
          cancelledQuery = cancelledQuery.eq('branch_id', currentBranch.id);
        }
        
        const [
          { count: newCount, error: newError },
          { count: renewalCount, error: renewalError },
          { count: expiredCount, error: expiredError },
          { count: cancelledCount, error: cancelledError }
        ] = await Promise.all([
          newMembershipsQuery,
          renewalsQuery,
          expiredQuery,
          cancelledQuery
        ]);
        
        if (newError) throw newError;
        if (renewalError) throw renewalError;
        if (expiredError) throw expiredError;
        if (cancelledError) throw cancelledError;
        
        setData({
          labels: ['New', 'Renewals', 'Expired', 'Cancelled'],
          data: [
            newCount || 0,
            renewalCount || 0,
            expiredCount || 0,
            cancelledCount || 0
          ]
        });
      } catch (error) {
        console.error('Error fetching membership stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembershipStats();
  }, [dateRange.from, dateRange.to, currentBranch?.id]);

  return { data, isLoading };
};
