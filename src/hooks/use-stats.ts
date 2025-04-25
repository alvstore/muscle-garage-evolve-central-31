
import { useState, useEffect } from 'react';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface StatsResult {
  labels: string[];
  data: number[];
}

export const useAttendanceStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching data from API - would be replaced with a real API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock data for the given date range
        const days = Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const labels = Array.from({ length: days }, (_, i) => {
          const date = new Date(dateRange.from);
          date.setDate(dateRange.from.getDate() + i);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        // Generate random attendance numbers
        const data = labels.map(() => Math.floor(Math.random() * 30) + 10);
        
        setData({ labels, data });
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [dateRange]);

  return { data, isLoading };
};

export const useRevenueStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching data from API - would be replaced with a real API call
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Generate mock data for the given date range
        const days = Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const labels = Array.from({ length: days }, (_, i) => {
          const date = new Date(dateRange.from);
          date.setDate(dateRange.from.getDate() + i);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        // Generate random revenue numbers
        const data = labels.map(() => Math.floor(Math.random() * 5000) + 1000);
        
        setData({ labels, data });
      } catch (error) {
        console.error('Error fetching revenue stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, [dateRange]);

  return { data, isLoading };
};

export const useMembershipStats = (dateRange: DateRange) => {
  const [data, setData] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipData = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching data from API - would be replaced with a real API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // For membership stats, we create categories and counts
        const labels = ['New', 'Renewed', 'Expired', 'Cancelled'];
        const data = [
          Math.floor(Math.random() * 50) + 20,  // New
          Math.floor(Math.random() * 80) + 40,  // Renewed
          Math.floor(Math.random() * 30) + 5,   // Expired
          Math.floor(Math.random() * 20) + 2    // Cancelled
        ];
        
        setData({ labels, data });
      } catch (error) {
        console.error('Error fetching membership stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipData();
  }, [dateRange]);

  return { data, isLoading };
};
