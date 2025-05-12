
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { withBranchScope } from '@/integrations/supabase/middleware';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to?: string;
  created_by?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  related_to?: string; // Type of entity this task is related to (e.g., 'lead', 'member', 'class')
  related_id?: string; // ID of the related entity
}

export const taskService = {
  async getTasks(branchId: string | undefined): Promise<Task[]> {
    try {
      if (!branchId) {
        console.warn('No branch ID provided for getTasks');
        return [];
      }
      
      const { data, error } = await supabase
        .from('communication_tasks')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching tasks:', error);
        throw error;
      }
      
      return data as Task[];
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
    try {
      if (!task.branch_id) {
        toast.error('Branch ID is required to create a task');
        return null;
      }
      
      const taskWithTimestamps = {
        ...task,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('communication_tasks')
        .insert([taskWithTimestamps])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Task created successfully');
      return data as Task;
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error(`Failed to create task: ${error.message}`);
      return null;
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('communication_tasks')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Task updated successfully');
      return data as Task;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error(`Failed to update task: ${error.message}`);
      return null;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('communication_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Task deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error(`Failed to delete task: ${error.message}`);
      return false;
    }
  }
};
