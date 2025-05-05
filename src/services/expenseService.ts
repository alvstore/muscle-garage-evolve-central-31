
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  vendor: string;
  reference: string;
  status: string;
  payment_method: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  branch_id?: string;
}

export const expenseService = {
  // Fetch all expenses with optional filters
  async getExpenses(filters?: { category?: string; startDate?: string; endDate?: string }): Promise<Expense[]> {
    try {
      let query = supabase
        .from('expense_records')
        .select('*')
        .order('date', { ascending: false });
      
      // Apply filters if provided
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.startDate && filters?.endDate) {
        query = query
          .gte('date', filters.startDate)
          .lte('date', filters.endDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      toast.error(error.message || 'Failed to fetch expenses');
      return [];
    }
  },
  
  // Create a new expense
  async createExpense(expense: Omit<Expense, 'id'>): Promise<Expense | null> {
    try {
      const { data, error } = await supabase
        .from('expense_records')
        .insert([{
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          vendor: expense.vendor,
          reference: expense.reference,
          status: expense.status,
          payment_method: expense.payment_method,
          branch_id: expense.branch_id
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Expense created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating expense:', error);
      toast.error(error.message || 'Failed to create expense');
      return null;
    }
  },
  
  // Update an existing expense
  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense | null> {
    try {
      const { data, error } = await supabase
        .from('expense_records')
        .update({
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          vendor: expense.vendor,
          reference: expense.reference,
          status: expense.status,
          payment_method: expense.payment_method
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Expense updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating expense:', error);
      toast.error(error.message || 'Failed to update expense');
      return null;
    }
  },
  
  // Delete an expense
  async deleteExpense(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expense_records')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Expense deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast.error(error.message || 'Failed to delete expense');
      return false;
    }
  },
  
  // Get expense categories
  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
        
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching expense categories:', error);
      toast.error(error.message || 'Failed to fetch expense categories');
      return [];
    }
  },
  
  // Create a new expense category
  async createExpenseCategory(category: Omit<ExpenseCategory, 'id'>): Promise<ExpenseCategory | null> {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .insert([{
          name: category.name,
          description: category.description,
          is_active: category.is_active || true,
          branch_id: category.branch_id
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Expense category created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating expense category:', error);
      toast.error(error.message || 'Failed to create expense category');
      return null;
    }
  }
};
