
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Generic interface for settings objects
export interface Settings {
  id?: string;
  branch_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow any additional properties
}

const settingsService = {
  // Generic function to get settings from a specific table
  async getSettings<T extends Settings>(tableName: string, branchId?: string): Promise<T | null> {
    try {
      let query = supabase.from(tableName).select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      return data as T;
    } catch (error: any) {
      console.error(`Error fetching ${tableName} settings:`, error);
      toast.error(`Failed to load settings: ${error.message}`);
      return null;
    }
  },
  
  // Generic function to save settings to a specific table
  async saveSettings<T extends Settings>(tableName: string, settings: T): Promise<T | null> {
    try {
      let response;
      
      if (settings.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from(tableName)
          .update({ 
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select();
          
        if (error) throw error;
        response = data?.[0];
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from(tableName)
          .insert({ 
            ...settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
          
        if (error) throw error;
        response = data?.[0];
      }
      
      toast.success('Settings saved successfully');
      return response;
    } catch (error: any) {
      console.error(`Error saving ${tableName} settings:`, error);
      toast.error(`Failed to save settings: ${error.message}`);
      return null;
    }
  },
  
  // Get SMS settings for a specific branch
  async getSmsSettings(branchId?: string) {
    return this.getSettings('sms_settings', branchId);
  },
  
  // Save SMS settings
  async saveSmsSettings(settings: any) {
    return this.saveSettings('sms_settings', settings);
  },
  
  // Get Email settings for a specific branch
  async getEmailSettings(branchId?: string) {
    return this.getSettings('email_settings', branchId);
  },
  
  // Save Email settings
  async saveEmailSettings(settings: any) {
    return this.saveSettings('email_settings', settings);
  },
  
  // Get WhatsApp settings for a specific branch
  async getWhatsAppSettings(branchId?: string) {
    return this.getSettings('whatsapp_settings', branchId);
  },
  
  // Save WhatsApp settings
  async saveWhatsAppSettings(settings: any) {
    return this.saveSettings('whatsapp_settings', settings);
  },
  
  // Get automation rules
  async getAutomationRules(branchId?: string): Promise<any[]> {
    try {
      let query = supabase.from('automation_rules').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching automation rules:', error);
      toast.error(`Failed to load automation rules: ${error.message}`);
      return [];
    }
  },
  
  // Save an automation rule
  async saveAutomationRule(rule: any): Promise<any | null> {
    try {
      let response;
      
      if (rule.id) {
        // Update existing rule
        const { data, error } = await supabase
          .from('automation_rules')
          .update({ 
            ...rule,
            updated_at: new Date().toISOString()
          })
          .eq('id', rule.id)
          .select();
          
        if (error) throw error;
        response = data?.[0];
      } else {
        // Insert new rule
        const { data, error } = await supabase
          .from('automation_rules')
          .insert({ 
            ...rule,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
          
        if (error) throw error;
        response = data?.[0];
      }
      
      toast.success('Automation rule saved successfully');
      return response;
    } catch (error: any) {
      console.error('Error saving automation rule:', error);
      toast.error(`Failed to save automation rule: ${error.message}`);
      return null;
    }
  },
  
  // Delete an automation rule
  async deleteAutomationRule(ruleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', ruleId);
        
      if (error) throw error;
      toast.success('Automation rule deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting automation rule:', error);
      toast.error(`Failed to delete automation rule: ${error.message}`);
      return false;
    }
  },
  
  // Get templates by type (sms, email, whatsapp)
  async getTemplates(type: 'sms' | 'email' | 'whatsapp', branchId?: string): Promise<any[]> {
    try {
      let tableName = `${type}_templates`;
      let query = supabase.from(tableName).select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error(`Error fetching ${type} templates:`, error);
      toast.error(`Failed to load templates: ${error.message}`);
      return [];
    }
  },
  
  // Save a template
  async saveTemplate(type: 'sms' | 'email' | 'whatsapp', template: any): Promise<any | null> {
    try {
      let tableName = `${type}_templates`;
      let response;
      
      if (template.id) {
        // Update existing template
        const { data, error } = await supabase
          .from(tableName)
          .update({ 
            ...template,
            updated_at: new Date().toISOString()
          })
          .eq('id', template.id)
          .select();
          
        if (error) throw error;
        response = data?.[0];
      } else {
        // Insert new template
        const { data, error } = await supabase
          .from(tableName)
          .insert({ 
            ...template,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
          
        if (error) throw error;
        response = data?.[0];
      }
      
      toast.success('Template saved successfully');
      return response;
    } catch (error: any) {
      console.error(`Error saving ${type} template:`, error);
      toast.error(`Failed to save template: ${error.message}`);
      return null;
    }
  },
  
  // Delete a template
  async deleteTemplate(type: 'sms' | 'email' | 'whatsapp', templateId: string): Promise<boolean> {
    try {
      let tableName = `${type}_templates`;
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', templateId);
        
      if (error) throw error;
      toast.success('Template deleted successfully');
      return true;
    } catch (error: any) {
      console.error(`Error deleting ${type} template:`, error);
      toast.error(`Failed to delete template: ${error.message}`);
      return false;
    }
  }
};

export default settingsService;
