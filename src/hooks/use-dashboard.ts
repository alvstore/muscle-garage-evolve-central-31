
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';

export interface DashboardSummary {
  totalMembers: number;
  activeMembers: number;
  pendingPayments: { count: number; total: number };
  upcomingRenewals: number;
  todayCheckIns: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  totalTrainers?: number;  // Made optional for backward compatibility
  totalStaff?: number;     // Made optional for backward compatibility
  activeClasses?: number;  // Made optional for backward compatibility
  newMembers?: number;
  expiringMemberships?: number;
  classSessions?: number;
  inventoryAlerts?: number;
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    totalMembers: 0,
    activeMembers: 0,
    pendingPayments: { count: 0, total: 0 },
    upcomingRenewals: 0,
    todayCheckIns: 0,
    revenue: {
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    totalTrainers: 0,
    totalStaff: 0,
    activeClasses: 0,
    newMembers: 0,
    expiringMemberships: 0,
    classSessions: 0,
    inventoryAlerts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // This is where you'd make API calls to get the actual data
      // For now, we'll use placeholder data
      
      // Simulating a loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        totalMembers: 120,
        activeMembers: 95,
        pendingPayments: { count: 5, total: 7500 },
        upcomingRenewals: 8,
        todayCheckIns: 35,
        revenue: {
          daily: 2500,
          weekly: 15000,
          monthly: 65000
        },
        totalTrainers: 8,
        totalStaff: 12,
        activeClasses: 15,
        newMembers: 5,
        expiringMemberships: 3,
        classSessions: 25,
        inventoryAlerts: 2
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  }, [currentBranch]);

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, currentBranch]);

  return {
    dashboardData,
    isLoading,
    refreshData: fetchDashboardData
  };
};
