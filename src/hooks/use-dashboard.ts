
import { useState, useEffect, useCallback } from 'react';
import { useBranch } from '@/hooks/use-branch';
import { usePermissions } from '@/hooks/use-permissions';
import { fetchDashboardSummary, fetchPendingPayments, fetchMembershipRenewals, fetchUpcomingClasses } from '@/services/dashboardService';

export interface DashboardSummary {
  totalMembers: number;
  activeMembers: number;
  totalIncome: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  pendingPayments: {
    count: number;
    total: number;
  };
  upcomingRenewals: number;
  todayCheckIns: number;
  totalTrainers?: number;
  activeClasses?: number;
}

export interface DashboardData extends DashboardSummary {
  revenueData: Array<{ name: string; amount: number }>;
  attendanceTrend: Array<{ date: string; count: number }>;
  membersByStatus: {
    active: number;
    inactive: number;
    expired: number;
  };
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalMembers: 0,
    activeMembers: 0,
    totalIncome: 0,
    revenue: { daily: 0, weekly: 0, monthly: 0 },
    pendingPayments: { count: 0, total: 0 },
    upcomingRenewals: 0,
    todayCheckIns: 0,
    revenueData: [],
    attendanceTrend: [],
    membersByStatus: { active: 0, inactive: 0, expired: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { currentBranch } = useBranch();
  const { can, isSystemAdmin } = usePermissions();
  
  // Determine if we should fetch all branches data
  const shouldFetchAllBranches = isSystemAdmin() && !currentBranch;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Only fetch if we have permission to view dashboards
      if (!can('access_dashboards')) {
        throw new Error('You do not have permission to access dashboards');
      }
      
      // Fetch summary data
      const branchId = shouldFetchAllBranches ? undefined : currentBranch?.id;
      const summary = await fetchDashboardSummary(branchId);
      
      // Mock revenue data for now - this would be replaced with real data
      const revenueData = [
        { name: 'Jan', amount: 12000 },
        { name: 'Feb', amount: 15000 },
        { name: 'Mar', amount: 18000 },
        { name: 'Apr', amount: 20000 },
        { name: 'May', amount: 22000 },
        { name: 'Jun', amount: 25000 },
      ];
      
      // Mock attendance trend for now - this would be replaced with real data
      const attendanceTrend = [
        { date: 'Mon', count: 23 },
        { date: 'Tue', count: 35 },
        { date: 'Wed', count: 42 },
        { date: 'Thu', count: 38 },
        { date: 'Fri', count: 45 },
        { date: 'Sat', count: 60 },
        { date: 'Sun', count: 25 },
      ];
      
      // Use real summary data for member status
      const membersByStatus = {
        active: summary.activeMembers || 0,
        inactive: (summary.totalMembers || 0) - (summary.activeMembers || 0),
        expired: 0 // This should come from real data
      };
      
      setDashboardData({
        ...summary,
        revenueData,
        attendanceTrend,
        membersByStatus
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id, shouldFetchAllBranches, can, isSystemAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { dashboardData, isLoading, error, refreshData: fetchData };
};
