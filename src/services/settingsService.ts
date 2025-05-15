
import { AutomationRule } from '@/types/crm';
import { supabase } from '@/integrations/supabase/client';

const settingsService = {
  // Existing Hikvision methods
  getHikvisionSettings: async (branchId?: string) => {
    try {
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId || '')
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  saveHikvisionSettings: async (settings: any) => {
    try {
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .upsert({
          branch_id: settings.branchId,
          api_url: settings.apiUrl,
          app_key: settings.appKey,
          app_secret: settings.secretKey,
          is_active: true,
        })
        .select();
      
      return { success: !error, data };
    } catch (error) {
      return { success: false, error };
    }
  },
  
  testHikvisionConnection: async (settings: any) => {
    try {
      // Simulate API call - in a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if required fields are present
      if (!settings.apiUrl || !settings.appKey || !settings.secretKey) {
        return { success: false, message: 'Missing required credentials' };
      }
      
      return { success: true, message: 'Successfully connected to Hikvision API' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection test failed' 
      };
    }
  },
  
  getHikvisionSites: async (branchId: string) => {
    try {
      // In a real app, this would fetch sites from the Hikvision API
      return { 
        data: [
          { id: 'site1', name: 'Main Facility' },
          { id: 'site2', name: 'Secondary Location' }
        ], 
        error: null 
      };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Add integration methods for the component that's expecting them
  getIntegrationSettings: async (integration: string, branchId?: string) => {
    try {
      if (integration === 'hikvision') {
        return settingsService.getHikvisionSettings(branchId);
      }
      
      const { data, error } = await supabase
        .from('integration_statuses')
        .select('*')
        .eq('integration_key', integration)
        .eq('branch_id', branchId || '')
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  saveIntegrationSettings: async (integration: string, settings: any, branchId?: string) => {
    try {
      if (integration === 'hikvision') {
        return settingsService.saveHikvisionSettings({
          ...settings,
          branchId
        });
      }
      
      const { data, error } = await supabase
        .from('integration_statuses')
        .upsert({
          integration_key: integration,
          branch_id: branchId,
          name: settings.name || integration,
          status: settings.enabled ? 'active' : 'inactive',
          config: settings
        })
        .select();
      
      return { success: !error, data };
    } catch (error) {
      return { success: false, error };
    }
  },
  
  testIntegrationConnection: async (integration: string, settings: any) => {
    try {
      if (integration === 'hikvision') {
        return settingsService.testHikvisionConnection(settings);
      }
      
      // Simulate API call for other integrations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: `Successfully connected to ${integration}` };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection test failed' 
      };
    }
  },
  
  // Automation rules methods
  getAutomationRules: async (branchId?: string) => {
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('branch_id', branchId || '');
      
      return { data, error };
    } catch (error) {
      return { data: [], error };
    }
  },
  
  saveAutomationRule: async (rule: Partial<AutomationRule>) => {
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .upsert(rule)
        .select();
      
      return { success: !error, data };
    } catch (error) {
      return { success: false, error };
    }
  },
  
  deleteAutomationRule: async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', ruleId);
      
      return { success: !error };
    } catch (error) {
      return { success: false, error };
    }
  },

  // Email settings methods
  getEmailSettings: async (branchId?: string) => {
    try {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('branch_id', branchId || '')
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  saveEmailSettings: async (settings: any) => {
    try {
      const { data, error } = await supabase
        .from('email_settings')
        .upsert(settings)
        .select();
      
      return { success: !error, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  // SMS settings methods
  getSmsSettings: async (branchId?: string) => {
    try {
      const { data, error } = await supabase
        .from('sms_settings')
        .select('*')
        .eq('branch_id', branchId || '')
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  saveSmsSettings: async (settings: any) => {
    try {
      const { data, error } = await supabase
        .from('sms_settings')
        .upsert(settings)
        .select();
      
      return { success: !error, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  // Template management methods
  getTemplates: async (type: 'email' | 'sms' | 'whatsapp', branchId?: string) => {
    const tableMap: Record<string, string> = {
      'email': 'email_templates',
      'sms': 'sms_templates',
      'whatsapp': 'whatsapp_templates'
    };

    try {
      const { data, error } = await supabase
        .from(tableMap[type])
        .select('*')
        .eq('branch_id', branchId || '');
      
      return { data, error };
    } catch (error) {
      return { data: [], error };
    }
  },

  saveTemplate: async (type: 'email' | 'sms' | 'whatsapp', template: any) => {
    const tableMap: Record<string, string> = {
      'email': 'email_templates',
      'sms': 'sms_templates',
      'whatsapp': 'whatsapp_templates'
    };

    try {
      const { data, error } = await supabase
        .from(tableMap[type])
        .upsert(template)
        .select();
      
      return { success: !error, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  deleteTemplate: async (type: 'email' | 'sms' | 'whatsapp', templateId: string) => {
    const tableMap: Record<string, string> = {
      'email': 'email_templates',
      'sms': 'sms_templates',
      'whatsapp': 'whatsapp_templates'
    };

    try {
      const { error } = await supabase
        .from(tableMap[type])
        .delete()
        .eq('id', templateId);
      
      return { success: !error };
    } catch (error) {
      return { success: false, error };
    }
  }
};

export default settingsService;
