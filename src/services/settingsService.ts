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

// Hikvision integration methods
export const saveHikvisionSettings = async (settings: { apiUrl: string; appKey: string; secretKey: string; siteId?: string; branchId: string }) => {
  try {
    const { branchId, ...settingsData } = settings;
    
    // First, check if settings already exist for this branch
    const { data: existingSettings, error: fetchError } = await supabase
      .from('integration_settings')
      .select('*')
      .eq('integration_key', 'hikvision')
      .eq('branch_id', branchId)
      .single();
    
    let response;
    
    if (existingSettings) {
      // Update existing settings
      response = await supabase
        .from('integration_settings')
        .update({
          config: settingsData,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('integration_key', 'hikvision')
        .eq('branch_id', branchId);
    } else {
      // Create new settings
      response = await supabase
        .from('integration_settings')
        .insert({
          integration_key: 'hikvision',
          branch_id: branchId,
          config: settingsData,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    if (response.error) {
      throw response.error;
    }
    
    toast.success('Hikvision settings saved successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving Hikvision settings:', error);
    toast.error(`Failed to save Hikvision settings: ${error.message}`);
    return { success: false, message: error.message };
  }
};

export const testHikvisionConnection = async (credentials: { apiUrl: string; appKey: string; secretKey: string }) => {
  try {
    // Call the Edge Function to test the connection
    const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
      body: {
        action: 'token',
        apiUrl: credentials.apiUrl || 'https://api.hik-partner.com',
        appKey: credentials.appKey,
        secretKey: credentials.secretKey,
        isTestConnection: true
      }
    });
    
    if (error) {
      console.error('Error testing Hikvision connection:', error);
      return { 
        success: false, 
        message: `Edge function error: ${error.message}` 
      };
    }
    
    if (!data || (data.code !== '0' && data.errorCode !== '0')) {
      const errorMsg = data?.msg || data?.message || 'Unknown error';
      return { 
        success: false, 
        message: errorMsg 
      };
    }
    
    return { 
      success: true, 
      message: 'Connection successful',
      data
    };
  } catch (error: any) {
    console.error('Error testing Hikvision connection:', error);
    return { 
      success: false, 
      message: error.message || 'Connection test failed' 
    };
  }
};

export const getHikvisionSites = async (branchId: string) => {
  try {
    // First get the credentials from the settings
    const { data: settings, error: settingsError } = await supabase
      .from('integration_settings')
      .select('config')
      .eq('integration_key', 'hikvision')
      .eq('branch_id', branchId)
      .single();
    
    if (settingsError) {
      throw settingsError;
    }
    
    if (!settings || !settings.config) {
      return { data: [], error: 'No Hikvision settings found' };
    }
    
    const credentials = settings.config;
    
    // Call the Edge Function to get the token and available sites
    const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
      body: {
        action: 'token',
        apiUrl: credentials.apiUrl || 'https://api.hik-partner.com',
        appKey: credentials.appKey,
        secretKey: credentials.secretKey,
        branchId
      }
    });
    
    if (error) {
      throw error;
    }
    
    if (!data || (data.code !== '0' && data.errorCode !== '0')) {
      const errorMsg = data?.msg || data?.message || 'Unknown error';
      throw new Error(errorMsg);
    }
    
    // Return the available sites from the response
    return { 
      data: data.availableSites || [], 
      error: null 
    };
  } catch (error: any) {
    console.error('Error fetching Hikvision sites:', error);
    return { 
      data: [], 
      error: error.message || 'Failed to fetch sites' 
    };
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
  updateIntegrationStatus,
  saveHikvisionSettings,
  testHikvisionConnection,
  getHikvisionSites
};
