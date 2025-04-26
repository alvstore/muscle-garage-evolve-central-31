
import { supabase } from '@/integrations/supabase/client';

export interface Template {
  id: string;
  name: string;
  content: string;
  variables: Record<string, string>;
  description?: string;
  type: string;
  is_active: boolean;
}

export const templatesService = {
  async getTemplates(type: 'email' | 'sms' | 'whatsapp') {
    try {
      const { data, error } = await supabase
        .from(`${type}_templates`)
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching ${type} templates:`, error);
      throw error;
    }
  },

  async updateTemplate(type: 'email' | 'sms' | 'whatsapp', template: Partial<Template>) {
    try {
      const { data, error } = await supabase
        .from(`${type}_templates`)
        .upsert(template)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating ${type} template:`, error);
      throw error;
    }
  },

  async deleteTemplate(type: 'email' | 'sms' | 'whatsapp', id: string) {
    try {
      const { error } = await supabase
        .from(`${type}_templates`)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${type} template:`, error);
      throw error;
    }
  }
};

export default templatesService;
