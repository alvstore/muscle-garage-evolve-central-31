
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { subDays } from 'date-fns';

// Make DateRange compatible with react-day-picker
export interface DateRange {
  from: Date;
  to: Date;
}

interface ChartData {
  labels: string[];
  data: number[];
}

interface TrainerData {
  trainer_id: string;
  trainer_name: string;
  sessions_conducted: number;
  minutes_utilized: number;
  total_capacity_minutes: number;
  utilization_percentage: number;
  branch_id: string;
}

interface ClassPerformanceData {
  class_id: string;
  class_name: string;
  class_type: string;
  capacity: number;
  enrolled: number;
  actual_attendance: number;
  enrollment_percentage: number;
  attendance_percentage: number;
  performance_category: string;
  branch_id: string;
}

interface ChurnRiskMember {
  member_id: string;
  member_name: string;
  status: string;
  days_since_last_visit: number;
  visits_last_30_days: number;
  days_until_expiry: number;
  churn_risk_score: number;
  primary_risk_factor: string | null;
  branch_id: string;
}

interface InventoryAlert {
  id: string;
  name: string;
  quantity: number;
  reorder_level: number;
  stock_status: string;
  branch_id: string;
}

// Usage stats hooks

export const useRevenueStats = (dateRange: DateRange) => {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentBranch || !dateRange.from || !dateRange.to) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.rpc('get_revenue_breakdown', {
          branch_id_param: currentBranch.id,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString()
        });
        
        if (error) throw new Error(error.message);
        
        // Transform the data for chart display
        const labels = data.map(item => item.category);
        const values = data.map(item => Number(item.amount));
        
        setData({ labels, data: values });
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch revenue data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentBranch, dateRange]);
  
  return { data, isLoading, error };
};

export const useAttendanceStats = (dateRange: DateRange) => {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentBranch || !dateRange.from || !dateRange.to) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.rpc('get_attendance_trend', {
          branch_id_param: currentBranch.id,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString()
        });
        
        if (error) throw new Error(error.message);
        
        // Transform the data for chart display
        const labels = data.map(item => item.date_point);
        const values = data.map(item => Number(item.attendance_count));
        
        setData({ labels, data: values });
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch attendance data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentBranch, dateRange]);
  
  return { data, isLoading, error };
};

export const useMembershipStats = (dateRange: DateRange) => {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentBranch || !dateRange.from || !dateRange.to) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.rpc('get_membership_trend', {
          branch_id_param: currentBranch.id,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString()
        });
        
        if (error) throw new Error(error.message);
        
        // Create a summary for display
        const categories = ['New', 'Renewed', 'Expired', 'Cancelled'];
        const values = [
          data.reduce((sum, item) => sum + item.new_members, 0),
          data.reduce((sum, item) => sum + Math.max(0, item.net_change - item.new_members), 0),
          data.reduce((sum, item) => sum + Math.max(0, item.new_members - item.net_change - item.cancelled_members), 0),
          data.reduce((sum, item) => sum + item.cancelled_members, 0)
        ];
        
        setData({ labels: categories, data: values });
      } catch (err) {
        console.error("Error fetching membership data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch membership data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentBranch, dateRange]);
  
  return { data, isLoading, error };
};

export const useTrainerUtilization = () => {
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentBranch) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('trainer_utilization')
          .select('*')
          .eq('branch_id', currentBranch.id);
        
        if (error) throw new Error(error.message);
        setTrainers(data || []);
      } catch (err) {
        console.error("Error fetching trainer utilization:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch trainer data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentBranch]);
  
  return { trainers, isLoading, error };
};

export const useClassPerformance = () => {
  const [classes, setClasses] = useState<ClassPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentBranch) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('class_performance')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('performance_category', { ascending: false });
        
        if (error) throw new Error(error.message);
        setClasses(data || []);
      } catch (err) {
        console.error("Error fetching class performance:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch class data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentBranch]);
  
  return { classes, isLoading, error };
};

export const useChurnRiskMembers = () => {
  const [members, setMembers] = useState<ChurnRiskMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentBranch) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('member_churn_risk')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('churn_risk_score', { ascending: false })
          .limit(10);
        
        if (error) throw new Error(error.message);
        setMembers(data || []);
      } catch (err) {
        console.error("Error fetching churn risk data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch churn risk data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentBranch]);
  
  return { members, isLoading, error };
};

export const useInventoryAlerts = () => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentBranch) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('inventory_alerts')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('stock_status', { ascending: true });
        
        if (error) throw new Error(error.message);
        setAlerts(data || []);
      } catch (err) {
        console.error("Error fetching inventory alerts:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch inventory alerts");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentBranch]);
  
  return { alerts, isLoading, error };
};

export const useDashboardSummary = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentBranch) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('analytics_dashboard_stats')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .single();
        
        if (error && error.code !== 'PGRST116') throw new Error(error.message);
        setData(data || {});
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard summary");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentBranch]);
  
  return { data, isLoading, error };
};
