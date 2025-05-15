import { supabase } from './supabaseClient';

// This is a stub implementation - you should adapt to match your actual API
const settingsService = {
  // Hikvision specific settings
  getHikvisionSettings: async (branchId?: string) => {
    const { data, error } = await supabase
      .from('hikvision_api_settings')
      .select('*')
      .eq('branch_id', branchId || '')
      .single();
    
    if (error) throw error;
    return { data, error: null };
  },
  
  saveHikvisionSettings: async (settings: any) => {
    // Implementation
    return { success: true };
  },
  
  testHikvisionConnection: async (settings: any) => {
    // Implementation 
    return { success: true, message: 'Connection successful' };
  },
  
  // Generic integration settings methods
  getIntegrationSettings: async (integrationKey: string, branchId?: string) => {
    const { data, error } = await supabase
      .from('integration_statuses')
      .select('*')
      .eq('integration_key', integrationKey)
      .eq('branch_id', branchId || '')
      .single();
    
    if (error) {
      console.error('Error fetching integration settings:', error);
      throw error;
    }
    
    return { data, error: null };
  },
  
  saveIntegrationSettings: async (integrationKey: string, settings: any, branchId?: string) => {
    // Implementation
    return { success: true };
  },
  
  testIntegrationConnection: async (integrationKey: string, settings: any) => {
    // Implementation
    return { success: true, message: 'Connection successful' };
  },
  
  // SMS settings
  getSmsSettings: async () => {
    const { data, error } = await supabase
      .from('sms_settings')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },
  
  saveSmsSettings: async (settings: any) => {
    const { data, error } = await supabase
      .from('sms_settings')
      .upsert(settings)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Email settings
  getEmailSettings: async () => {
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },
  
  saveEmailSettings: async (settings: any) => {
    const { data, error } = await supabase
      .from('email_settings')
      .upsert(settings)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // WhatsApp settings
  getWhatsappSettings: async () => {
    const { data, error } = await supabase
      .from('whatsapp_settings')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },
  
  saveWhatsappSettings: async (settings: any) => {
    const { data, error } = await supabase
      .from('whatsapp_settings')
      .upsert(settings)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Message templates
  getTemplates: async (type: 'email' | 'sms' | 'whatsapp') => {
    const { data, error } = await supabase
      .from(`${type}_templates`)
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  saveTemplate: async (type: 'email' | 'sms' | 'whatsapp', template: any) => {
    const { data, error } = await supabase
      .from(`${type}_templates`)
      .upsert(template)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  deleteTemplate: async (type: 'email' | 'sms' | 'whatsapp', templateId: string) => {
    const { error } = await supabase
      .from(`${type}_templates`)
      .delete()
      .eq('id', templateId);
    
    if (error) throw error;
    return { success: true };
  }
};

export default settingsService;
