
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { useAuth } from './use-auth';

export interface DashboardSummary {
  totalMembers: number;
  activeMembers: number;
  totalIncome: number;
  activeClasses?: number;
  totalTrainers?: number;
  revenueData?: any[];
  newMembers?: number;
  expiringMemberships?: number;
  todayCheckIns?: number;
  upcomingRenewals?: number;
  revenue?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  pendingPayments?: {
    count: number;
    total: number;
  };
  membersByStatus?: {
    active: number;
    inactive: number;
    expired: number;
  };
  attendanceTrend?: any[];
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    totalMembers: 0,
    activeMembers: 0,
    totalIncome: 0,
    revenue: {
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    newMembers: 0,
    expiringMemberships: 0,
    todayCheckIns: 0,
    upcomingRenewals: 0,
    pendingPayments: {
      count: 0,
      total: 0
    },
    membersByStatus: {
      active: 0,
      inactive: 0,
      expired: 0
    },
    attendanceTrend: [],
    revenueData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();
  const { user } = useAuth();

  // Function to fetch dashboard data from Supabase
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Replace mock data with actual API calls
      const data = await dashboardService.getDashboardData(currentBranch?.id);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch dashboard data on component mount or when branch changes
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [currentBranch?.id, user]);

  return {
    dashboardData,
    isLoading,
    refreshData: fetchDashboardData,
  };
};
