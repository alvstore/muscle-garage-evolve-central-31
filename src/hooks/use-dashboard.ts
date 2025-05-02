
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
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
  activeTrainers?: number;
  activeClasses?: number;
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState<any[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const refreshData = useCallback(async () => {
    if (!currentBranch) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch dashboard summary data
      const summary = await fetchDashboardSummary(currentBranch.id);
      setDashboardData(summary);

      // Fetch pending payments
      const payments = await fetchPendingPayments(currentBranch.id);
      setPendingPayments(payments);

      // Fetch upcoming membership renewals
      const renewals = await fetchMembershipRenewals(currentBranch.id);
      setUpcomingRenewals(renewals);

      // Fetch upcoming classes
      const classes = await fetchUpcomingClasses(currentBranch.id);
      setUpcomingClasses(classes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch]);

  // Initial data fetching
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    dashboardData,
    pendingPayments,
    upcomingRenewals,
    upcomingClasses,
    isLoading,
    error,
    refreshData,
  };
};
