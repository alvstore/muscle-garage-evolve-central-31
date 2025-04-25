
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  transaction_date: string;
  description?: string;
  payment_method?: string;
  category_id?: string;
  category_name?: string;
  reference_id?: string;
  recorded_by?: string;
  branch_id?: string;
  created_at?: string;
}

export interface Invoice {
  id: string;
  member_id?: string;
  member_name?: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  issued_date: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  description?: string;
  payment_method?: string;
  branch_id?: string;
  membership_plan_id?: string;
  membership_plan_name?: string;
  items?: any[];
  created_at?: string;
  created_by?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  branch_id?: string;
  is_active?: boolean;
}

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!currentBranch?.id) {
        setTransactions([]);
        return;
      }

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          income_categories(name),
          expense_categories(name),
          profiles(full_name)
        `)
        .eq('branch_id', currentBranch.id)
        .order('transaction_date', { ascending: false });

      if (transactionsError) throw transactionsError;
      
      // Format the data for the frontend
      const formattedTransactions: Transaction[] = transactionsData?.map(transaction => {
        let categoryName = '';
        
        // Handle the case where income_categories or expense_categories might be arrays
        if (transaction.type === 'income' && transaction.income_categories) {
          if (Array.isArray(transaction.income_categories)) {
            categoryName = transaction.income_categories[0]?.name || '';
          } else {
            categoryName = transaction.income_categories.name || '';
          }
        } else if (transaction.expense_categories) {
          if (Array.isArray(transaction.expense_categories)) {
            categoryName = transaction.expense_categories[0]?.name || '';
          } else {
            categoryName = transaction.expense_categories.name || '';
          }
        }
        
        let recordedBy = '';
        if (transaction.profiles) {
          if (Array.isArray(transaction.profiles)) {
            recordedBy = transaction.profiles[0]?.full_name || '';
          } else {
            recordedBy = transaction.profiles.full_name || '';
          }
        }
        
        return {
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          transaction_date: transaction.transaction_date,
          description: transaction.description,
          payment_method: transaction.payment_method,
          category_id: transaction.category_id,
          category_name: categoryName,
          reference_id: transaction.reference_id,
          recorded_by: recordedBy,
          branch_id: transaction.branch_id,
          created_at: transaction.created_at
        };
      }) || [];
      
      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!currentBranch?.id) {
        setInvoices([]);
        return;
      }

      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          members(name),
          memberships(name),
          profiles(full_name)
        `)
        .eq('branch_id', currentBranch.id)
        .order('issued_date', { ascending: false });

      if (invoicesError) throw invoicesError;
      
      // Format the data for the frontend
      const formattedInvoices: Invoice[] = invoicesData?.map(invoice => {
        let memberName = '';
        if (invoice.members) {
          if (Array.isArray(invoice.members)) {
            memberName = invoice.members[0]?.name || '';
          } else {
            memberName = invoice.members.name || '';
          }
        }
        
        let membershipPlanName = '';
        if (invoice.memberships) {
          if (Array.isArray(invoice.memberships)) {
            membershipPlanName = invoice.memberships[0]?.name || '';
          } else {
            membershipPlanName = invoice.memberships.name || '';
          }
        }
        
        let createdBy = '';
        if (invoice.profiles) {
          if (Array.isArray(invoice.profiles)) {
            createdBy = invoice.profiles[0]?.full_name || '';
          } else {
            createdBy = invoice.profiles.full_name || '';
          }
        }
        
        return {
          id: invoice.id,
          member_id: invoice.member_id,
          member_name: memberName,
          amount: invoice.amount,
          due_date: invoice.due_date,
          paid_date: invoice.paid_date,
          issued_date: invoice.issued_date,
          status: invoice.status,
          description: invoice.description,
          payment_method: invoice.payment_method,
          branch_id: invoice.branch_id,
          membership_plan_id: invoice.membership_plan_id,
          membership_plan_name: membershipPlanName,
          items: invoice.items,
          created_at: invoice.created_at,
          created_by: createdBy
        };
      }) || [];
      
      setInvoices(formattedInvoices);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices');
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      if (!currentBranch?.id) {
        setIncomeCategories([]);
        setExpenseCategories([]);
        return;
      }

      // Fetch income categories
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_categories')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .eq('is_active', true)
        .order('name');

      if (incomeError) throw incomeError;
      
      // Fetch expense categories
      const { data: expenseData, error: expenseError } = await supabase
        .from('expense_categories')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .eq('is_active', true)
        .order('name');

      if (expenseError) throw expenseError;
      
      setIncomeCategories(incomeData || []);
      setExpenseCategories(expenseData || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchTransactions();
      fetchInvoices();
      fetchCategories();
    }
  }, [currentBranch?.id]);

  return {
    transactions,
    invoices,
    incomeCategories,
    expenseCategories,
    isLoading,
    error,
    fetchTransactions,
    fetchInvoices,
    fetchCategories
  };
};

// For component separation, also exposing these hooks
export const useTransactions = () => {
  const { transactions, isLoading, error, fetchTransactions } = useFinance();
  return { transactions, isLoading, error, fetchTransactions };
};

export const useInvoices = () => {
  const { invoices, isLoading, error, fetchInvoices } = useFinance();
  return { invoices, isLoading, error, fetchInvoices };
};

export const useCategories = () => {
  const { incomeCategories, expenseCategories, fetchCategories } = useFinance();
  return { incomeCategories, expenseCategories, fetchCategories };
};
