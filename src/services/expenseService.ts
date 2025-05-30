
import { supabase } from '@/integrations/supabase/client';

export interface Expense {
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

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchExpenses = async (branchId?: string): Promise<Expense[]> => {
  let query = supabase.from('expense_records').select('*');
  
  if (branchId) {
    query = query.eq('branch_id', branchId);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchExpenseCategories = async (branchId?: string): Promise<ExpenseCategory[]> => {
  let query = supabase.from('expense_categories').select('*');
  
  if (branchId) {
    query = query.eq('branch_id', branchId);
  }
  
  const { data, error } = await query.order('name');
  
  if (error) {
    console.error('Error fetching expense categories:', error);
    throw error;
  }
  
  return data || [];
};

export const createExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expense_records')
    .insert([expense])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
  
  return data;
};

export const updateExpense = async (id: string, updates: Partial<Expense>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expense_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
  
  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('expense_records')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};
