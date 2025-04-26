
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Setting {
  id: string;
  category: string;
  key: string;
  value: any;
  description?: string;
  branch_id?: string;
}

export const settingsService = {
  async getSettings(category?: string) {
    try {
      let query = supabase.from('settings').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  async updateSetting(category: string, key: string, value: any, branchId?: string) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          category,
          key,
          value,
          branch_id: branchId
        }, {
          onConflict: 'category,key,branch_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }
};

export default settingsService;
