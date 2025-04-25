
import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';

interface AttendanceData {
  date: string;
  members: string[] | null;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface MembershipData {
  date: string;
  members: number;
}

export const useAttendanceStats = (interval: 'daily' | 'weekly' | 'monthly', startDate?: string, endDate?: string) => {
  const [data, setData] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Mock data for now, this would be replaced with actual Supabase query
      const mockData = [
        { date: '2023-01-01', members: ['1', '2', '3'] },
        { date: '2023-01-02', members: ['1', '2', '3', '4'] },
        { date: '2023-01-03', members: ['1', '2'] },
        { date: '2023-01-04', members: ['1', '2', '3', '4', '5'] },
        { date: '2023-01-05', members: ['1', '2', '3'] },
        { date: '2023-01-06', members: ['1', '2', '3', '4'] },
        { date: '2023-01-07', members: ['1', '2'] },
      ];
      
      setData(mockData);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching attendance stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [interval, startDate, endDate]);

  return { data, isLoading, error, fetchData };
};

export const useRevenueStats = (interval: 'daily' | 'weekly' | 'monthly', startDate?: string, endDate?: string) => {
  const [data, setData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Mock data for now
      const mockData = [
        { date: '2023-01-01', revenue: 1200 },
        { date: '2023-01-02', revenue: 1500 },
        { date: '2023-01-03', revenue: 1000 },
        { date: '2023-01-04', revenue: 2000 },
        { date: '2023-01-05', revenue: 1300 },
        { date: '2023-01-06', revenue: 1800 },
        { date: '2023-01-07', revenue: 1600 },
      ];
      
      setData(mockData);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching revenue stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [interval, startDate, endDate]);

  return { data, isLoading, error, fetchData };
};

export const useMembershipStats = (interval: 'daily' | 'weekly' | 'monthly', startDate?: string, endDate?: string) => {
  const [data, setData] = useState<MembershipData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Mock data for now
      const mockData = [
        { date: '2023-01-01', members: 120 },
        { date: '2023-01-02', members: 122 },
        { date: '2023-01-03', members: 125 },
        { date: '2023-01-04', members: 124 },
        { date: '2023-01-05', members: 128 },
        { date: '2023-01-06', members: 130 },
        { date: '2023-01-07', members: 135 },
      ];
      
      setData(mockData);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching membership stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [interval, startDate, endDate]);

  return { data, isLoading, error, fetchData };
};
