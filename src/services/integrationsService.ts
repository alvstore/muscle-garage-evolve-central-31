
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
