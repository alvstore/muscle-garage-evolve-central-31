
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

export interface ClassSchedule {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  type: string;
  difficulty: string;
  capacity: number;
  location: string;
  start_time: string;
  end_time: string;
  recurring: boolean;
  recurring_pattern?: string;
  status: string;
  enrolled: number;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const classScheduleService = {
  async getTrainerClasses(trainerId: string): Promise<ClassSchedule[]> {
    try {
      const { data, error } = await supabase
        .from('class_schedules')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch classes');
      return [];
    }
  },

  async createClass(classData: Omit<ClassSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<ClassSchedule | null> {
    try {
      const { data, error } = await supabase
        .from('class_schedules')
        .insert([classData])
        .select()
        .single();

      if (error) throw error;
      toast.success('Class created successfully');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create class');
      return null;
    }
  },

  async updateClass(id: string, updates: Partial<ClassSchedule>): Promise<ClassSchedule | null> {
    try {
      const { data, error } = await supabase
        .from('class_schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Class updated successfully');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update class');
      return null;
    }
  },

  async deleteClass(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('class_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Class deleted successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete class');
      return false;
    }
  }
};
