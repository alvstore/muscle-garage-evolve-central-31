
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
      let combinedTransactions: FinancialTransaction[] = [];
      
      // 1. Fetch from transactions table
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('branch_id', currentBranch?.id || '')
        .eq('type', 'income')
        .order('transaction_date', { ascending: false });

      if (!transactionsError && transactionsData && transactionsData.length > 0) {
        const formattedTransactions: FinancialTransaction[] = transactionsData.map((transaction) => ({
          id: transaction.id,
          type: 'income' as TransactionType,
          amount: transaction.amount,
          description: transaction.description || '',
          transaction_date: transaction.transaction_date,
          payment_method: transaction.payment_method || 'unknown',
          category: transaction.category_id || transaction.category || 'Uncategorized',
          branch_id: transaction.branch_id,
          reference_id: transaction.reference_id || '',
          status: transaction.status || 'completed',
          created_at: transaction.created_at || new Date().toISOString(),
          updated_at: transaction.updated_at || new Date().toISOString(),
          recurring: false,
          recurring_period: null,
          source: transaction.source || 'Unknown'
        }));
        
        combinedTransactions = [...formattedTransactions];
      }
      
      // 2. Fetch from income_records table
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_records')
        .select('*')
        .eq('branch_id', currentBranch?.id || '')
        .order('date', { ascending: false });
      
      if (!incomeError && incomeData && incomeData.length > 0) {
        const formattedIncomeRecords: FinancialTransaction[] = incomeData.map((record) => ({
          id: record.id,
          type: 'income' as TransactionType,
          amount: record.amount,
          description: record.description || '',
          transaction_date: record.date,
          payment_method: record.payment_method || 'unknown',
          category: record.category || 'Uncategorized',
          branch_id: record.branch_id,
          reference_id: record.reference || '',
          status: 'completed',
          created_at: record.created_at || new Date().toISOString(),
          updated_at: record.updated_at || new Date().toISOString(),
          recurring: false,
          recurring_period: null,
          source: record.source || 'Unknown'
        }));
        
        combinedTransactions = [...combinedTransactions, ...formattedIncomeRecords];
      }
      
      // 3. Fetch from payments table (for invoices and webhooks)
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*, members:member_id(name)')
        .eq('branch_id', currentBranch?.id || '')
        .order('payment_date', { ascending: false });
      
      if (!paymentsError && paymentsData && paymentsData.length > 0) {
        const formattedPayments: FinancialTransaction[] = paymentsData.map((payment) => ({
          id: payment.id,
          type: 'income' as TransactionType,
          amount: payment.amount,
          description: `Payment from ${payment.members?.name || 'Member'} ${payment.notes ? `- ${payment.notes}` : ''}`,
          transaction_date: payment.payment_date,
          payment_method: payment.payment_method || 'unknown',
          category: 'Membership Fees',
          branch_id: payment.branch_id,
          reference_id: payment.transaction_id || payment.razorpay_payment_id || '',
          status: payment.status || 'completed',
          created_at: payment.created_at || new Date().toISOString(),
          updated_at: payment.updated_at || new Date().toISOString(),
          recurring: false,
          recurring_period: null,
          source: payment.razorpay_payment_id ? 'Razorpay' : (payment.transaction_id ? 'Online' : 'Manual Entry'),
          member_id: payment.member_id
        }));
        
        combinedTransactions = [...combinedTransactions, ...formattedPayments];
      }
      
      // Sort all transactions by date, most recent first
      combinedTransactions.sort((a, b) => {
        const dateA = new Date(a.transaction_date || a.created_at).getTime();
        const dateB = new Date(b.transaction_date || b.created_at).getTime();
        return dateB - dateA;
      });
      
      setTransactions(combinedTransactions);
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
      const now = new Date().toISOString();
      let result: any = null;
      
      // For income transactions, insert into income_records
      if (transaction.type === 'income') {
        const { data, error } = await supabase
          .from('income_records')
          .insert([
            {
              date: transaction.transaction_date || now,
              amount: transaction.amount,
              category: transaction.category || 'Uncategorized',
              description: transaction.description || '',
              source: transaction.source || 'Manual Entry',
              payment_method: transaction.payment_method || 'cash',
              reference: transaction.reference_id || '',
              branch_id: transaction.branch_id || currentBranch?.id,
              created_at: now,
              updated_at: now
            }
          ])
          .select();

        if (error) {
          // If income_records fails, try transactions table as fallback
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('transactions')
            .insert([
              {
                type: 'income',
                amount: transaction.amount,
                description: transaction.description,
                transaction_date: transaction.transaction_date || now,
                payment_method: transaction.payment_method,
                category: transaction.category, // Use category directly
                branch_id: transaction.branch_id || currentBranch?.id,
                reference_id: transaction.reference_id,
                status: transaction.status || 'completed',
                created_at: now,
                updated_at: now
              }
            ])
            .select();

          if (fallbackError) throw fallbackError;
          result = fallbackData[0];
        } else {
          result = data[0];
        }
      } else {
        // For other transaction types, use the transactions table
        const { data, error } = await supabase
          .from('transactions')
          .insert([
            {
              type: transaction.type,
              amount: transaction.amount,
              description: transaction.description,
              transaction_date: transaction.transaction_date || now,
              payment_method: transaction.payment_method,
              category: transaction.category, // Use category directly
              branch_id: transaction.branch_id || currentBranch?.id,
              reference_id: transaction.reference_id,
              status: transaction.status || 'completed',
              created_at: now,
              updated_at: now
            }
          ])
          .select();

        if (error) throw error;
        result = data[0];
      }

      // Format the result to match FinancialTransaction interface
      const newTransaction: FinancialTransaction = {
        id: result.id,
        type: transaction.type,
        amount: result.amount,
        description: result.description || transaction.description || '',
        transaction_date: result.date || result.transaction_date || now,
        payment_method: result.payment_method || transaction.payment_method || 'unknown',
        category: result.category || transaction.category || 'Uncategorized',
        branch_id: result.branch_id || transaction.branch_id || currentBranch?.id || '',
        reference_id: result.reference || result.reference_id || transaction.reference_id || '',
        status: result.status || transaction.status || 'completed',
        created_at: result.created_at || now,
        updated_at: result.updated_at || now,
        recurring: transaction.recurring || false,
        recurring_period: transaction.recurring_period || null,
        source: result.source || transaction.source || 'Manual Entry'
      };

      // Update the local state
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
      const now = new Date().toISOString();
      const transactionType = updates.type?.toLowerCase() || 'unknown';
      let success = false;
      
      // First, find the transaction to determine which table it belongs to
      const existingTransaction = transactions.find(t => t.id === id);
      
      if (existingTransaction?.type === 'income' || transactionType === 'income') {
        // Try to update in income_records table first
        const { error: incomeError } = await supabase
          .from('income_records')
          .update({
            date: updates.transaction_date,
            amount: updates.amount,
            category: updates.category,
            description: updates.description,
            source: updates.source,
            payment_method: updates.payment_method,
            reference: updates.reference_id,
            updated_at: now
          })
          .eq('id', id);
        
        if (incomeError) {
          // If income_records fails, try transactions table
          const { error: transactionError } = await supabase
            .from('transactions')
            .update({
              amount: updates.amount,
              description: updates.description,
              transaction_date: updates.transaction_date,
              payment_method: updates.payment_method,
              category: updates.category,
              reference_id: updates.reference_id,
              status: updates.status,
              updated_at: now
            })
            .eq('id', id);
          
          if (transactionError) {
            // If transactions fails, try payments table
            const { error: paymentError } = await supabase
              .from('payments')
              .update({
                amount: updates.amount,
                notes: updates.description,
                payment_method: updates.payment_method,
                status: updates.status,
                updated_at: now
              })
              .eq('id', id);
            
            if (paymentError) throw paymentError;
            success = true;
          } else {
            success = true;
          }
        } else {
          success = true;
        }
      } else {
        // For other transaction types, use the transactions table
        const { error } = await supabase
          .from('transactions')
          .update({
            amount: updates.amount,
            description: updates.description,
            transaction_date: updates.transaction_date,
            payment_method: updates.payment_method,
            category: updates.category,
            reference_id: updates.reference_id,
            status: updates.status,
            updated_at: now
          })
          .eq('id', id);
        
        if (error) throw error;
        success = true;
      }

      if (success) {
        // Update local state
        setTransactions(transactions.map(t => 
          t.id === id ? { ...t, ...updates, updated_at: now } : t
        ));
        
        toast.success('Transaction updated successfully');
      } else {
        throw new Error('Failed to update transaction in any table');
      }
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
      let success = false;
      
      // Try to delete from all possible tables
      // First try income_records
      const { error: incomeError } = await supabase
        .from('income_records')
        .delete()
        .eq('id', id);
      
      if (!incomeError) {
        success = true;
      } else {
        // Try transactions table
        const { error: transactionError } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);
        
        if (!transactionError) {
          success = true;
        } else {
          // Try payments table
          const { error: paymentError } = await supabase
            .from('payments')
            .delete()
            .eq('id', id);
          
          if (!paymentError) {
            success = true;
          } else {
            throw new Error('Failed to delete transaction from any table');
          }
        }
      }

      if (success) {
        // Update local state
        setTransactions(transactions.filter(t => t.id !== id));
        toast.success('Transaction deleted successfully');
      }
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
