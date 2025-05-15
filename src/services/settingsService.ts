import { supabase } from '@/integrations/supabase/client';
import { AutomationRule } from '@/types/crm';
import { EmailSettings } from '@/types/notification';
import { toast } from 'sonner';

// Add missing automation rule methods
export const getAutomationRules = async (branchId?: string) => {
  try {
    let query = supabase.from('automation_rules').select('*');
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as AutomationRule[];
  } catch (error: any) {
    console.error('Error fetching automation rules:', error);
    toast.error('Failed to load automation rules');
    return [];
  }
};

export const saveAutomationRule = async (rule: AutomationRule) => {
  try {
    let response;
    
    if (rule.id) {
      // Update existing rule
      response = await supabase
        .from('automation_rules')
        .update({
          name: rule.name,
          description: rule.description,
          trigger_type: rule.trigger_type,
          trigger_condition: rule.trigger_condition,
          actions: rule.actions,
          is_active: rule.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', rule.id);
    } else {
      // Create new rule
      response = await supabase
        .from('automation_rules')
        .insert({
          name: rule.name,
          description: rule.description,
          trigger_type: rule.trigger_type,
          trigger_condition: rule.trigger_condition,
          actions: rule.actions,
          is_active: rule.is_active,
          branch_id: rule.branch_id,
          created_by: rule.created_by,
        });
    }
    
    if (response.error) {
      throw response.error;
    }
    
    toast.success(rule.id ? 'Rule updated successfully' : 'Rule created successfully');
    return true;
  } catch (error: any) {
    console.error('Error saving automation rule:', error);
    toast.error(`Failed to save rule: ${error.message}`);
    return false;
  }
};

export const deleteAutomationRule = async (id: string) => {
  try {
    const { error } = await supabase
      .from('automation_rules')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Rule deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting automation rule:', error);
    toast.error(`Failed to delete rule: ${error.message}`);
    return false;
  }
};

// Email settings
export const getEmailSettings = async (branchId?: string) => {
  try {
    let query = supabase.from('email_settings').select('*');
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
      throw error;
    }
    
    return data as EmailSettings;
  } catch (error: any) {
    console.error('Error fetching email settings:', error);
    return null;
  }
};

export const saveEmailSettings = async (settings: EmailSettings) => {
  try {
    const { id, ...settingsData } = settings;
    let response;
    
    if (id) {
      // Update existing settings
      response = await supabase
        .from('email_settings')
        .update({
          ...settingsData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    } else {
      // Create new settings
      response = await supabase
        .from('email_settings')
        .insert({
          ...settingsData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    if (response.error) {
      throw response.error;
    }
    
    toast.success('Email settings saved successfully');
    return true;
  } catch (error: any) {
    console.error('Error saving email settings:', error);
    toast.error(`Failed to save email settings: ${error.message}`);
    return false;
  }
};

// Company settings
export const getCompanySettings = async () => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error fetching company settings:', error);
    return null;
  }
};

export const saveCompanySettings = async (settings: any) => {
  try {
    const { id, ...settingsData } = settings;
    let response;
    
    if (id) {
      // Update existing settings
      response = await supabase
        .from('company_settings')
        .update({
          ...settingsData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    } else {
      // Create new settings
      response = await supabase
        .from('company_settings')
        .insert({
          ...settingsData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    if (response.error) {
      throw response.error;
    }
    
    toast.success('Company settings saved successfully');
    return true;
  } catch (error: any) {
    console.error('Error saving company settings:', error);
    toast.error(`Failed to save company settings: ${error.message}`);
    return false;
  }
};

// Attendance settings
export const getAttendanceSettings = async (branchId?: string) => {
  try {
    let query = supabase.from('attendance_settings').select('*');
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error fetching attendance settings:', error);
    return null;
  }
};

export const saveAttendanceSettings = async (settings: any) => {
  try {
    const { id, ...settingsData } = settings;
    let response;
    
    if (id) {
      // Update existing settings
      response = await supabase
        .from('attendance_settings')
        .update({
          ...settingsData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    } else {
      // Create new settings
      response = await supabase
        .from('attendance_settings')
        .insert({
          ...settingsData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    if (response.error) {
      throw response.error;
    }
    
    toast.success('Attendance settings saved successfully');
    return true;
  } catch (error: any) {
    console.error('Error saving attendance settings:', error);
    toast.error(`Failed to save attendance settings: ${error.message}`);
    return false;
  }
};

// Integration status
export const getIntegrationStatus = async (branchId?: string) => {
  try {
    let query = supabase.from('integration_status').select('*');
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error fetching integration status:', error);
    return [];
  }
};

export const updateIntegrationStatus = async (integrationKey: string, status: string, config?: any) => {
  try {
    const { error } = await supabase
      .from('integration_status')
      .update({
        status,
        config,
        updated_at: new Date().toISOString()
      })
      .eq('integration_key', integrationKey);
    
    if (error) {
      throw error;
    }
    
    toast.success('Integration status updated');
    return true;
  } catch (error: any) {
    console.error('Error updating integration status:', error);
    toast.error(`Failed to update integration: ${error.message}`);
    return false;
  }
};

export default {
  getAutomationRules,
  saveAutomationRule,
  deleteAutomationRule,
  getEmailSettings,
  saveEmailSettings,
  getCompanySettings,
  saveCompanySettings,
  getAttendanceSettings,
  saveAttendanceSettings,
  getIntegrationStatus,
  updateIntegrationStatus
};
