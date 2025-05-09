
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExpenseRecord {
  id: string;
  reference: string;
  date: string;
  amount: number;
  branch_id: string;
  status: string;
  payment_method: string;
  vendor: string;
  description: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export const expenseService = {
  async getExpenseRecords(branchId: string | undefined): Promise<ExpenseRecord[]> {
    try {
      if (!branchId) {
        console.warn('No branch ID provided for getExpenseRecords');
        return [];
      }
      
      const { data, error } = await supabase
        .from('expense_records')
        .select('*')
        .eq('branch_id', branchId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error fetching expense records:', error);
        toast.error('Failed to load expense records');
        return [];
      }
      
      return data as ExpenseRecord[];
    } catch (error: any) {
      console.error('Error fetching expense records:', error);
      toast.error('Failed to load expense records');
      return [];
    }
  },
  
  async createExpenseRecord(expense: Omit<ExpenseRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ExpenseRecord | null> {
    try {
      if (!expense.branch_id) {
        toast.error('Branch ID is required to create an expense record');
        return null;
      }
      
      const { data, error } = await supabase
        .from('expense_records')
        .insert([expense])
        .select()
        .single();

      if (error) {
        console.error('Error creating expense record:', error);
        toast.error(`Failed to create expense record: ${error.message}`);
        return null;
      }
      
      toast.success('Expense record created successfully');
      return data as ExpenseRecord;
    } catch (error: any) {
      console.error('Error creating expense record:', error);
      toast.error(`Failed to create expense record: ${error.message}`);
      return null;
    }
  },
  
  async updateExpenseRecord(id: string, updates: Partial<ExpenseRecord>): Promise<ExpenseRecord | null> {
    try {
      const { data, error } = await supabase
        .from('expense_records')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating expense record:', error);
        toast.error(`Failed to update expense record: ${error.message}`);
        return null;
      }
      
      toast.success('Expense record updated successfully');
      return data as ExpenseRecord;
    } catch (error: any) {
      console.error('Error updating expense record:', error);
      toast.error(`Failed to update expense record: ${error.message}`);
      return null;
    }
  },
  
  async deleteExpenseRecord(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expense_records')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting expense record:', error);
        toast.error(`Failed to delete expense record: ${error.message}`);
        return false;
      }
      
      toast.success('Expense record deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting expense record:', error);
      toast.error(`Failed to delete expense record: ${error.message}`);
      return false;
    }
  },
  
  async getExpenseCategories(branchId: string | undefined): Promise<{id: string, name: string}[]> {
    try {
      if (!branchId) {
        console.warn('No branch ID provided for getExpenseCategories');
        return [];
      }
      
      const { data, error } = await supabase
        .from('expense_categories')
        .select('id, name')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Supabase error fetching expense categories:', error);
        toast.error('Failed to load expense categories');
        return [];
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching expense categories:', error);
      toast.error('Failed to load expense categories');
      return [];
    }
  }
};
