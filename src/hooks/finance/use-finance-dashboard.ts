
// Finance dashboard hook
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FinanceDashboardData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingInvoices: number;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    expenses: number;
  }>;
}

export const useFinanceDashboard = (branchId?: string) => {
  const [data, setData] = useState<FinanceDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (branchId) {
      fetchFinanceData();
    }
  }, [branchId]);

  const fetchFinanceData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock finance data
      const mockData: FinanceDashboardData = {
        totalRevenue: 45000,
        totalExpenses: 25000,
        netProfit: 20000,
        pendingInvoices: 5,
        recentTransactions: [
          {
            id: '1',
            type: 'income',
            amount: 1500,
            description: 'Membership Fee - John Doe',
            date: new Date().toISOString()
          }
        ],
        monthlyRevenue: [
          { month: 'Jan', revenue: 40000, expenses: 22000 },
          { month: 'Feb', revenue: 42000, expenses: 23000 },
          { month: 'Mar', revenue: 45000, expenses: 25000 }
        ]
      };

      setData(mockData);
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchFinanceData
  };
};
