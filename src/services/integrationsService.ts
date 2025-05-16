
import { supabase } from '@/integrations/supabase/client';
import { EmailSettings, IntegrationStatus, AttendanceSettings } from '@/types/notification';
import { AutomationRule } from '@/types/crm';
import { toast } from 'sonner';

export const integrationsService = {
  // Email Settings
  getEmailSettings: async (branchId?: string): Promise<EmailSettings | null> => {
    try {
      let query = supabase
        .from('email_settings')
        .select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, not an error for us
          return null;
        }
        console.error('Error fetching email settings:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Integrations service error:', err);
      toast.error('Failed to load email settings');
      return null;
    }
  },
  
  // Integration Statuses
  getIntegrationStatus: async (integrationKey: string, branchId?: string): Promise<IntegrationStatus | null> => {
    try {
      let query = supabase
        .from('integration_statuses')
        .select('*')
        .eq('integration_key', integrationKey);
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, not an error for us
          return null;
        }
        console.error(`Error fetching ${integrationKey} integration status:`, error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Integrations service error:', err);
      toast.error(`Failed to load ${integrationKey} integration status`);
      return null;
    }
  },
  
  // Automation Rules
  getAutomationRules: async (branchId?: string): Promise<AutomationRule[]> => {
    try {
      let query = supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching automation rules:', error);
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error('Integrations service error:', err);
      toast.error('Failed to load automation rules');
      return [];
    }
  },

  // Add missing methods for automation rules
  saveAutomationRule: async (rule: Partial<AutomationRule>): Promise<AutomationRule | null> => {
    try {
      let data;
      let error;

      if (rule.id) {
        // Update existing rule
        const response = await supabase
          .from('automation_rules')
          .update(rule)
          .eq('id', rule.id)
          .select()
          .single();
          
        data = response.data;
        error = response.error;
        
        if (!error) {
          toast.success('Automation rule updated successfully');
        }
      } else {
        // Create new rule
        const response = await supabase
          .from('automation_rules')
          .insert([rule])
          .select()
          .single();
          
        data = response.data;
        error = response.error;
        
        if (!error) {
          toast.success('Automation rule created successfully');
        }
      }
      
      if (error) {
        console.error('Error saving automation rule:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Integrations service error:', err);
      toast.error('Failed to save automation rule');
      return null;
    }
  },

  deleteAutomationRule: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting automation rule:', error);
        throw error;
      }
      
      toast.success('Automation rule deleted successfully');
      return true;
    } catch (err) {
      console.error('Integrations service error:', err);
      toast.error('Failed to delete automation rule');
      return false;
    }
  },
  
  // Attendance Settings
  getAttendanceSettings: async (branchId?: string): Promise<AttendanceSettings | null> => {
    try {
      let query = supabase
        .from('attendance_settings')
        .select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching attendance settings:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Integrations service error:', err);
      toast.error('Failed to load attendance settings');
      return null;
    }
  }
};
