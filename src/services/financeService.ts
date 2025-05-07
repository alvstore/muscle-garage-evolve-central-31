
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FinancialTransaction } from '@/types/finance';

export const financeService = {
  async getTransactions(branchId: string | undefined): Promise<FinancialTransaction[]> {
    try {
      if (!branchId) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('branch_id', branchId)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data as FinancialTransaction[];
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
      return [];
    }
  },

  async createTransaction(transaction: Omit<FinancialTransaction, 'id'>): Promise<FinancialTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Transaction created successfully');
      return data as FinancialTransaction;
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast.error(`Failed to create transaction: ${error.message}`);
      return null;
    }
  },

  async updateTransaction(id: string, updates: Partial<FinancialTransaction>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Transaction updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast.error(`Failed to update transaction: ${error.message}`);
      return false;
    }
  },

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Transaction deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast.error(`Failed to delete transaction: ${error.message}`);
      return false;
    }
  }
};
