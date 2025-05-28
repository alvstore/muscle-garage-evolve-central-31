
import { supabase } from '@/integrations/supabase/client';

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience_years?: number;
  certification?: string;
  bio?: string;
  is_active: boolean;
  branch_id: string;
  created_at: string;
  updated_at: string;
}

export const trainersService = {
  async getTrainers(branchId?: string): Promise<Trainer[]> {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer')
        .eq('is_active', true);

      if (branchId) {
        query = query.eq('branch_id', branchId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trainers:', error);
      return [];
    }
  },

  async getTrainerById(id: string): Promise<Trainer | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'trainer')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching trainer:', error);
      return null;
    }
  }
};
