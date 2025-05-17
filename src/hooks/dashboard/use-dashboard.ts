
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branches';
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
  newMembers: number;
  expiringMemberships: number;
  classSessions?: number;
  inventoryAlerts?: number;
  attendanceTrend?: {
    date: string;
    count: number;
  }[];
  membersByStatus?: {
    active: number;
    inactive: number;
    expired: number;
  };
  revenueData?: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
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
    if (!currentBranch?.id) return;

    // Prevent multiple simultaneous refreshes
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Use Promise.all to fetch data in parallel
      const [summary, payments, renewals, classes] = await Promise.all([
        fetchDashboardSummary(currentBranch.id),
        fetchPendingPayments(currentBranch.id),
        fetchMembershipRenewals(currentBranch.id),
        fetchUpcomingClasses(currentBranch.id)
      ]);
      
      // Ensure totalIncome is always set even if the API doesn't return it
      const updatedSummary = {
        ...summary,
        totalIncome: summary.totalIncome || summary.revenue?.monthly || 0
      };
      
      // Batch state updates to reduce renders
      setDashboardData(updatedSummary);
      setPendingPayments(payments);
      setUpcomingRenewals(renewals);
      setUpcomingClasses(classes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id, isLoading]);

  // Initial data fetching - only run when branch changes, not on every refreshData change
  useEffect(() => {
    if (currentBranch?.id) {
      refreshData();
    }
  }, [currentBranch?.id]); // Only depend on branch ID, not the refreshData function

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
