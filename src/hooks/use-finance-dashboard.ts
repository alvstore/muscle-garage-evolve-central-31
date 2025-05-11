import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  revenueByCategory: {
    category: string;
    amount: number;
  }[];
  expensesByCategory: {
    category: string;
    amount: number;
  }[];
  recentTransactions: {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    date: string;
    description: string;
    category: string;
  }[];
  monthlyRevenue: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  pendingInvoices: {
    id: string;
    amount: number;
    dueDate: string;
    memberName: string;
  }[];
}

export const useFinanceDashboard = () => {
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary>({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    revenueByCategory: [],
    expensesByCategory: [],
    recentTransactions: [],
    monthlyRevenue: [],
    pendingInvoices: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();
  
  // Get all transactions for the current branch
  const fetchTransactions = async () => {
    if (!currentBranch?.id) return;
    
    try {
      // Fetch income records
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_records')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .order('date', { ascending: false });
        
      if (incomeError) throw incomeError;
      
      // Fetch expense records
      const { data: expenseData, error: expenseError } = await supabase
        .from('expense_records')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .order('date', { ascending: false });
        
      if (expenseError) throw expenseError;
      
      // Fetch pending invoices
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          id,
          amount,
          due_date,
          member_id,
          status
        `)
        .eq('branch_id', currentBranch.id)
        .eq('status', 'pending')
        .order('due_date', { ascending: true });
        
      if (invoiceError) throw invoiceError;

      // After fetching invoices, get member names
      const memberIds = invoiceData?.map(invoice => invoice.member_id).filter(Boolean) || [];
      
      // Only fetch member data if there are valid member IDs
      let memberNameMap: Record<string, string> = {};
      
      if (memberIds.length > 0) {
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('id, name')
          .in('id', memberIds);
          
        if (!membersError && membersData) {
          // Create a map of member id to name for easy lookup
          memberNameMap = membersData.reduce((acc: Record<string, string>, member) => {
            acc[member.id] = member.name;
            return acc;
          }, {});
        }
      }
      
      // Calculate totals
      const totalRevenue = incomeData?.reduce((sum, record) => sum + parseFloat(record.amount), 0) || 0;
      const totalExpenses = expenseData?.reduce((sum, record) => sum + parseFloat(record.amount), 0) || 0;
      const netIncome = totalRevenue - totalExpenses;
      
      // Group by category for revenue
      const revenueByCategory = [];
      const revenueCategories: Record<string, number> = {};
      
      incomeData?.forEach(record => {
        const category = record.category || 'Other';
        if (!revenueCategories[category]) {
          revenueCategories[category] = 0;
        }
        revenueCategories[category] += parseFloat(record.amount);
      });
      
      for (const [category, amount] of Object.entries(revenueCategories)) {
        revenueByCategory.push({ category, amount });
      }
      
      // Group by category for expenses
      const expensesByCategory = [];
      const expenseCategories: Record<string, number> = {};
      
      expenseData?.forEach(record => {
        const category = record.category || 'Other';
        if (!expenseCategories[category]) {
          expenseCategories[category] = 0;
        }
        expenseCategories[category] += parseFloat(record.amount);
      });
      
      for (const [category, amount] of Object.entries(expenseCategories)) {
        expensesByCategory.push({ category, amount });
      }
      
      // Format recent transactions (combine income and expense)
      let recentTransactions = [
        ...(incomeData || []).map(record => ({
          id: record.id,
          type: 'income' as const,
          amount: parseFloat(record.amount),
          date: record.date,
          description: record.description,
          category: record.category || 'Other'
        })),
        ...(expenseData || []).map(record => ({
          id: record.id,
          type: 'expense' as const,
          amount: parseFloat(record.amount),
          date: record.date,
          description: record.description,
          category: record.category || 'Other'
        }))
      ];
      
      // Sort by date (most recent first) and limit to 10
      recentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      recentTransactions = recentTransactions.slice(0, 10);
      
      // Format pending invoices - Fixed properly to handle member names
      const pendingInvoices = invoiceData?.map(invoice => {
        return {
          id: invoice.id,
          amount: parseFloat(invoice.amount),
          dueDate: invoice.due_date,
          memberName: invoice.member_id && memberNameMap[invoice.member_id] 
            ? memberNameMap[invoice.member_id] 
            : 'Unknown Member'
        };
      }) || [];
      
      // Calculate monthly revenue for the last 6 months
      const monthlyRevenue = await calculateMonthlyRevenue(currentBranch.id);
      
      setFinanceSummary({
        totalRevenue,
        totalExpenses,
        netIncome,
        revenueByCategory,
        expensesByCategory,
        recentTransactions,
        monthlyRevenue,
        pendingInvoices
      });
      
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError('Failed to load finance data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateMonthlyRevenue = async (branchId: string) => {
    const months = [];
    const currentDate = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      
      const year = date.getFullYear();
      const month = date.getMonth();
      
      // First day of month
      const startDate = new Date(year, month, 1);
      // Last day of month
      const endDate = new Date(year, month + 1, 0);
      
      // Format dates for database query
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Get month name
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      // Fetch income for this month
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_records')
        .select('amount')
        .eq('branch_id', branchId)
        .gte('date', startDateStr)
        .lte('date', endDateStr);
        
      if (incomeError) {
        console.error('Error fetching monthly income:', incomeError);
        continue;
      }
      
      // Fetch expenses for this month
      const { data: expenseData, error: expenseError } = await supabase
        .from('expense_records')
        .select('amount')
        .eq('branch_id', branchId)
        .gte('date', startDateStr)
        .lte('date', endDateStr);
        
      if (expenseError) {
        console.error('Error fetching monthly expenses:', expenseError);
        continue;
      }
      
      // Calculate totals
      const revenue = incomeData?.reduce((sum, record) => sum + parseFloat(record.amount), 0) || 0;
      const expenses = expenseData?.reduce((sum, record) => sum + parseFloat(record.amount), 0) || 0;
      const profit = revenue - expenses;
      
      months.push({
        month: monthName,
        revenue,
        expenses,
        profit
      });
    }
    
    return months;
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchTransactions();
    } else {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  return {
    financeSummary,
    isLoading,
    error,
    refreshData: fetchTransactions
  };
};
