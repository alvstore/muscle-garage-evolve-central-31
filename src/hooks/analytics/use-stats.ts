
// Analytics and statistics hook
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  membershipTrends: Array<{
    month: string;
    count: number;
  }>;
  revenueBreakdown: Array<{
    category: string;
    amount: number;
  }>;
}

export const useStats = (branchId?: string) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (branchId) {
      fetchAnalytics();
    }
  }, [branchId]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock analytics data
      const mockData: AnalyticsData = {
        totalMembers: 150,
        activeMembers: 120,
        totalRevenue: 25000,
        monthlyGrowth: 12.5,
        membershipTrends: [
          { month: 'Jan', count: 100 },
          { month: 'Feb', count: 110 },
          { month: 'Mar', count: 125 },
          { month: 'Apr', count: 135 },
          { month: 'May', count: 150 }
        ],
        revenueBreakdown: [
          { category: 'Membership Fees', amount: 18000 },
          { category: 'Personal Training', amount: 5000 },
          { category: 'Classes', amount: 2000 }
        ]
      };

      setData(mockData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchAnalytics
  };
};
