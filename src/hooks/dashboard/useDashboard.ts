import { useState, useEffect, useCallback, useMemo } from 'react';
import { useBranch } from '@/hooks/settings/use-branches';
import { useAuth } from '@/hooks/auth/use-auth';
import { 
  fetchDashboardSummary, 
  fetchPendingPayments, 
  fetchMembershipRenewals, 
  fetchUpcomingClasses,
  type PendingPayment as ServicePendingPayment,
  type MembershipRenewal as ServiceMembershipRenewal,
  type ClassSchedule as ServiceClassSchedule
} from '@/services/dashboardService';

// Local types that extend service types
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
    items: Array<{
      id: string;
      member_name: string;
      amount: number;
      due_date: string;
    }>;
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
  attendanceTrend?: Array<{
    date: string;
    count: number;
  }>;
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
  recentActivities?: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
    description?: string;
  }>;
}

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
    items: Array<{
      id: string;
      member_name: string;
      amount: number;
      due_date: string;
    }>;
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
  attendanceTrend?: Array<{
    date: string;
    count: number;
  }>;
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
  recentActivities?: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
    description?: string;
  }>;
}

interface UseDashboardProps {
  role?: 'admin' | 'staff' | 'trainer' | 'member';
  initialData?: Partial<DashboardSummary>;
}

const useDashboard = ({ role = 'staff', initialData = {} }: UseDashboardProps = {}) => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [pendingPayments, setPendingPayments] = useState<ServicePendingPayment[]>([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState<ServiceMembershipRenewal[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ServiceClassSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const { currentBranch } = useBranch();
  const { user } = useAuth();
  
  // Initialize with default values
  const defaultDashboardData: DashboardSummary = useMemo(() => ({
    totalMembers: 0,
    activeMembers: 0,
    totalIncome: 0,
    revenue: { daily: 0, weekly: 0, monthly: 0 },
    pendingPayments: { count: 0, total: 0, items: [] },
    upcomingRenewals: 0,
    todayCheckIns: 0,
    newMembers: 0,
    expiringMemberships: 0,
    ...initialData
  }), [initialData]);

  const fetchData = useCallback(async () => {
    if (!user) {
      setError(new Error('User not authenticated'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch dashboard summary
      // Fetch dashboard summary
      const summary = await fetchDashboardSummary({
        branchId: currentBranch?.id,
        userId: user.id,
        role
      });

      // Fetch additional data based on role
      if (role === 'admin' || role === 'staff') {
        try {
          const [payments, renewals, classes] = await Promise.all([
            fetchPendingPayments({ 
              branchId: currentBranch?.id,
              limit: 10 // Limit to 10 items for performance
            }),
            fetchMembershipRenewals({ 
              branchId: currentBranch?.id,
              limit: 10 // Limit to 10 items for performance
            }),
            fetchUpcomingClasses({ 
              branchId: currentBranch?.id,
              limit: 10 // Limit to 10 items for performance
            })
          ]);
          
          // Handle payments response
          if (payments && Array.isArray(payments.items)) {
            setPendingPayments(payments.items);
          }
          
          // Handle renewals response
          if (Array.isArray(renewals)) {
            setUpcomingRenewals(renewals);
          }
          
          // Handle classes response
          if (Array.isArray(classes)) {
            setUpcomingClasses(classes);
          }
        } catch (fetchError) {
          console.error('Error fetching additional dashboard data:', fetchError);
          // Don't fail the whole request if additional data fails
        }
      }
      
      setDashboardData({
        ...defaultDashboardData,
        ...summary
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error in useDashboard:', err);
      setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id, role, user, defaultDashboardData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize the returned object to prevent unnecessary re-renders
  return useMemo(() => ({
    dashboardData: dashboardData || defaultDashboardData,
    pendingPayments,
    upcomingRenewals,
    upcomingClasses,
    isLoading,
    error,
    lastUpdated,
    refreshData: fetchData,
    hasData: !!dashboardData && !isLoading && !error,
    isEmpty: !isLoading && !error && (!dashboardData || (
      dashboardData.totalMembers === 0 &&
      dashboardData.activeMembers === 0 &&
      dashboardData.totalIncome === 0
    ))
  }), [
    dashboardData, 
    defaultDashboardData, 
    pendingPayments, 
    upcomingRenewals, 
    upcomingClasses, 
    isLoading, 
    error, 
    lastUpdated, 
    fetchData
  ]);
};

export default useDashboard;
