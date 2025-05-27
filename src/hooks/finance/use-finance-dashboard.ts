
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

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  revenueGrowth: number;
  pendingInvoices: number;
  pendingAmount: number;
}

export const useFinanceDashboard = (branchId?: string) => {
  const [data, setData] = useState<FinanceDashboardData | null>(null);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);
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

      const mockSummary: FinanceSummary = {
        totalRevenue: 45000,
        totalExpenses: 25000,
        profit: 20000,
        revenueGrowth: 12.5,
        pendingInvoices: 5,
        pendingAmount: 7500
      };

      setData(mockData);
      setFinanceSummary(mockSummary);
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchFinanceData();
  };

  return {
    data,
    financeSummary,
    isLoading,
    error,
    refetch: fetchFinanceData,
    refreshData
  };
};
