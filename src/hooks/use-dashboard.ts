
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';
import { fetchDashboardSummary } from '@/services/dashboardService';
import { toast } from 'sonner';

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
  attendanceTrend?: Array<{ date: string; count: number }>;
  membersByStatus?: {
    active: number;
    inactive: number;
    expired: number;
  };
  revenueData?: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
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
    inventoryAlerts: 0,
    attendanceTrend: [],
    membersByStatus: {
      active: 0,
      inactive: 0,
      expired: 0
    },
    revenueData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  // Function to fetch dashboard data
  const fetchData = useCallback(async () => {
    if (!currentBranch?.id) {
      console.log('No branch selected, using system-wide data');
    }

    try {
      setIsLoading(true);
      
      const summaryData = await fetchDashboardSummary(currentBranch?.id);
      
      // Additional fetch operations for staff, trainers, and classes count
      const { count: staffCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'staff')
        .eq(currentBranch?.id ? 'branch_id' : 'id', currentBranch?.id || '');
      
      const { count: trainerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'trainer')
        .eq(currentBranch?.id ? 'branch_id' : 'id', currentBranch?.id || '');
      
      const { count: activeClassesCount } = await supabase
        .from('class_schedules')
        .select('*', { count: 'exact', head: true })
        .gte('start_time', new Date().toISOString())
        .eq(currentBranch?.id ? 'branch_id' : 'id', currentBranch?.id || '');
      
      // Ensure all required fields are non-optional
      const revenue = {
        daily: summaryData.revenue?.daily ?? 0,
        weekly: summaryData.revenue?.weekly ?? 0,
        monthly: summaryData.revenue?.monthly ?? 0
      };
      
      // Combine all data with proper types
      const fullDashboardData: DashboardSummary = {
        ...summaryData,
        activeMembers: summaryData.membersByStatus?.active || 0,
        totalStaff: staffCount || 0,
        totalTrainers: trainerCount || 0,
        activeClasses: activeClassesCount || 0,
        revenue: revenue,
        // These could be calculated from real data in a more advanced implementation
        newMembers: summaryData.newMembers || 0, 
        expiringMemberships: summaryData.upcomingRenewals || 0,
        classSessions: summaryData.classSessions || 0, 
        inventoryAlerts: summaryData.inventoryAlerts || 0 
      };
      
      setDashboardData(fullDashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    dashboardData,
    isLoading,
    refreshData: fetchData
  };
};
