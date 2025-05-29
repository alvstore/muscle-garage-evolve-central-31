import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/use-auth';
import { useBranch } from '@/hooks/settings/use-branches';
import { supabase } from '@/services/api/supabaseClient';

interface DashboardData {
  stats: {
    totalMembers: number;
    activeMembers: number;
    monthlyRevenue: number;
    attendanceRate: number;
    // Add more stats as needed
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
    // Add more activity fields as needed
  }>;
  // Add more data sections as needed
}

const useDashboardData = (role: string) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Base query with branch filter
      let query = supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('branch_id', currentBranch?.id);

      // Add role-specific filtering
      if (role === 'trainer') {
        query = query.eq('trainer_id', user?.id);
      } else if (role === 'member') {
        query = query.eq('member_id', user?.id);
      }

      const { data: dashboardData, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform data based on role
      const transformedData: DashboardData = {
        stats: {
          totalMembers: dashboardData[0]?.total_members || 0,
          activeMembers: dashboardData[0]?.active_members || 0,
          monthlyRevenue: dashboardData[0]?.monthly_revenue || 0,
          attendanceRate: dashboardData[0]?.attendance_rate || 0,
        },
        recentActivities: dashboardData[0]?.recent_activities || [],
      };

      setData(transformedData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchDashboardData();
    }
  }, [currentBranch, role, user?.id]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchDashboardData,
  };
};

export default useDashboardData;
