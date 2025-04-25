
import { useState, useEffect, useCallback } from 'react';

// Define types for stats
export interface StatsResult {
  labels: string[];
  data: number[];
}

// Attendance stats function
export const useAttendanceStats = (dateRange: { from: Date; to: Date }, branchId?: string) => {
  const [data, setData] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      // This simulates getting daily attendance between the date range
      const mockLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const mockData = [25, 30, 22, 28, 35, 40, 20];
      
      setData({
        labels: mockLabels,
        data: mockData
      });
      
    } catch (err: any) {
      setError(err);
      console.error('Error fetching attendance stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, branchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Revenue stats function
export const useRevenueStats = (dateRange: { from: Date; to: Date }, branchId?: string) => {
  const [data, setData] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      const mockLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const mockData = [2500, 3200, 2800, 3500];
      
      setData({
        labels: mockLabels,
        data: mockData
      });
      
    } catch (err: any) {
      setError(err);
      console.error('Error fetching revenue stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, branchId]);

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
      
      // Mock data for now - replace with actual API call
      const mockLabels = ['New', 'Renewed', 'Expired', 'Cancelled'];
      const mockData = [45, 30, 10, 5];
      
      setData({
        labels: mockLabels,
        data: mockData
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
