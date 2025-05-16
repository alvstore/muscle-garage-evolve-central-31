
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FinancialTransaction, TransactionType } from '@/types/finance';
import { toast } from 'sonner';
import { useBranch } from './use-branch';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('branch_id', currentBranch?.id || '')
        .order('transaction_date', { ascending: false });

      if (error) throw error;

      const formattedTransactions: FinancialTransaction[] = data.map((transaction) => ({
        id: transaction.id,
        type: transaction.type as TransactionType,
        amount: transaction.amount,
        description: transaction.description,
        transaction_date: transaction.transaction_date,
        payment_method: transaction.payment_method,
        category: transaction.category_id, // Map category_id to category
        branch_id: transaction.branch_id,
        reference_id: transaction.reference_id,
        status: transaction.status || 'completed', // Add status with default value
        created_at: transaction.created_at || new Date().toISOString(), // Add created_at with default value
        updated_at: transaction.updated_at || new Date().toISOString(), // Add updated_at with default value
        recurring: false, // Default value as it might not exist in DB
        recurring_period: null // Default value as it might not exist in DB
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const createTransaction = async (transaction: Omit<FinancialTransaction, 'id'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            transaction_date: transaction.transaction_date,
            payment_method: transaction.payment_method,
            category_id: transaction.category, // Map category to category_id
            branch_id: transaction.branch_id || currentBranch?.id,
            reference_id: transaction.reference_id,
            status: transaction.status || 'completed', // Add status
          }
        ])
        .select();

      if (error) throw error;

      const newTransaction = data[0] as FinancialTransaction;
      setTransactions([newTransaction, ...transactions]);
      toast.success('Transaction created successfully');
      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Failed to create transaction');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<FinancialTransaction>) => {
    setIsLoading(true);
    try {
      // Map category to category_id if it exists in updates
      const dbUpdates: any = { ...updates };
      if (updates.category) {
        dbUpdates.category_id = updates.category;
        delete dbUpdates.category;
      }

      const { error } = await supabase
        .from('transactions')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setTransactions(transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ));
      
      toast.success('Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(transactions.filter(t => t.id !== id));
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchTransactions();
    }
  }, [currentBranch?.id, fetchTransactions]);

  return { 
    transactions, 
    isLoading, 
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
};
