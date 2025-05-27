
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
  netIncome: number;
  revenueGrowth: number;
  pendingInvoices: Array<{
    id: string;
    memberName: string;
    amount: number;
    dueDate: string;
  }>;
  pendingAmount: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    amount: number;
  }>;
  expensesByCategory: Array<{
    category: string;
    amount: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
    category: string;
  }>;
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
        netIncome: 20000,
        revenueGrowth: 12.5,
        pendingInvoices: [
          {
            id: '1',
            memberName: 'John Doe',
            amount: 1500,
            dueDate: new Date().toISOString()
          }
        ],
        pendingAmount: 7500,
        monthlyRevenue: [
          { month: 'Jan', revenue: 40000, expenses: 22000, profit: 18000 },
          { month: 'Feb', revenue: 42000, expenses: 23000, profit: 19000 },
          { month: 'Mar', revenue: 45000, expenses: 25000, profit: 20000 }
        ],
        revenueByCategory: [
          { category: 'Membership Fees', amount: 35000 },
          { category: 'Personal Training', amount: 10000 }
        ],
        expensesByCategory: [
          { category: 'Equipment', amount: 15000 },
          { category: 'Utilities', amount: 10000 }
        ],
        recentTransactions: [
          {
            id: '1',
            type: 'income',
            amount: 1500,
            description: 'Membership Fee - John Doe',
            date: new Date().toISOString(),
            category: 'Membership'
          }
        ]
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
