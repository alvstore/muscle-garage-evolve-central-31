
import { supabase } from '@/integrations/supabase/client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  assigned_to?: string;
  created_by?: string;
  branch_id?: string;
  related_to?: string;
  related_id?: string;
  created_at: string;
  updated_at: string;
}

export const taskService = {
  getTasks: async (branchId?: string) => {
    let query = supabase.from('communication_tasks').select('*');
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
    
    return data as Task[] || [];
  },
  
  getTaskById: async (id: string) => {
    const { data, error } = await supabase
      .from('communication_tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
    
    return data as Task;
  },
  
  createTask: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('communication_tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }
    
    return data as Task;
  },
  
  updateTask: async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('communication_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
    
    return data as Task;
  },
  
  deleteTask: async (id: string) => {
    const { error } = await supabase
      .from('communication_tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
    
    return true;
  }
};
