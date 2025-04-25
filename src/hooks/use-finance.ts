
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface Invoice {
  id: string;
  memberId?: string;
  memberName?: string;
  amount: number;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paymentMethod?: string;
  notes?: string;
  items?: any[];
  branchId?: string;
  membershipPlanId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  transactionDate: string;
  categoryId?: string;
  categoryName?: string;
  description?: string;
  paymentMethod?: string;
  referenceId?: string;
  branchId?: string;
  recordedBy?: string;
  recordedByName?: string;
}

// Hook to manage invoices
export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Only fetch if we have a branch
      if (!currentBranch?.id) {
        setInvoices([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('invoices')
        .select(`
          id,
          member_id,
          amount,
          issued_date,
          due_date,
          paid_date,
          status,
          payment_method,
          notes,
          items,
          branch_id,
          membership_plan_id,
          created_at,
          updated_at,
          members:member_id (name)
        `)
        .eq('branch_id', currentBranch.id)
        .order('due_date', { ascending: false });

      if (fetchError) throw fetchError;
      
      // Format the data for the frontend
      const formattedInvoices = data?.map(invoice => ({
        id: invoice.id,
        memberId: invoice.member_id,
        memberName: invoice.members?.name,
        amount: invoice.amount,
        issuedDate: invoice.issued_date,
        dueDate: invoice.due_date,
        paidDate: invoice.paid_date,
        status: invoice.status as 'paid' | 'pending' | 'overdue' | 'partial',
        paymentMethod: invoice.payment_method,
        notes: invoice.notes,
        items: invoice.items,
        branchId: invoice.branch_id,
        membershipPlanId: invoice.membership_plan_id,
        createdAt: invoice.created_at,
        updatedAt: invoice.updated_at
      })) || [];
      
      setInvoices(formattedInvoices);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices');
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!currentBranch?.id) {
      setInvoices([]);
      setIsLoading(false);
      return;
    }
    
    fetchInvoices();
    
    // Set up real-time subscription for invoices table
    const channel = supabase
      .channel('invoices_realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoices',
          filter: `branch_id=eq.${currentBranch.id}`
        }, 
        (payload) => {
          console.log('Invoices data changed:', payload);
          fetchInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch]);

  return {
    invoices,
    isLoading,
    error,
    refetch: fetchInvoices
  };
};

// Hook to manage transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Only fetch if we have a branch
      if (!currentBranch?.id) {
        setTransactions([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select(`
          id,
          type,
          amount,
          transaction_date,
          category_id,
          description,
          payment_method,
          reference_id,
          branch_id,
          recorded_by,
          income_categories:category_id (name),
          expense_categories:category_id (name),
          profiles:recorded_by (full_name)
        `)
        .eq('branch_id', currentBranch.id)
        .order('transaction_date', { ascending: false });

      if (fetchError) throw fetchError;
      
      // Format the data for the frontend
      const formattedTransactions = data?.map(transaction => ({
        id: transaction.id,
        type: transaction.type as 'income' | 'expense',
        amount: transaction.amount,
        transactionDate: transaction.transaction_date,
        categoryId: transaction.category_id,
        categoryName: transaction.type === 'income' 
          ? transaction.income_categories?.name 
          : transaction.expense_categories?.name,
        description: transaction.description,
        paymentMethod: transaction.payment_method,
        referenceId: transaction.reference_id,
        branchId: transaction.branch_id,
        recordedBy: transaction.recorded_by,
        recordedByName: transaction.profiles?.full_name
      })) || [];
      
      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!currentBranch?.id) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }
    
    fetchTransactions();
    
    // Set up real-time subscription for transactions table
    const channel = supabase
      .channel('transactions_realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          filter: `branch_id=eq.${currentBranch.id}`
        }, 
        (payload) => {
          console.log('Transactions data changed:', payload);
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions
  };
};
